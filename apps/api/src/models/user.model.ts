import { model, Schema } from "mongoose";
import { Role } from "@bridgeed/shared";

type UserDocument = {
  userId: string;
  name: string;
  email?: string;
  phoneNumber?: string;
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
    email: { type: String, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true },
    role: { type: String, required: true, enum: Object.values(Role), index: true },
    scope: { type: UserScopeSchema }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<UserDocument>("User", UserSchema);
