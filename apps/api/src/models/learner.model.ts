import { model, Schema } from "mongoose";
import { GradeLevel } from "@bridgeed/shared";

type LearnerDocument = {
  learnerId: string;
  schoolId: string;
  classId: string;
  name: string;
  gradeLevel: GradeLevel;
  createdBy: string;
};

const LearnerSchema = new Schema<LearnerDocument>(
  {
    learnerId: { type: String, required: true, unique: true, trim: true, index: true },
    schoolId: { type: String, required: true, trim: true, index: true },
    classId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    gradeLevel: {
      type: String,
      required: true,
      enum: Object.values(GradeLevel),
      index: true
    },
    createdBy: { type: String, required: true, trim: true, index: true }
  },
  {
    timestamps: true
  }
);

LearnerSchema.index({ schoolId: 1, classId: 1, name: 1 });

export const LearnerModel = model<LearnerDocument>("Learner", LearnerSchema);
