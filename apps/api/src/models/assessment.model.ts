import { model, Schema } from "mongoose";

type AssessmentDocument = {
  assessmentId: string;
  teacherId: string;
  classId?: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctAnswer: string;
    skillTag?: string;
  }>;
};

const AssessmentSchema = new Schema<AssessmentDocument>(
  {
    assessmentId: { type: String, required: true, unique: true, trim: true, index: true },
    teacherId: { type: String, required: true, trim: true, index: true },
    classId: { type: String, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    gradeLevel: { type: String, required: true, trim: true },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
        skillTag: { type: String }
      }
    ]
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

export const AssessmentModel = model<AssessmentDocument>("Assessment", AssessmentSchema);
