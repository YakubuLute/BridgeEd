import { Card, Text, Title } from "@mantine/core";
import { Role } from "@bridgeed/shared";

import { DashboardLayout } from "../components/DashboardLayout";

const Placeholder = ({ role, title }: { role: Role; title: string }): JSX.Element => (
  <DashboardLayout role={role}>
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Title c="#121421" order={1} size="h1" mb={12}>
          {title}
        </Title>
        <Card p={18} radius={12} withBorder>
          <Text c="#6A6C7D" fz={14}>
            This dashboard is not in the current vertical slice. Active scope in this release is teacher class and
            learner management (`US-2.2`, `US-3.1`, `US-3.2`).
          </Text>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export const SchoolAdminDashboardPage = (): JSX.Element => (
  <Placeholder role={Role.SchoolAdmin} title="School Admin Dashboard" />
);

export const NationalAdminDashboardPage = (): JSX.Element => (
  <Placeholder role={Role.NationalAdmin} title="National Admin Dashboard" />
);
