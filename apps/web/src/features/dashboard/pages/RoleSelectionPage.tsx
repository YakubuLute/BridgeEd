import { Alert, Card, Stack, Text, Title } from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { Link, Navigate } from "react-router-dom";

import { getRoleHomePath, getUserRoles } from "../../../utils/role-routing";
import { readSession } from "../../../utils/session";

const roleDescriptions: Partial<Record<Role, { title: string; description: string }>> = {
  [Role.NationalAdmin]: {
    title: "National Admin",
    description: "Manage schools, districts, and system-wide settings."
  },
  [Role.SchoolAdmin]: {
    title: "School Admin",
    description: "Manage school operations, teachers, and learner transfers."
  },
  [Role.Teacher]: {
    title: "Teacher",
    description: "Manage classes, learners, diagnostics, and remediation."
  }
};

export const RoleSelectionPage = (): JSX.Element => {
  const session = readSession();
  if (!session?.accessToken) {
    return <Navigate replace to="/" />;
  }

  const selectableRoles = getUserRoles(session.user)
    .map((role) => {
      const details = roleDescriptions[role];
      const path = getRoleHomePath(role);
      if (!details || !path) {
        return null;
      }

      return {
        id: role,
        title: details.title,
        description: details.description,
        path
      };
    })
    .filter((value): value is { id: Role; title: string; description: string; path: string } => Boolean(value));

  if (selectableRoles.length === 1) {
    return <Navigate replace to={selectableRoles[0].path} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f3f5] px-4 py-10">
      <div className="max-w-xl mx-auto">
        <Stack gap={4} mb={28}>
          <Title c="#121421" order={1} size="h1">
            Select Role
          </Title>
          <Text c="#6A6C7D" fz={15}>
            Your account has multiple roles. Select where you want to continue.
          </Text>
        </Stack>

        {selectableRoles.length === 0 && (
          <Alert color="red" mb={12} variant="light">
            No dashboard is configured for your assigned role. Contact your administrator.
          </Alert>
        )}

        <Stack gap={12}>
          {selectableRoles.map((role) => (
            <Card
              key={role.id}
              className="border border-[#d5d6dd] bg-white hover:bg-[#f8f8fa] transition-colors"
              component={Link}
              p={18}
              radius={12}
              shadow="sm"
              to={role.path}
              withBorder
            >
              <Text c="#121421" fw={700} fz={17}>
                {role.title}
              </Text>
              <Text c="#6A6C7D" fz={14}>
                {role.description}
              </Text>
            </Card>
          ))}
        </Stack>
      </div>
    </div>
  );
};
