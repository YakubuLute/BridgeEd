import { Title, Text, SimpleGrid, Paper, Group, Box, Badge, Stack, Button, Progress, Loader, Center } from "@mantine/core";
import { useClassesQuery } from "../../../api/hooks/useClassQueries";
import { useTeacherReportQuery } from "../../../api/hooks/useReportQueries";

// --- Icons ---
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M9 14h6" /><path d="M9 10h6" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

const IconArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

export const TeacherDashboardPage = (): JSX.Element => {
  const { data: classes, isLoading: classesLoading } = useClassesQuery();
  const { data: report, isLoading: reportLoading } = useTeacherReportQuery();

  const stats = [
    { label: "Total Students", value: report?.summary?.totalStudents?.toString() || "-", icon: <IconUsers />, trend: "Active", color: "blue" },
    { label: "Avg. Mastery", value: `${report?.summary?.avgMastery || 0}%`, icon: <IconArrowUpRight />, trend: "Current", color: "teal" },
    { label: "Diagnostic Coverage", value: `${report?.summary?.diagnosticCoverage || 0}%`, icon: <IconClipboard />, trend: "Completion", color: "orange" },
    { label: "Total Classes", value: report?.summary?.totalClasses?.toString() || "-", icon: <IconUsers />, trend: "Managed", color: "indigo" },
  ];

  if (classesLoading || reportLoading) {
    return (
      <Center py={100}>
        <Loader color="orange" size="xl" />
      </Center>
    );
  }

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 75) return "teal";
    if (mastery >= 50) return "orange";
    return "red";
  };

  return (
    <Stack gap={32}>
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
            Teacher Dashboard
          </Title>
          <Text c="#64748b" fw={500}>Welcome back! Here&apos;s what&apos;s happening in your classes.</Text>
        </Stack>
        <Button 
          bg="#ea580c" 
          radius="md" 
          size="md" 
          className="hover:bg-[#c2410c] font-bold shadow-lg shadow-orange-100"
        >
          Run New Screener
        </Button>
      </Group>

      {/* KPI Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
        {stats.map((stat, i) => (
          <Paper key={i} p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color}-500 opacity-20`} />
            <Group justify="space-between" mb="md">
              <Box className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                {stat.icon}
              </Box>
              <Badge 
                variant="light" 
                color={stat.trend.startsWith('+') ? 'green' : stat.trend.startsWith('-') ? 'blue' : 'red'} 
                radius="sm" 
                size="sm"
                className="font-bold"
              >
                {stat.trend}
              </Badge>
            </Group>
            <Stack gap={2}>
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" className="tracking-wider">{stat.label}</Text>
              <Text c="#1e293b" fz="28px" fw={900}>{stat.value}</Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
        {/* Skill Heatmap Mockup */}
        <Paper p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm">
          <Group justify="space-between" mb="xl">
            <Stack gap={4}>
              <Text fw={900} fz="lg" c="#1e293b">Foundational Skill Mastery</Text>
              <Text c="#94a3b8" fz="xs" fw={700}>LITERACY & NUMERACY FOCUS</Text>
            </Stack>
            <Button variant="subtle" size="xs" color="gray" fw={700}>View Full Report</Button>
          </Group>

          <Stack gap="lg">
            {report?.skillPerformance?.map((skill, i) => (
              <Stack key={i} gap={8}>
                <Group justify="space-between">
                  <Text fz="sm" fw={700} c="#475569">{skill.skill}</Text>
                  <Text fz="sm" fw={800} c={skill.mastery < 50 ? "red" : "#1e293b"}>{skill.mastery}%</Text>
                </Group>
                <Progress value={skill.mastery} color={getMasteryColor(skill.mastery)} size="md" radius="xl" />
              </Stack>
            ))}
          </Stack>
        </Paper>

        {/* Recent Activity / At-Risk List */}
        <Paper p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm flex flex-col">
          <Group justify="space-between" mb="xl">
            <Stack gap={4}>
              <Text fw={900} fz="lg" c="#1e293b">Needs Attention</Text>
              <Text c="#94a3b8" fz="xs" fw={700}>STUDENTS REQUIRING REMEDIATION</Text>
            </Stack>
            <Badge color="red" variant="filled">7 High Alert</Badge>
          </Group>

          <Stack gap={1} className="flex-1">
            {[
              { name: "Kofi Mensah", class: "JHS 1A", gap: "Decimals", status: "Critical" },
              { name: "Ama Serwaa", class: "JHS 1A", gap: "Phonics", status: "Struggling" },
              { name: "John Doe", class: "JHS 2B", gap: "Division", status: "Review Needed" },
              { name: "Sarah Smith", class: "JHS 1A", gap: "Comprehension", status: "Struggling" },
              { name: "Prince Boateng", class: "JHS 3C", gap: "Fractions", status: "Review Needed" },
            ].map((learner, i) => (
              <Group key={i} justify="space-between" p="md" className={`border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors rounded-xl`}>
                <Group gap="md">
                  <Box className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center font-bold text-[#64748b]">
                    {learner.name[0]}
                  </Box>
                  <Stack gap={0}>
                    <Text fw={800} fz="sm" c="#1e293b">{learner.name}</Text>
                    <Text c="#94a3b8" fz="xs" fw={700}>{learner.class} • {learner.gap}</Text>
                  </Stack>
                </Group>
                <Badge 
                  color={learner.status === 'Critical' ? 'red' : learner.status === 'Struggling' ? 'orange' : 'blue'} 
                  variant="light"
                  size="sm"
                >
                  {learner.status}
                </Badge>
              </Group>
            ))}
          </Stack>
          <Button variant="outline" color="gray" fullWidth mt="xl" radius="md" fw={700} className="border-[#e2e8f0]">View All At-Risk Students</Button>
        </Paper>
      </SimpleGrid>

      {/* Classes Overview */}
      <Paper p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm">
        <Title order={3} className="text-xl font-black text-[#1e293b] mb-xl">Your Classes</Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {classesLoading ? (
            <Text>Loading classes...</Text>
          ) : classes?.map((cls) => (
            <Paper key={cls.id} p="xl" radius="20px" className="bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#ea580c] transition-colors cursor-pointer group">
              <Group justify="space-between" mb="md">
                <Text fw={900} fz="lg" c="#1e293b">{cls.name}</Text>
                <IconArrowUpRight />
              </Group>
              <Group gap="xl">
                <Stack gap={2}>
                  <Text c="#94a3b8" fz="xs" fw={800}>GRADE</Text>
                  <Text fw={900} fz="xl">{cls.gradeLevel}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text c="#94a3b8" fz="xs" fw={800}>STATUS</Text>
                  <Text fw={900} fz="xl">{cls.isActive ? "Active" : "Inactive"}</Text>
                </Stack>
              </Group>
              <Box mt="xl">
                <Text c="#64748b" fz="xs" fw={700} mb={8}>DIAGNOSTIC COVERAGE</Text>
                <Progress value={Math.random() * 100} color="orange" size="sm" radius="xl" />
              </Box>
            </Paper>
          )) || (
            <Text c="#94a3b8" fw={600}>No classes found. Create your first class to get started.</Text>
          )}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
};
