import { model, Schema } from "mongoose";
import { GradeLevel } from "@bridgeed/shared";

type ClassDocument = {
  classId: string;
  schoolId: string;
  teacherId: string;
  name: string;
  gradeLevel: GradeLevel;
  subject?: string;
  academicYear?: string;
  isActive: boolean;
};

const ClassSchema = new Schema<ClassDocument>(
  {
    classId: { type: String, required: true, unique: true, trim: true, index: true },
    schoolId: { type: String, required: true, trim: true, index: true },
    teacherId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    gradeLevel: {
      type: String,
      required: true,
      enum: Object.values(GradeLevel),
      index: true
    },
    subject: { type: String, trim: true },
    academicYear: { type: String, trim: true },
    isActive: { type: Boolean, default: true, required: true }
  },
  {
    timestamps: true
  }
);

ClassSchema.index(
  {
    schoolId: 1,
    name: 1,
    gradeLevel: 1,
    academicYear: 1
  },
  { unique: true }
);

export const ClassModel = model<ClassDocument>("Class", ClassSchema);
