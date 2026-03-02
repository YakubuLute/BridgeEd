import { model, Schema } from "mongoose";

type AttemptDocument = {
  attemptId: string;
  learnerId: string;
  classId: string;
  assessmentName: string;
  domain?: string;
  score?: number | null;
  assessedAt: Date;
};

const AttemptSchema = new Schema<AttemptDocument>(
  {
    attemptId: { type: String, required: true, unique: true, trim: true, index: true },
    learnerId: { type: String, required: true, trim: true, index: true },
    classId: { type: String, required: true, trim: true, index: true },
    assessmentName: { type: String, required: true, trim: true },
    domain: { type: String, trim: true },
    score: { type: Number, min: 0, max: 100, default: null },
    assessedAt: { type: Date, required: true, index: true }
  },
  {
    timestamps: true
  }
);

AttemptSchema.index({ learnerId: 1, assessedAt: -1 });

export const AttemptModel = model<AttemptDocument>("Attempt", AttemptSchema);
