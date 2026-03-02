import { Role } from "@bridgeed/shared";

import { SchoolModel } from "../../models/school.model";
import { UserModel } from "../../models/user.model";

export const bootstrapSeedData = async (): Promise<void> => {
  await Promise.all([
    SchoolModel.updateOne(
      { schoolId: "school-demo-001" },
      {
        $set: {
          name: "BridgeEd Demo School",
          district: "Demo District",
          region: "Greater Accra",
          isActive: true
        }
      },
      { upsert: true }
    ),
    UserModel.updateOne(
      { userId: "teacher-1" },
      {
        $set: {
          name: "BridgeEd Teacher",
          email: "teacher@bridgeed.gh",
          role: Role.Teacher,
          scope: {
            schoolId: "school-demo-001",
            districtId: "district-demo-001",
            region: "Greater Accra"
          }
        }
      },
      { upsert: true }
    )
  ]);
};
