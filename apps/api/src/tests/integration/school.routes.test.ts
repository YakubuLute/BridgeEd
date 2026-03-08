import mongoose from "mongoose";
import request from "supertest";
import { Role } from "@bridgeed/shared";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../../app";
import { SchoolModel } from "../../models/school.model";
import { createAccessToken } from "../../utils/jwt";

const API_PREFIX = "/api/v1";

const createSchoolAdminToken = (schoolId = "school-demo-001"): string =>
  createAccessToken({
    userId: "school-admin-1",
    role: Role.SchoolAdmin,
    name: "School Admin",
    scope: {
      schoolId,
      districtId: "district-demo-001",
      region: "Greater Accra"
    },
    ttlMinutes: 60
  });

const createNationalAdminToken = (): string =>
  createAccessToken({
    userId: "national-admin-1",
    role: Role.NationalAdmin,
    name: "National Admin",
    scope: {
      region: "Greater Accra"
    },
    ttlMinutes: 60
  });

describe("School routes", () => {
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
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("returns 401 for unauthenticated request", async () => {
    const response = await request(app).get(`${API_PREFIX}/schools/school-demo-001`);
    expect(response.status).toBe(401);
    expect(response.body?.error?.code).toBe("UNAUTHORIZED");
  });

  it("allows school admin to fetch own school details", async () => {
    const token = createSchoolAdminToken("school-demo-001");
    const response = await request(app)
      .get(`${API_PREFIX}/schools/school-demo-001`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body?.data?.schoolId).toBe("school-demo-001");
    expect(response.body?.data?.name).toBe("BridgeEd Demo School 1");
  });

  it("blocks school admin from fetching another school", async () => {
    const token = createSchoolAdminToken("school-demo-001");
    const response = await request(app)
      .get(`${API_PREFIX}/schools/school-demo-002`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body?.error?.code).toBe("FORBIDDEN");
  });

  it("allows national admin to fetch school details", async () => {
    const token = createNationalAdminToken();
    const response = await request(app)
      .get(`${API_PREFIX}/schools/school-demo-002`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body?.data?.schoolId).toBe("school-demo-002");
  });

  it("returns 404 for unknown school", async () => {
    const token = createNationalAdminToken();
    const response = await request(app)
      .get(`${API_PREFIX}/schools/school-unknown-001`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body?.error?.code).toBe("SCHOOL_NOT_FOUND");
  });
});
