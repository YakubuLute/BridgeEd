import { model, Schema } from "mongoose";

type AssessmentSessionDocument = {
  sessionId: string;
  assessmentId: string;
  classId: string;
  teacherId: string;
  accessCode: string;
  status: "active" | "closed";
};

const AssessmentSessionSchema = new Schema<AssessmentSessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, trim: true, index: true },
    assessmentId: { type: String, required: true, trim: true, index: true },
    classId: { type: String, required: true, trim: true, index: true },
    teacherId: { type: String, required: true, trim: true, index: true },
    accessCode: { type: String, required: true, length: 6, index: true },
    status: { type: String, enum: ["active", "closed"], default: "active", index: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const AssessmentSessionModel = model<AssessmentSessionDocument>(
  "AssessmentSession",
  AssessmentSessionSchema
);
