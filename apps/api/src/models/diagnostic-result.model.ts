import { model, Schema } from "mongoose";

type DiagnosticResultDocument = {
  diagnosticResultId: string;
  learnerId: string;
  attemptId?: string;
  skillCode: string;
  skillName: string;
  masteryScore: number;
  confidence?: number | null;
  measuredAt: Date;
  modelVersion?: string;
};

const DiagnosticResultSchema = new Schema<DiagnosticResultDocument>(
  {
    diagnosticResultId: { type: String, required: true, unique: true, trim: true, index: true },
    learnerId: { type: String, required: true, trim: true, index: true },
    attemptId: { type: String, trim: true, index: true },
    skillCode: { type: String, required: true, trim: true },
    skillName: { type: String, required: true, trim: true },
    masteryScore: { type: Number, required: true, min: 0, max: 100 },
    confidence: { type: Number, min: 0, max: 1, default: null },
    measuredAt: { type: Date, required: true, index: true },
    modelVersion: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

DiagnosticResultSchema.index({ learnerId: 1, measuredAt: 1 });
DiagnosticResultSchema.index({ learnerId: 1, skillCode: 1, measuredAt: 1 });

export const DiagnosticResultModel = model<DiagnosticResultDocument>(
  "DiagnosticResult",
  DiagnosticResultSchema
);
