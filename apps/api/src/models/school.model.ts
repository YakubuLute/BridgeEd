import { model, Schema } from "mongoose";

type SchoolDocument = {
  schoolId: string;
  name: string;
  district: string;
  region: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const SchoolSchema = new Schema<SchoolDocument>(
  {
    schoolId: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    isActive: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: true
  }
);

export const SchoolModel = model<SchoolDocument>("School", SchoolSchema);
