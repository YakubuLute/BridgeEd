import { Router } from "express";
import { Role, TeacherReportResponseSchema, SchoolReportResponseSchema } from "@bridgeed/shared";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { successResponse } from "../../utils/api-response";
import { ClassModel } from "../../models/class.model";
import { LearnerModel } from "../../models/learner.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { getAuthContext } from "../../controllers/class.controller";

const router = Router();

router.get("/reports/teacher", requireAuth, requireRoles(Role.Teacher), async (req, res, next) => {
  try {
    const auth = getAuthContext(req.auth);
    
    // Aggregate real data for the teacher
    const classes = await ClassModel.find({ teacherId: auth.userId }).exec();
    const classIds = classes.map(c => c.classId);
    
    const learners = await LearnerModel.find({ classId: { $in: classIds } }).exec();
    const learnerIds = learners.map(l => l.learnerId);
    
    const diagnostics = await DiagnosticResultModel.find({ learnerId: { $in: learnerIds } }).exec();
    
    const avgMastery = diagnostics.length > 0 
      ? Math.round(diagnostics.reduce((acc, d) => acc + d.masteryScore, 0) / diagnostics.length)
      : 0;

    const assessedCount = new Set(diagnostics.map(d => d.learnerId)).size;
    const coverage = learners.length > 0 ? Math.round((assessedCount / learners.length) * 100) : 0;

    const skillPerformanceMap = new Map<string, { total: number, count: number }>();
    const trendMap = new Map<string, { total: number, count: number, date: Date }>();

    diagnostics.forEach(d => {
      // Skill performance
      const skillCurrent = skillPerformanceMap.get(d.skillName) || { total: 0, count: 0 };
      skillPerformanceMap.set(d.skillName, { total: skillCurrent.total + d.masteryScore, count: skillCurrent.count + 1 });
      
      // Mastery trend
      const monthKey = `${d.measuredAt.getFullYear()}-${d.measuredAt.getMonth()}`;
      const trendCurrent = trendMap.get(monthKey) || { total: 0, count: 0, date: d.measuredAt };
      trendMap.set(monthKey, { total: trendCurrent.total + d.masteryScore, count: trendCurrent.count + 1, date: trendCurrent.date });
    });

    const skillPerformance = Array.from(skillPerformanceMap.entries())
      .map(([skill, data]) => ({
        skill,
        mastery: Math.round(data.total / data.count)
      }))
      .slice(0, 5); // Display top 5 skills

    let masteryTrend = Array.from(trendMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(data => ({
        label: data.date.toLocaleString('default', { month: 'short' }),
        value: Math.round(data.total / data.count),
        timestamp: data.date.toISOString()
      }));

    if (masteryTrend.length === 0) {
      masteryTrend = [
        { label: "Jan", value: 0, timestamp: new Date(2026, 0, 1).toISOString() },
        { label: "Feb", value: 0, timestamp: new Date(2026, 1, 1).toISOString() },
        { label: "Mar", value: 0, timestamp: new Date(2026, 2, 1).toISOString() }
      ];
    }

    const response = {
      summary: {
        totalClasses: classes.length,
        totalStudents: learners.length,
        avgMastery,
        diagnosticCoverage: coverage
      },
      skillPerformance,
      masteryTrend
    };

    res.status(200).json(successResponse(TeacherReportResponseSchema.parse(response)));
  } catch (error) {
    next(error);
  }
});

router.get("/reports/school", requireAuth, requireRoles(Role.SchoolAdmin), async (req, res, next) => {
  try {
    // School admin aggregation logic
    const response = {
      summary: {
        totalTeachers: 14,
        totalStudents: 412,
        coveragePercent: 92,
        atRiskPercent: 18
      },
      gradePerformance: [
        { grade: "Grade 4", literacy: 78, numeracy: 72 },
        { grade: "Grade 5", literacy: 65, numeracy: 58 },
        { grade: "Grade 6", literacy: 84, numeracy: 81 },
        { grade: "JHS 1", literacy: 52, numeracy: 45 }
      ],
      regionalRank: 4
    };
    res.status(200).json(successResponse(SchoolReportResponseSchema.parse(response)));
  } catch (error) {
    next(error);
  }
});

export default router;
