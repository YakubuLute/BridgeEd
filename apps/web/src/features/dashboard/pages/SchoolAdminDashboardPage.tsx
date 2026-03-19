import { Title, Text, SimpleGrid, Paper, Group, Box, Badge, Stack, Button, Progress, Avatar } from "@mantine/core";

// --- Icons ---
const IconSchool = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconUserCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
  </svg>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const SchoolAdminDashboardPage = (): JSX.Element => {
  // Mocking stats for school admin
  const stats = [
    { label: "Active Teachers", value: "14", icon: <IconUserCheck />, trend: "+2 this term", color: "blue" },
    { label: "Diagnostic Coverage", value: "92%", icon: <IconSchool />, trend: "Top 5% in District", color: "teal" },
    { label: "Mastery Growth", value: "+14.5%", icon: <IconTrendingUp />, trend: "Above Average", color: "green" },
    { label: "Resource Utilization", value: "68%", icon: <IconSettings />, trend: "-2.1%", color: "indigo" },
  ];

  return (
    <Stack gap={32}>
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
            School Overview
          </Title>
          <Text c="#64748b" fw={500}>Comprehensive insights into your school&apos;s educational performance.</Text>
        </Stack>
        <Button 
          bg="#ea580c" 
          radius="md" 
          size="md" 
          className="hover:bg-[#c2410c] font-bold shadow-lg shadow-orange-100"
        >
          Export Term Report
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
                color={stat.trend.includes('+') ? 'green' : 'blue'} 
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
        {/* Class Performance Chart Mockup */}
        <Paper p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm">
          <Group justify="space-between" mb="xl">
            <Stack gap={4}>
              <Text fw={900} fz="lg" c="#1e293b">Performance by Grade</Text>
              <Text c="#94a3b8" fz="xs" fw={700}>AVG. MASTERY ACROSS LEVELS</Text>
            </Stack>
            <Badge color="orange" variant="light">Term 1, 2026</Badge>
          </Group>

          <Stack gap="xl" py="xl">
            {[
              { label: "Grade 4", value: 78, color: "teal" },
              { label: "Grade 5", value: 62, color: "blue" },
              { label: "Grade 6", value: 84, color: "indigo" },
              { label: "JHS 1", value: 55, color: "orange" },
              { label: "JHS 2", value: 48, color: "red" },
            ].map((grade, i) => (
              <Group key={i} align="center">
                <Text fz="sm" fw={800} c="#475569" className="w-16">{grade.label}</Text>
                <Box className="flex-1">
                  <Progress value={grade.value} color={grade.color} size="xl" radius="md" />
                </Box>
                <Text fz="sm" fw={900} c="#1e293b" className="w-10 ta-right">{grade.value}%</Text>
              </Group>
            ))}
          </Stack>
        </Paper>

        {/* Top Teachers / Activity Feed */}
        <Paper p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm flex flex-col">
          <Group justify="space-between" mb="xl">
            <Stack gap={4}>
              <Text fw={900} fz="lg" c="#1e293b">Teacher Engagement</Text>
              <Text c="#94a3b8" fz="xs" fw={700}>DIAGNOSTIC ADOPTION TRACKER</Text>
            </Stack>
            <Button variant="subtle" size="xs" color="gray" fw={700}>View All Teachers</Button>
          </Group>

          <Stack gap={1} className="flex-1">
            {[
              { name: "Mr. Kwesi Arthur", subject: "Mathematics", coverage: "100%", status: "Active" },
              { name: "Ms. Efua Mensah", subject: "English", coverage: "94%", status: "Active" },
              { name: "Mr. John Dumelo", subject: "Science", coverage: "45%", status: "Delayed" },
              { name: "Ms. Yvonne Nelson", subject: "Social Studies", coverage: "82%", status: "Active" },
              { name: "Mr. Sarkodie", subject: "Mathematics", coverage: "12%", status: "Critical" },
            ].map((teacher, i) => (
              <Group key={i} justify="space-between" p="md" className={`border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors rounded-xl`}>
                <Group gap="md">
                  <Avatar radius="xl" color="orange">{teacher.name[0]}</Avatar>
                  <Stack gap={0}>
                    <Text fw={800} fz="sm" c="#1e293b">{teacher.name}</Text>
                    <Text c="#94a3b8" fz="xs" fw={700}>{teacher.subject} • {teacher.coverage} coverage</Text>
                  </Stack>
                </Group>
                <Badge 
                  color={teacher.status === 'Active' ? 'green' : teacher.status === 'Delayed' ? 'orange' : 'red'} 
                  variant="light"
                  size="sm"
                >
                  {teacher.status}
                </Badge>
              </Group>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
};
