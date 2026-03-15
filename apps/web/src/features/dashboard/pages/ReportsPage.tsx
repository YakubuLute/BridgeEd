import {
  Title,
  Text,
  Stack,
  Group,
  Paper,
  SimpleGrid,
  Box,
  Badge,
  Button,
  Progress,
  Loader,
  Center,
  Tabs
} from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { useTeacherReportQuery, useSchoolReportQuery } from "../../../api/hooks/useReportQueries";
import { readSession } from "../../../utils/session";

// --- Icons ---
const IconDownload = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconTrendingUp = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconChart = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

export const ReportsPage = (): JSX.Element => {
  const session = readSession();
  const role = session?.user.role;

  const { data: teacherData, isLoading: teacherLoading } = useTeacherReportQuery();
  const { data: schoolData, isLoading: schoolLoading } = useSchoolReportQuery();

  const isLoading = role === Role.Teacher ? teacherLoading : schoolLoading;

  if (isLoading) {
    return (
      <Center py={100}>
        <Loader color="orange" />
      </Center>
    );
  }

  return (
    <Stack gap={32}>
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
            Performance Reports
          </Title>
          <Text c="#64748b" fw={500}>
            {role === Role.Teacher
              ? "Deep dive into your classroom diagnostics and mastery trends."
              : "Institutional performance metrics and regional comparisons."}
          </Text>
        </Stack>
        <Button
          bg="#ea580c"
          radius="md"
          leftSection={<IconDownload />}
          className="hover:bg-[#c2410c] font-bold h-12"
        >
          Export Summary
        </Button>
      </Group>

      {role === Role.Teacher && teacherData && (
        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Avg. Mastery
              </Text>
              <Group align="center">
                <Title order={2} fz="32px" fw={900}>
                  {teacherData.summary.avgMastery}%
                </Title>
                <Badge color="green" variant="light" size="sm">
                  +4.2%
                </Badge>
              </Group>
            </Paper>
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Coverage
              </Text>
              <Title order={2} fz="32px" fw={900}>
                {teacherData.summary.diagnosticCoverage}%
              </Title>
            </Paper>
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Total Classes
              </Text>
              <Title order={2} fz="32px" fw={900}>
                {teacherData.summary.totalClasses}
              </Title>
            </Paper>
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Total Students
              </Text>
              <Title order={2} fz="32px" fw={900}>
                {teacherData.summary.totalStudents}
              </Title>
            </Paper>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Group justify="space-between" mb="xl">
                <Title order={3} className="text-xl font-black">
                  Skill Heatmap
                </Title>
                <IconChart />
              </Group>
              <Stack gap="lg">
                {teacherData.skillPerformance.map((s, i) => (
                  <Box key={i}>
                    <Group justify="space-between" mb={8}>
                      <Text fz="sm" fw={700} c="#475569">
                        {s.skill}
                      </Text>
                      <Text fz="sm" fw={900}>
                        {s.mastery}%
                      </Text>
                    </Group>
                    <Progress
                      value={s.mastery}
                      color={s.mastery > 70 ? "teal" : s.mastery > 50 ? "orange" : "red"}
                      size="lg"
                      radius="xl"
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Group justify="space-between" mb="xl">
                <Title order={3} className="text-xl font-black">
                  Mastery Trend
                </Title>
                <IconTrendingUp />
              </Group>
              <Box className="h-[250px] flex items-end gap-6 px-4">
                {teacherData.masteryTrend.map((t, i) => (
                  <Stack key={i} align="center" gap="xs" className="flex-1">
                    <Box
                      bg={i === teacherData.masteryTrend.length - 1 ? "#ea580c" : "#f1f5f9"}
                      className="w-full rounded-t-xl transition-all"
                      style={{ height: `${t.value * 2}px` }}
                    />
                    <Text fz="xs" fw={800} c="#94a3b8">
                      {t.label}
                    </Text>
                  </Stack>
                ))}
              </Box>
            </Paper>
          </SimpleGrid>
        </Stack>
      )}

      {role === Role.SchoolAdmin && schoolData && (
        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Institutional Coverage
              </Text>
              <Title order={2} fz="32px" fw={900}>
                {schoolData.summary.coveragePercent}%
              </Title>
            </Paper>
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="red" fz="xs" fw={800} tt="uppercase" mb="xs">
                Students At Risk
              </Text>
              <Title order={2} fz="32px" fw={900} c="red">
                {schoolData.summary.atRiskPercent}%
              </Title>
            </Paper>
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Regional Rank
              </Text>
              <Title order={2} fz="32px" fw={900}>
                #{schoolData.regionalRank}
              </Title>
            </Paper>
            <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">
                Active Staff
              </Text>
              <Title order={2} fz="32px" fw={900}>
                {schoolData.summary.totalTeachers}
              </Title>
            </Paper>
          </SimpleGrid>

          <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
            <Title order={3} className="text-xl font-black mb-12">
              Grade-Level Performance Comparison
            </Title>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60}>
              {schoolData.gradePerformance.map((gp, i) => (
                <Stack key={i} gap="md">
                  <Group justify="space-between">
                    <Text fw={900} fz="lg" c="#1e293b">
                      {gp.grade}
                    </Text>
                    <Badge color="orange" variant="light">
                      Term 1
                    </Badge>
                  </Group>
                  <Box>
                    <Group justify="space-between" mb={4}>
                      <Text fz="xs" fw={800} c="#94a3b8">
                        LITERACY
                      </Text>
                      <Text fz="xs" fw={900}>
                        {gp.literacy}%
                      </Text>
                    </Group>
                    <Progress value={gp.literacy} color="teal" size="md" radius="xl" />
                  </Box>
                  <Box>
                    <Group justify="space-between" mb={4}>
                      <Text fz="xs" fw={800} c="#94a3b8">
                        NUMERACY
                      </Text>
                      <Text fz="xs" fw={900}>
                        {gp.numeracy}%
                      </Text>
                    </Group>
                    <Progress value={gp.numeracy} color="blue" size="md" radius="xl" />
                  </Box>
                </Stack>
              ))}
            </SimpleGrid>
          </Paper>
        </Stack>
      )}

      {/* Placeholder for other roles */}
      {!teacherData && !schoolData && (
        <Paper
          p={100}
          radius="24px"
          className="border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc]"
        >
          <Center>
            <Stack align="center" gap="md">
              <IconChart />
              <Text fw={700} c="#64748b">
                Report data will appear once diagnostics are completed.
              </Text>
            </Stack>
          </Center>
        </Paper>
      )}
    </Stack>
  );
};
