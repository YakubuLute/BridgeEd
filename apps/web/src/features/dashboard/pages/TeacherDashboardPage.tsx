import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { Link } from "react-router-dom";

import { DashboardLayout } from "../components/DashboardLayout";

type IconProps = {
  className?: string;
};

type StatItem = {
  color: "green" | "bridgeed" | "yellow";
  icon: (props: IconProps) => JSX.Element;
  label: string;
  value: string;
};

const IconUsers = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle cx="8.5" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M2.5 19C2.5 15.9 5 13.5 8.5 13.5C12 13.5 14.5 15.9 14.5 19" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M15.5 13.5C17.7 13.8 19.5 15.4 19.5 17.9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconTrendUp = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M4 15L9 10L13 14L20 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M15 7H20V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconBook = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M3 5.5C3 4.67 3.67 4 4.5 4H11V20H4.5A1.5 1.5 0 0 1 3 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M21 5.5C21 4.67 20.33 4 19.5 4H13V20H19.5A1.5 1.5 0 0 0 21 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconFile = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M7 3H14L19 8V21H7V3Z" stroke="currentColor" strokeWidth="2" />
    <path d="M14 3V8H19" stroke="currentColor" strokeWidth="2" />
    <path d="M10 12H16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <path d="M10 16H16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </svg>
);

const IconSettings = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19.4 15.1L20.5 17L18.3 19.2L16.4 18.1C15.9 18.4 15.3 18.6 14.7 18.8L14.1 21H9.9L9.3 18.8C8.7 18.6 8.1 18.4 7.6 18.1L5.7 19.2L3.5 17L4.6 15.1C4.3 14.6 4.1 14 3.9 13.4L1.7 12.8V11.2L3.9 10.6C4.1 10 4.3 9.4 4.6 8.9L3.5 7L5.7 4.8L7.6 5.9C8.1 5.6 8.7 5.4 9.3 5.2L9.9 3H14.1L14.7 5.2C15.3 5.4 15.9 5.6 16.4 5.9L18.3 4.8L20.5 7L19.4 8.9C19.7 9.4 19.9 10 20.1 10.6L22.3 11.2V12.8L20.1 13.4C19.9 14 19.7 14.6 19.4 15.1Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const stats: StatItem[] = [
  {
    color: "green",
    label: "Students",
    value: "165",
    icon: IconUsers
  },
  {
    color: "green",
    label: "On Track",
    value: "78%",
    icon: IconTrendUp
  },
  {
    color: "bridgeed",
    label: "Classes",
    value: "4",
    icon: IconBook
  },
  {
    color: "yellow",
    label: "Pending",
    value: "12",
    icon: IconFile
  }
];

const classes = [
  { id: "jhs-1a", name: "JHS 1A", students: 42, subject: "Mathematics" },
  { id: "jhs-1b", name: "JHS 1B", students: 38, subject: "English" },
  { id: "jhs-2a", name: "JHS 2A", students: 45, subject: "Mathematics" },
  { id: "shs-1c", name: "SHS 1C", students: 40, subject: "English" }
];

const recentActivity = [
  { student: "Kwame Mensah", action: "Assessment completed", time: "2 hours ago" },
  { student: "Akua Asante", action: "Remediation plan created", time: "5 hours ago" },
  { student: "Kofi Owusu", action: "Progress updated", time: "1 day ago" }
];

export const TeacherDashboardPage = (): JSX.Element => {
  const borderColor = "var(--mantine-color-bridgeed-2)";

  return (
    <DashboardLayout role={Role.Teacher}>
      <Box className="lg:hidden max-w-[390px] mx-auto px-4 pt-4 pb-8">
        <Paper bg="green.6" p={16} radius="xl">
          <Stack gap={12}>
            <Group align="flex-start" justify="space-between" wrap="nowrap">
              <Stack gap={0}>
                <Title c="white" order={1} size="h1">
                  Teacher Dashboard
                </Title>
                <Text c="green.1" fw={600} fz={14} mt={2}>
                  BridgeEd
                </Text>
              </Stack>
              <ActionIcon
                aria-label="Open settings"
                radius="md"
                size={40}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white" }}
                variant="filled"
              >
                <IconSettings className="w-4 h-4" />
              </ActionIcon>
            </Group>

            <Group gap={10} wrap="nowrap">
              <ThemeIcon
                radius="xl"
                size={32}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white" }}
              >
                <Text c="white" fw={700} fz={16}>
                  T
                </Text>
              </ThemeIcon>
              <Stack gap={0}>
                <Text c="white" fw={700} fz={16} lh="24px">
                  Teacher Name
                </Text>
                <Text c="green.1" fw={600} fz={12} lh="16px">
                  teacher@school.gh
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>

        <SimpleGrid cols={2} mt={16} spacing="md">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={`mobile-${stat.label}`} p={16} radius="md" withBorder style={{ borderColor }}>
                <Group align="flex-start" gap={10} wrap="nowrap">
                  <ThemeIcon color={stat.color} radius="md" size={40} variant="light">
                    <Icon className="w-5 h-5" />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text c="bridgeed.9" fw={700} fz={44} lh="1">
                      {stat.value}
                    </Text>
                    <Text c="bridgeed.6" fz={14}>
                      {stat.label}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>

        <Stack gap="md" mt={24}>
          <Title c="bridgeed.9" order={2} size="h2">
            Quick Actions
          </Title>
          <SimpleGrid cols={2} spacing="md">
            <Link style={{ textDecoration: "none" }} to="/assessments">
              <Card p={20} radius="md" withBorder style={{ borderColor }}>
                <Stack align="center" gap={10}>
                  <ThemeIcon color="green" radius="xl" size={52} variant="light">
                    <IconFile className="w-6 h-6" />
                  </ThemeIcon>
                  <Text c="bridgeed.9" fz={14} fw={600} ta="center">
                    New Assessment
                  </Text>
                </Stack>
              </Card>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/classes">
              <Card p={20} radius="md" withBorder style={{ borderColor }}>
                <Stack align="center" gap={10}>
                  <ThemeIcon color="bridgeed" radius="xl" size={52} variant="light">
                    <IconBook className="w-6 h-6" />
                  </ThemeIcon>
                  <Text c="bridgeed.9" fz={14} fw={600} ta="center">
                    View Classes
                  </Text>
                </Stack>
              </Card>
            </Link>
          </SimpleGrid>
        </Stack>

        <Stack gap="md" mt={32}>
          <Title c="bridgeed.9" order={2} size="h2">
            My Classes
          </Title>
          <Stack gap="md">
            {classes.map((classItem) => (
              <Link
                key={`mobile-class-${classItem.id}`}
                style={{ textDecoration: "none" }}
                to={`/classes/${classItem.id}`}
              >
                <Card p={18} radius="md" withBorder style={{ borderColor }}>
                  <Group align="flex-start" justify="space-between" mb={8}>
                    <Text c="bridgeed.9" fw={700} fz={16} lh="24px">
                      {classItem.name}
                    </Text>
                    <Text c="bridgeed.6" fz={14} lh="20px">
                      {classItem.students} students
                    </Text>
                  </Group>
                  <Text c="bridgeed.6" fz={14} lh="20px">
                    {classItem.subject}
                  </Text>
                </Card>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box className="hidden lg:block">
        <Paper bg="white" radius={0} style={{ borderBottom: `1px solid ${borderColor}` }}>
          <Group className="px-8 py-6" justify="space-between">
            <Stack gap={2}>
              <Title c="bridgeed.9" order={1} size="h1">
                Dashboard
              </Title>
              <Text c="bridgeed.6" fz={14}>
                Welcome back, Teacher Name
              </Text>
            </Stack>

            <Group gap="md">
              <Button
                color="green"
                component={Link}
                fw={600}
                radius="md"
                size="md"
                to="/assessments"
              >
                New Assessment
              </Button>
              <ActionIcon
                aria-label="Open settings"
                color="bridgeed"
                radius="md"
                size={48}
                variant="outline"
              >
                <IconSettings className="w-5 h-5" />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>

        <Box className="px-8 py-8">
          <SimpleGrid cols={4} mb={32} spacing="md">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} p={24} radius="md" withBorder style={{ borderColor }}>
                <Group align="flex-start" gap="md" wrap="nowrap">
                  <ThemeIcon color={stat.color} radius="md" size={40} variant="light">
                    <Icon className="w-5 h-5" />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text c="bridgeed.9" fw={600} fz={28} lh="36px">
                      {stat.value}
                    </Text>
                    <Text c="bridgeed.6" fz={14}>
                      {stat.label}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            );
          })}
          </SimpleGrid>

          <SimpleGrid cols={2} spacing={32}>
            <Stack gap="md">
              <Title c="bridgeed.9" order={2} size="h2">
                My Classes
              </Title>
              <Stack gap="md">
                {classes.map((classItem) => (
                  <Link
                    key={classItem.id}
                    style={{ textDecoration: "none" }}
                    to={`/classes/${classItem.id}`}
                  >
                    <Card p={20} radius="md" withBorder style={{ borderColor }}>
                      <Group align="flex-start" justify="space-between" mb={8}>
                        <Text c="bridgeed.9" fw={600} fz={16} lh="24px">
                          {classItem.name}
                        </Text>
                        <Text c="bridgeed.6" fz={14} lh="20px">
                          {classItem.students} students
                        </Text>
                      </Group>
                      <Text c="bridgeed.6" fz={14} lh="20px">
                        {classItem.subject}
                      </Text>
                    </Card>
                  </Link>
                ))}
              </Stack>
            </Stack>

            <Stack gap="md">
              <Title c="bridgeed.9" order={2} size="h2">
                Recent Activity
              </Title>
              <Card p={0} radius="md" withBorder style={{ borderColor }}>
                {recentActivity.map((item, index) => (
                  <Box key={`${item.student}-${index}`}>
                    <Box px={24} py={20}>
                      <Text c="bridgeed.9" fw={600} fz={16} lh="24px">
                        {item.student}
                      </Text>
                      <Text c="bridgeed.6" fz={14} lh="20px" mt={4}>
                        {item.action}
                      </Text>
                      <Text c="bridgeed.6" fz={14} lh="20px" mt={4}>
                        {item.time}
                      </Text>
                    </Box>
                    {index < recentActivity.length - 1 && <Divider color="bridgeed.2" />}
                  </Box>
                ))}
              </Card>
            </Stack>
          </SimpleGrid>
        </Box>
      </Box>
    </DashboardLayout>
  );
};
