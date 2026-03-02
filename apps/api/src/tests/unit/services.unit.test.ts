import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { GradeLevel, Role } from "@bridgeed/shared";

import { ClassModel } from "../../models/class.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { LearnerModel } from "../../models/learner.model";
import { classService } from "../../services/classes/class.service";
import { learnerService } from "../../services/learners/learner.service";
import { learnerProfileService } from "../../services/profile/learner-profile.service";
import { createUuidV7 } from "../../utils/uuid";

describe("Service unit behavior", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("requires school scope for class creation", async () => {
    await expect(
      classService.createClass(
        {
          userId: "teacher-1",
          role: Role.Teacher,
          name: "Teacher One",
          scope: {}
        },
        {
          name: "JHS 1A",
          gradeLevel: GradeLevel.JHS1
        }
      )
    ).rejects.toMatchObject({
      code: "SCOPE_REQUIRED"
    });
  });

  it("validates class existence for learner creation", async () => {
    await expect(
      learnerService.createLearner(
        {
          userId: "teacher-1",
          role: Role.Teacher,
          name: "Teacher One",
          scope: { schoolId: "school-demo-001" }
        },
        {
          classId: "unknown-class",
          name: "Ama Serwaa",
          gradeLevel: GradeLevel.JHS1
        }
      )
    ).rejects.toMatchObject({
      code: "CLASS_NOT_FOUND"
    });
  });

  it("builds learner profile mastery trends sorted by measured date", async () => {
    const classId = createUuidV7();
    await ClassModel.create({
      classId,
      schoolId: "school-demo-001",
      teacherId: "teacher-1",
      name: "JHS 2A",
      gradeLevel: GradeLevel.JHS2,
      isActive: true
    });

    const learnerId = createUuidV7();
    await LearnerModel.create({
      learnerId,
      schoolId: "school-demo-001",
      classId,
      name: "Kweku Appiah",
      gradeLevel: GradeLevel.JHS2,
      createdBy: "teacher-1"
    });

    await DiagnosticResultModel.insertMany([
      {
        diagnosticResultId: createUuidV7(),
        learnerId,
        skillCode: "fractions",
        skillName: "Fractions",
        masteryScore: 60,
        confidence: 0.7,
        measuredAt: new Date("2026-02-11T00:00:00.000Z")
      },
      {
        diagnosticResultId: createUuidV7(),
        learnerId,
        skillCode: "fractions",
        skillName: "Fractions",
        masteryScore: 75,
        confidence: 0.8,
        measuredAt: new Date("2026-02-20T00:00:00.000Z")
      }
    ]);

    const profile = await learnerProfileService.getLearnerProfile(
      {
        userId: "teacher-1",
        role: Role.Teacher,
        name: "Teacher One",
        scope: { schoolId: "school-demo-001" }
      },
      learnerId
    );

    expect(profile.masteryTrends).toHaveLength(1);
    expect(profile.masteryTrends[0]?.skillCode).toBe("fractions");
    expect(profile.masteryTrends[0]?.points[0]?.masteryScore).toBe(60);
    expect(profile.masteryTrends[0]?.points[1]?.masteryScore).toBe(75);
  });
});
