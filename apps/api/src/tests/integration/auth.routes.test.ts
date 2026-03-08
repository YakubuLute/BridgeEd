import mongoose from "mongoose";
import request from "supertest";
import { Role } from "@bridgeed/shared";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../../app";
import { SchoolModel } from "../../models/school.model";
import { UserModel } from "../../models/user.model";
import { hashPassword } from "../../utils/password";

const API_PREFIX = "/api/v1";

describe("Auth routes", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    await SchoolModel.insertMany([
      {
        schoolId: "school-demo-001",
        name: "BridgeEd Demo School 1",
        district: "Accra Metro",
        region: "Greater Accra",
        isActive: true
      },
      {
        schoolId: "school-demo-002",
        name: "BridgeEd Demo School 2",
        district: "Tema Metro",
        region: "Greater Accra",
        isActive: true
      },
      {
        schoolId: "school-inactive-001",
        name: "Inactive School",
        district: "Kumasi Metro",
        region: "Ashanti",
        isActive: false
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("registers a teacher account and returns a secure session", async () => {
    const response = await request(app).post(`${API_PREFIX}/auth/email/register`).send({
      name: "Teacher One",
      schoolId: "school-demo-001",
      email: "teacher.one@bridgeed.gh",
      password: "Teacher123"
    });

    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.user.role).toBe(Role.Teacher);
    expect(response.body.data.user.scope.schoolId).toBe("school-demo-001");

    const createdUser = await UserModel.findOne({ email: "teacher.one@bridgeed.gh" }).exec();
    expect(createdUser).not.toBeNull();
    expect(createdUser?.passwordHash).toEqual(expect.any(String));
    expect(createdUser?.passwordHash).not.toBe("Teacher123");
  });

  it("rejects duplicate email registration", async () => {
    const payload = {
      name: "Teacher One",
      schoolId: "school-demo-001",
      email: "teacher.one@bridgeed.gh",
      password: "Teacher123"
    };

    const firstResponse = await request(app).post(`${API_PREFIX}/auth/email/register`).send(payload);
    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await request(app).post(`${API_PREFIX}/auth/email/register`).send({
      ...payload,
      email: "TEACHER.ONE@BRIDGEED.GH"
    });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body?.error?.code).toBe("EMAIL_ALREADY_REGISTERED");
  });

  it("allows email login after registration", async () => {
    await request(app).post(`${API_PREFIX}/auth/email/register`).send({
      name: "Teacher Two",
      schoolId: "school-demo-002",
      email: "teacher.two@bridgeed.gh",
      password: "Teacher123"
    });

    const loginResponse = await request(app).post(`${API_PREFIX}/auth/email/login`).send({
      email: "teacher.two@bridgeed.gh",
      password: "Teacher123"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.accessToken).toEqual(expect.any(String));
    expect(loginResponse.body.data.user.id).toEqual(expect.any(String));
    expect(loginResponse.body.data.user.scope.schoolId).toBe("school-demo-002");
  });

  it("validates registration payload", async () => {
    const response = await request(app).post(`${API_PREFIX}/auth/email/register`).send({
      name: "",
      schoolId: "",
      email: "invalid-email",
      password: "weak"
    });

    expect(response.status).toBe(400);
    expect(response.body?.error?.code).toBe("VALIDATION_ERROR");
  });

  it("rejects registration with unknown school identifier", async () => {
    const response = await request(app).post(`${API_PREFIX}/auth/email/register`).send({
      name: "Teacher Three",
      schoolId: "school-unknown-999",
      email: "teacher.three@bridgeed.gh",
      password: "Teacher123"
    });

    expect(response.status).toBe(400);
    expect(response.body?.error?.code).toBe("INVALID_SCHOOL_IDENTIFIER");
  });

  it("rejects registration with inactive school identifier", async () => {
    const response = await request(app).post(`${API_PREFIX}/auth/email/register`).send({
      name: "Teacher Four",
      schoolId: "school-inactive-001",
      email: "teacher.four@bridgeed.gh",
      password: "Teacher123"
    });

    expect(response.status).toBe(400);
    expect(response.body?.error?.code).toBe("INVALID_SCHOOL_IDENTIFIER");
  });

  it("returns roles array for users with multiple assigned roles", async () => {
    await UserModel.create({
      userId: "multi-role-1",
      name: "Multi Role User",
      email: "multi.role@bridgeed.gh",
      passwordHash: await hashPassword("Teacher123"),
      role: Role.Teacher,
      roles: [Role.Teacher, Role.SchoolAdmin],
      scope: {
        schoolId: "school-demo-001",
        districtId: "district-demo-001",
        region: "Greater Accra"
      }
    });

    const loginResponse = await request(app).post(`${API_PREFIX}/auth/email/login`).send({
      email: "multi.role@bridgeed.gh",
      password: "Teacher123"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body?.data?.user?.role).toBe(Role.Teacher);
    expect(loginResponse.body?.data?.user?.roles).toEqual(
      expect.arrayContaining([Role.Teacher, Role.SchoolAdmin])
    );
  });
});
