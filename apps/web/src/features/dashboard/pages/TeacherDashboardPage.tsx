import { Card, Grid, Loader, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { useClassesQuery } from "../../../api/hooks/useClassQueries";
import { DashboardLayout } from "../components/DashboardLayout";

export const TeacherDashboardPage = (): JSX.Element => {
  const classesQuery = useClassesQuery();
  const classes = classesQuery.data ?? [];

  return (
    <DashboardLayout role={Role.Teacher}>
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Stack gap={4} mb={20}>
            <Title c="#121421" order={1} size="h1">
              Teacher Dashboard
            </Title>
            <Text c="#6A6C7D" fz={14}>
              Overview of your classes and learner activity.
            </Text>
          </Stack>

          <Grid mb={20}>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Card p={16} radius={12} withBorder>
                <Text c="#6A6C7D" fz={13}>
                  Classes
                </Text>
                <Text c="#121421" fw={700} fz={28}>
                  {classes.length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Card p={16} radius={12} withBorder>
                <Text c="#6A6C7D" fz={13}>
                  Learner Profiles
                </Text>
                <Text c="#121421" fw={700} fz={28}>
                  Track
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          <Card p={16} radius={12} withBorder>
            <Stack gap={10}>
              <Text c="#121421" fw={700} fz={18}>
                My Classes
              </Text>

              {classesQuery.isLoading && <Loader size="sm" />}
              {classesQuery.isError && (
                <Text c="red" fz={14}>
                  {classesQuery.error?.message ?? "Unable to load classes."}
                </Text>
              )}

              {!classesQuery.isLoading && classes.length === 0 && (
                <Text c="#6A6C7D" fz={14}>
                  No classes yet. Create one from the Classes page.
                </Text>
              )}

              {classes.map((classItem) => (
                <Card
                  key={classItem.classId}
                  className="border border-[#d5d6dd] bg-white"
                  component={Link}
                  p={14}
                  radius={10}
                  to={`/classes/${classItem.classId}`}
                  withBorder
                >
                  <Text c="#121421" fw={600} fz={15}>
                    {classItem.name}
                  </Text>
                  <Text c="#6A6C7D" fz={13}>
                    {classItem.gradeLevel}
                  </Text>
                </Card>
              ))}
            </Stack>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
