import mongoose from "mongoose";
import request from "supertest";
import { Role } from "@bridgeed/shared";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../../app";
import { AttemptModel } from "../../models/attempt.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { bootstrapSeedData } from "../../services/bootstrap/bootstrap.service";
import { createAccessToken } from "../../utils/jwt";
import { createUuidV7 } from "../../utils/uuid";

const API_PREFIX = "/api/v1";

const loginAsTeacher = async (): Promise<{
  token: string;
  userId: string;
}> => {
  const response = await request(app).post(`${API_PREFIX}/auth/email/login`).send({
    email: "teacher@bridgeed.gh",
    password: "Teacher123"
  });

  expect(response.status).toBe(200);
  expect(response.body?.data?.accessToken).toEqual(expect.any(String));
  expect(response.body?.data?.user?.id).toEqual(expect.any(String));

  return {
    token: response.body.data.accessToken as string,
    userId: response.body.data.user.id as string
  };
};

describe("Class and learner routes", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await bootstrapSeedData();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("returns 401 for protected routes without auth", async () => {
    const response = await request(app).get(`${API_PREFIX}/classes`);
    expect(response.status).toBe(401);
    expect(response.body?.error?.code).toBe("UNAUTHORIZED");
  });

  it("creates class with teacher school scope and validates grade requirement", async () => {
    const { token, userId } = await loginAsTeacher();

    const invalidResponse = await request(app).post(`${API_PREFIX}/classes`).set("Authorization", `Bearer ${token}`).send({
      name: "JHS 1A"
    });
    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body?.error?.code).toBe("VALIDATION_ERROR");

    const response = await request(app).post(`${API_PREFIX}/classes`).set("Authorization", `Bearer ${token}`).send({
      name: "JHS 1A",
      gradeLevel: "JHS1",
      subject: "Mathematics"
    });

    expect(response.status).toBe(201);
    expect(response.body.data.schoolId).toBe("school-demo-001");
    expect(response.body.data.teacherId).toBe(userId);
    expect(response.body.data.gradeLevel).toBe("JHS1");
  });

  it("creates a learner with generated UUIDv7 ID and validates required fields", async () => {
    const { token } = await loginAsTeacher();
    const createClassResponse = await request(app).post(`${API_PREFIX}/classes`).set("Authorization", `Bearer ${token}`).send({
      name: "JHS 1B",
      gradeLevel: "JHS1"
    });

    const classId = createClassResponse.body?.data?.classId as string;

    const invalidResponse = await request(app).post(`${API_PREFIX}/learners`).set("Authorization", `Bearer ${token}`).send({
      classId,
      gradeLevel: "JHS1"
    });
    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body?.error?.code).toBe("VALIDATION_ERROR");

    const response = await request(app).post(`${API_PREFIX}/learners`).set("Authorization", `Bearer ${token}`).send({
      classId,
      name: "Kwame Mensah",
      gradeLevel: "JHS1"
    });

    expect(response.status).toBe(201);
    expect(response.body.data.learnerId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("handles batch create validation and success flow", async () => {
    const { token } = await loginAsTeacher();
    const classResponse = await request(app).post(`${API_PREFIX}/classes`).set("Authorization", `Bearer ${token}`).send({
      name: "JHS 2A",
      gradeLevel: "JHS2"
    });

    const classId = classResponse.body?.data?.classId as string;

    const invalidResponse = await request(app)
      .post(`${API_PREFIX}/learners/batch`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        classId,
        rows: []
      });
    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body?.error?.code).toBe("VALIDATION_ERROR");

    const response = await request(app)
      .post(`${API_PREFIX}/learners/batch`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        classId,
        rows: [
          { name: "Akua Asante", gradeLevel: "JHS2" },
          { name: "Kofi Owusu", gradeLevel: "JHS2" }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.data.createdCount).toBe(2);
    expect(response.body.data.learners).toHaveLength(2);
  });

  it("returns empty learner profile arrays and later returns populated trends/timeline", async () => {
    const { token } = await loginAsTeacher();
    const classResponse = await request(app).post(`${API_PREFIX}/classes`).set("Authorization", `Bearer ${token}`).send({
      name: "SHS 1C",
      gradeLevel: "SHS1"
    });
    const classId = classResponse.body?.data?.classId as string;

    const learnerResponse = await request(app).post(`${API_PREFIX}/learners`).set("Authorization", `Bearer ${token}`).send({
      classId,
      name: "Yaw Boateng",
      gradeLevel: "SHS1"
    });

    const learnerId = learnerResponse.body?.data?.learnerId as string;

    const emptyProfileResponse = await request(app)
      .get(`${API_PREFIX}/learners/${learnerId}/profile`)
      .set("Authorization", `Bearer ${token}`);
    expect(emptyProfileResponse.status).toBe(200);
    expect(emptyProfileResponse.body.data.assessmentTimeline).toEqual([]);
    expect(emptyProfileResponse.body.data.masteryTrends).toEqual([]);

    const attemptId = createUuidV7();
    await AttemptModel.create({
      attemptId,
      learnerId,
      classId,
      assessmentName: "Literacy Screener",
      domain: "Literacy",
      score: 62,
      assessedAt: new Date("2026-02-20T00:00:00.000Z")
    });
    await DiagnosticResultModel.create({
      diagnosticResultId: createUuidV7(),
      learnerId,
      attemptId,
      skillCode: "phonics_decoding",
      skillName: "Phonics & Decoding",
      masteryScore: 62,
      confidence: 0.82,
      measuredAt: new Date("2026-02-20T00:00:00.000Z"),
      modelVersion: "manual-v1"
    });

    const populatedProfileResponse = await request(app)
      .get(`${API_PREFIX}/learners/${learnerId}/profile`)
      .set("Authorization", `Bearer ${token}`);

    expect(populatedProfileResponse.status).toBe(200);
    expect(populatedProfileResponse.body.data.assessmentTimeline).toHaveLength(1);
    expect(populatedProfileResponse.body.data.masteryTrends).toHaveLength(1);
    expect(populatedProfileResponse.body.data.masteryTrends[0].skillCode).toBe("phonics_decoding");
  });

  it("blocks cross-school access with 403", async () => {
    const { token } = await loginAsTeacher();
    const createClassResponse = await request(app).post(`${API_PREFIX}/classes`).set("Authorization", `Bearer ${token}`).send({
      name: "TVET 1A",
      gradeLevel: "TVET1"
    });

    const classId = createClassResponse.body?.data?.classId as string;

    const foreignTeacherToken = createAccessToken({
      userId: "teacher-foreign",
      role: Role.Teacher,
      name: "Foreign Teacher",
      scope: {
        schoolId: "school-foreign-001",
        districtId: "district-foreign-001",
        region: "Northern"
      },
      ttlMinutes: 60
    });

    const forbiddenResponse = await request(app)
      .get(`${API_PREFIX}/classes/${classId}/learners`)
      .set("Authorization", `Bearer ${foreignTeacherToken}`);

    expect(forbiddenResponse.status).toBe(403);
    expect(forbiddenResponse.body?.error?.code).toBe("FORBIDDEN");
  });
});
