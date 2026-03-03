import { GradeLevel, Role } from "@bridgeed/shared";

import { AttemptModel } from "../../models/attempt.model";
import { ClassModel } from "../../models/class.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { LearnerModel } from "../../models/learner.model";
import { SchoolModel } from "../../models/school.model";
import { UserModel } from "../../models/user.model";
import { createUuidV7 } from "../../utils/uuid";
import { hashPassword } from "../../utils/password";

type SeedClass = {
  academicYear: string;
  gradeLevel: GradeLevel;
  key: string;
  name: string;
  subject: string;
};

type SeedLearner = {
  classKey: string;
  gradeLevel: GradeLevel;
  literacyBaseline: number;
  name: string;
  numeracyBaseline: number;
};

type AssessmentCycle = {
  date: string;
  scoreOffset: number;
  weekLabel: string;
};

const seedSchoolId = "school-demo-001";
const seedTeacherUserId = "teacher-1";
const seedAcademicYear = "2025/2026";

const seedClasses: SeedClass[] = [
  {
    key: "jhs1a",
    name: "JHS 1A",
    gradeLevel: GradeLevel.JHS1,
    subject: "Mathematics",
    academicYear: seedAcademicYear
  },
  {
    key: "jhs1b",
    name: "JHS 1B",
    gradeLevel: GradeLevel.JHS1,
    subject: "English",
    academicYear: seedAcademicYear
  },
  {
    key: "jhs2a",
    name: "JHS 2A",
    gradeLevel: GradeLevel.JHS2,
    subject: "Mathematics",
    academicYear: seedAcademicYear
  },
  {
    key: "shs1c",
    name: "SHS 1C",
    gradeLevel: GradeLevel.SHS1,
    subject: "English",
    academicYear: seedAcademicYear
  }
];

const seedLearners: SeedLearner[] = [
  { classKey: "jhs1a", name: "Kwame Mensah", gradeLevel: GradeLevel.JHS1, literacyBaseline: 45, numeracyBaseline: 52 },
  { classKey: "jhs1a", name: "Akua Asante", gradeLevel: GradeLevel.JHS1, literacyBaseline: 78, numeracyBaseline: 82 },
  { classKey: "jhs1a", name: "Kofi Owusu", gradeLevel: GradeLevel.JHS1, literacyBaseline: 62, numeracyBaseline: 58 },
  { classKey: "jhs1a", name: "Ama Sarpong", gradeLevel: GradeLevel.JHS1, literacyBaseline: 85, numeracyBaseline: 88 },
  { classKey: "jhs1a", name: "Yaw Boateng", gradeLevel: GradeLevel.JHS1, literacyBaseline: 48, numeracyBaseline: 50 },
  { classKey: "jhs1b", name: "Efua Osei", gradeLevel: GradeLevel.JHS1, literacyBaseline: 74, numeracyBaseline: 71 },
  { classKey: "jhs1b", name: "Kojo Frimpong", gradeLevel: GradeLevel.JHS1, literacyBaseline: 56, numeracyBaseline: 60 },
  { classKey: "jhs1b", name: "Adwoa Nyarko", gradeLevel: GradeLevel.JHS1, literacyBaseline: 81, numeracyBaseline: 76 },
  { classKey: "jhs2a", name: "Nana Addo", gradeLevel: GradeLevel.JHS2, literacyBaseline: 68, numeracyBaseline: 64 },
  { classKey: "jhs2a", name: "Abena Koomson", gradeLevel: GradeLevel.JHS2, literacyBaseline: 90, numeracyBaseline: 86 },
  { classKey: "shs1c", name: "Selorm Tetteh", gradeLevel: GradeLevel.SHS1, literacyBaseline: 72, numeracyBaseline: 79 },
  { classKey: "shs1c", name: "Mawuli Afi", gradeLevel: GradeLevel.SHS1, literacyBaseline: 54, numeracyBaseline: 49 }
];

const assessmentCycles: AssessmentCycle[] = [
  { weekLabel: "Week 1", date: "2026-01-20", scoreOffset: -10 },
  { weekLabel: "Week 3", date: "2026-02-03", scoreOffset: -4 },
  { weekLabel: "Week 6", date: "2026-02-24", scoreOffset: 0 }
];

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const learnerMapKey = (classKey: string, learnerName: string): string => `${classKey}|${learnerName.toLowerCase()}`;
const attemptMapKey = (learnerId: string, assessmentName: string, assessedAtIso: string): string =>
  `${learnerId}|${assessmentName}|${assessedAtIso}`;

export const bootstrapSeedData = async (): Promise<void> => {
  const teacherPasswordHash = await hashPassword("Teacher123");

  await Promise.all([
    SchoolModel.updateOne(
      { schoolId: seedSchoolId },
      {
        $set: {
          name: "BridgeEd Demo School",
          district: "Accra Metro",
          region: "Greater Accra",
          isActive: true
        }
      },
      { upsert: true }
    ),
    UserModel.updateOne(
      { userId: seedTeacherUserId },
      {
        $set: {
          name: "Teacher Name",
          email: "teacher@bridgeed.gh",
          passwordHash: teacherPasswordHash,
          failedLoginAttempts: 0,
          lockedUntilMs: null,
          role: Role.Teacher,
          scope: {
            schoolId: seedSchoolId,
            districtId: "district-accra-metro-001",
            region: "Greater Accra"
          }
        }
      },
      { upsert: true }
    )
  ]);

  await ClassModel.bulkWrite(
    seedClasses.map((classSeed) => ({
      updateOne: {
        filter: {
          schoolId: seedSchoolId,
          teacherId: seedTeacherUserId,
          name: classSeed.name,
          gradeLevel: classSeed.gradeLevel,
          academicYear: classSeed.academicYear
        },
        update: {
          $set: {
            schoolId: seedSchoolId,
            teacherId: seedTeacherUserId,
            name: classSeed.name,
            gradeLevel: classSeed.gradeLevel,
            subject: classSeed.subject,
            academicYear: classSeed.academicYear,
            isActive: true
          },
          $setOnInsert: {
            classId: createUuidV7()
          }
        },
        upsert: true
      }
    }))
  );

  const classRecords = await ClassModel.find({
    schoolId: seedSchoolId,
    teacherId: seedTeacherUserId,
    academicYear: seedAcademicYear
  }).exec();

  const classByKey = new Map<string, (typeof classRecords)[number]>();
  for (const classSeed of seedClasses) {
    const classRecord = classRecords.find(
      (value) =>
        value.name === classSeed.name &&
        value.gradeLevel === classSeed.gradeLevel &&
        value.academicYear === classSeed.academicYear
    );
    if (classRecord) {
      classByKey.set(classSeed.key, classRecord);
    }
  }

  await LearnerModel.bulkWrite(
    seedLearners.flatMap((learnerSeed) => {
      const classRecord = classByKey.get(learnerSeed.classKey);
      if (!classRecord) {
        return [];
      }

      return [
        {
          updateOne: {
            filter: {
              schoolId: seedSchoolId,
              classId: classRecord.classId,
              name: learnerSeed.name,
              gradeLevel: learnerSeed.gradeLevel
            },
            update: {
              $set: {
                schoolId: seedSchoolId,
                classId: classRecord.classId,
                name: learnerSeed.name,
                gradeLevel: learnerSeed.gradeLevel,
                createdBy: seedTeacherUserId
              },
              $setOnInsert: {
                learnerId: createUuidV7()
              }
            },
            upsert: true
          }
        }
      ];
    })
  );

  const learnerRecords = await LearnerModel.find({
    createdBy: seedTeacherUserId,
    schoolId: seedSchoolId
  }).exec();

  const learnerByKey = new Map<string, (typeof learnerRecords)[number]>();
  for (const learnerSeed of seedLearners) {
    const classRecord = classByKey.get(learnerSeed.classKey);
    if (!classRecord) {
      continue;
    }

    const learnerRecord = learnerRecords.find(
      (value) =>
        value.classId === classRecord.classId &&
        value.name.toLowerCase() === learnerSeed.name.toLowerCase() &&
        value.gradeLevel === learnerSeed.gradeLevel
    );
    if (learnerRecord) {
      learnerByKey.set(learnerMapKey(learnerSeed.classKey, learnerSeed.name), learnerRecord);
    }
  }

  const attemptOps = seedLearners.flatMap((learnerSeed) => {
    const classRecord = classByKey.get(learnerSeed.classKey);
    const learnerRecord = learnerByKey.get(learnerMapKey(learnerSeed.classKey, learnerSeed.name));
    if (!classRecord || !learnerRecord) {
      return [];
    }

    return assessmentCycles.flatMap((cycle) => {
      const literacyScore = clampScore(learnerSeed.literacyBaseline + cycle.scoreOffset);
      const numeracyScore = clampScore(learnerSeed.numeracyBaseline + cycle.scoreOffset);
      const literacyDate = new Date(`${cycle.date}T09:00:00.000Z`);
      const numeracyDate = new Date(`${cycle.date}T10:30:00.000Z`);

      return [
        {
          updateOne: {
            filter: {
              learnerId: learnerRecord.learnerId,
              assessmentName: `Literacy Screener (${cycle.weekLabel})`,
              assessedAt: literacyDate
            },
            update: {
              $set: {
                learnerId: learnerRecord.learnerId,
                classId: classRecord.classId,
                assessmentName: `Literacy Screener (${cycle.weekLabel})`,
                domain: "Literacy",
                score: literacyScore,
                assessedAt: literacyDate
              },
              $setOnInsert: {
                attemptId: createUuidV7()
              }
            },
            upsert: true
          }
        },
        {
          updateOne: {
            filter: {
              learnerId: learnerRecord.learnerId,
              assessmentName: `Numeracy Screener (${cycle.weekLabel})`,
              assessedAt: numeracyDate
            },
            update: {
              $set: {
                learnerId: learnerRecord.learnerId,
                classId: classRecord.classId,
                assessmentName: `Numeracy Screener (${cycle.weekLabel})`,
                domain: "Numeracy",
                score: numeracyScore,
                assessedAt: numeracyDate
              },
              $setOnInsert: {
                attemptId: createUuidV7()
              }
            },
            upsert: true
          }
        }
      ];
    });
  });

  if (attemptOps.length > 0) {
    await AttemptModel.bulkWrite(attemptOps);
  }

  const attemptRecords = await AttemptModel.find({
    learnerId: { $in: Array.from(learnerByKey.values()).map((learner) => learner.learnerId) }
  }).exec();

  const attemptsByKey = new Map<string, (typeof attemptRecords)[number]>();
  for (const attempt of attemptRecords) {
    attemptsByKey.set(attemptMapKey(attempt.learnerId, attempt.assessmentName, attempt.assessedAt.toISOString()), attempt);
  }

  const diagnosticOps = seedLearners.flatMap((learnerSeed) => {
    const learnerRecord = learnerByKey.get(learnerMapKey(learnerSeed.classKey, learnerSeed.name));
    if (!learnerRecord) {
      return [];
    }

    return assessmentCycles.flatMap((cycle) => {
      const literacyScore = clampScore(learnerSeed.literacyBaseline + cycle.scoreOffset);
      const numeracyScore = clampScore(learnerSeed.numeracyBaseline + cycle.scoreOffset);

      const literacyDate = new Date(`${cycle.date}T09:00:00.000Z`);
      const numeracyDate = new Date(`${cycle.date}T10:30:00.000Z`);
      const literacyAssessmentName = `Literacy Screener (${cycle.weekLabel})`;
      const numeracyAssessmentName = `Numeracy Screener (${cycle.weekLabel})`;
      const literacyAttempt = attemptsByKey.get(
        attemptMapKey(learnerRecord.learnerId, literacyAssessmentName, literacyDate.toISOString())
      );
      const numeracyAttempt = attemptsByKey.get(
        attemptMapKey(learnerRecord.learnerId, numeracyAssessmentName, numeracyDate.toISOString())
      );

      return [
        {
          updateOne: {
            filter: {
              learnerId: learnerRecord.learnerId,
              skillCode: "literacy_phonics_decoding",
              measuredAt: literacyDate
            },
            update: {
              $set: {
                learnerId: learnerRecord.learnerId,
                attemptId: literacyAttempt?.attemptId,
                skillCode: "literacy_phonics_decoding",
                skillName: "Phonics & Decoding",
                masteryScore: clampScore(literacyScore - 3),
                confidence: 0.78,
                measuredAt: literacyDate,
                modelVersion: "seeded-manual-v1"
              },
              $setOnInsert: {
                diagnosticResultId: createUuidV7()
              }
            },
            upsert: true
          }
        },
        {
          updateOne: {
            filter: {
              learnerId: learnerRecord.learnerId,
              skillCode: "literacy_reading_fluency",
              measuredAt: literacyDate
            },
            update: {
              $set: {
                learnerId: learnerRecord.learnerId,
                attemptId: literacyAttempt?.attemptId,
                skillCode: "literacy_reading_fluency",
                skillName: "Reading Fluency",
                masteryScore: clampScore(literacyScore + 2),
                confidence: 0.8,
                measuredAt: literacyDate,
                modelVersion: "seeded-manual-v1"
              },
              $setOnInsert: {
                diagnosticResultId: createUuidV7()
              }
            },
            upsert: true
          }
        },
        {
          updateOne: {
            filter: {
              learnerId: learnerRecord.learnerId,
              skillCode: "numeracy_number_sense",
              measuredAt: numeracyDate
            },
            update: {
              $set: {
                learnerId: learnerRecord.learnerId,
                attemptId: numeracyAttempt?.attemptId,
                skillCode: "numeracy_number_sense",
                skillName: "Number Sense",
                masteryScore: clampScore(numeracyScore - 2),
                confidence: 0.77,
                measuredAt: numeracyDate,
                modelVersion: "seeded-manual-v1"
              },
              $setOnInsert: {
                diagnosticResultId: createUuidV7()
              }
            },
            upsert: true
          }
        },
        {
          updateOne: {
            filter: {
              learnerId: learnerRecord.learnerId,
              skillCode: "numeracy_operations",
              measuredAt: numeracyDate
            },
            update: {
              $set: {
                learnerId: learnerRecord.learnerId,
                attemptId: numeracyAttempt?.attemptId,
                skillCode: "numeracy_operations",
                skillName: "Operations",
                masteryScore: clampScore(numeracyScore + 3),
                confidence: 0.81,
                measuredAt: numeracyDate,
                modelVersion: "seeded-manual-v1"
              },
              $setOnInsert: {
                diagnosticResultId: createUuidV7()
              }
            },
            upsert: true
          }
        }
      ];
    });
  });

  if (diagnosticOps.length > 0) {
    await DiagnosticResultModel.bulkWrite(diagnosticOps);
  }
};
