import type { AuthScope, Role } from "@bridgeed/shared";

export type AuthContext = {
  userId: string;
  role: Role;
  name: string;
  scope?: AuthScope;
};
