import { Card, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const roles = [
  {
    id: "national_admin",
    title: "National Admin",
    description: "Manage schools, districts, and system-wide settings.",
    path: "/dashboard/national-admin"
  },
  {
    id: "school_admin",
    title: "School Admin",
    description: "Manage school operations, teachers, and learner transfers.",
    path: "/dashboard/school-admin"
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Manage classes, learners, diagnostics, and remediation.",
    path: "/dashboard/teacher"
  }
];

export const RoleSelectionPage = (): JSX.Element => (
  <div className="min-h-screen bg-[#f3f3f5] px-4 py-10">
    <div className="max-w-xl mx-auto">
      <Stack gap={4} mb={28}>
        <Title c="#121421" order={1} size="h1">
          Select Role
        </Title>
        <Text c="#6A6C7D" fz={15}>
          Your role determines which modules and data scopes are available.
        </Text>
      </Stack>

      <Stack gap={12}>
        {roles.map((role) => (
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
