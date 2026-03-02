import { model, Schema } from "mongoose";
import { Role } from "@bridgeed/shared";

type UserDocument = {
  userId: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  passwordHash?: string;
  failedLoginAttempts: number;
  lockedUntilMs: number | null;
  role: Role;
  scope?: {
    schoolId?: string;
    districtId?: string;
    region?: string;
  };
};

const UserScopeSchema = new Schema(
  {
    schoolId: { type: String, trim: true },
    districtId: { type: String, trim: true },
    region: { type: String, trim: true }
  },
  { _id: false }
);

const UserSchema = new Schema<UserDocument>(
  {
    userId: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true },
    phoneNumber: { type: String, trim: true },
    passwordHash: { type: String, trim: true },
    failedLoginAttempts: { type: Number, required: true, default: 0 },
    lockedUntilMs: { type: Number, default: null },
    role: { type: String, required: true, enum: Object.values(Role), index: true },
    scope: { type: UserScopeSchema }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<UserDocument>("User", UserSchema);
