import { Title, Text, SimpleGrid, Paper, Group, Box, Badge, Stack, Button, Progress } from "@mantine/core";

// --- Icons ---
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
  </svg>
);

const IconDatabase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const IconActivity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const NationalAdminDashboardPage = (): JSX.Element => {
  const stats = [
    { label: "Total Schools", value: "482", icon: <IconBuilding />, trend: "Active in 12 Regions", color: "blue" },
    { label: "Total Learners", value: "124,500", icon: <IconGlobe />, trend: "+4,200 this month", color: "teal" },
    { label: "Assessments Run", value: "852k", icon: <IconDatabase />, trend: "98.4% Sync Rate", color: "orange" },
    { label: "Platform Uptime", value: "99.98%", icon: <IconActivity />, trend: "Healthy", color: "green" },
  ];

  return (
    <Stack gap={32}>
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
            National Insights
          </Title>
          <Text c="#64748b" fw={500}>Strategic overview of the BridgeEd ecosystem performance.</Text>
        </Stack>
        <Group>
          <Button variant="outline" color="gray" radius="md" className="border-[#e2e8f0] font-bold">System Logs</Button>
          <Button 
            bg="#ea580c" 
            radius="md" 
            size="md" 
            className="hover:bg-[#c2410c] font-bold shadow-lg shadow-orange-100"
          >
            Regional Report
          </Button>
        </Group>
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
                color="blue" 
                radius="sm" 
                size="sm"
                className="font-bold"
              >
                {stat.trend}
              </Badge>
            </Group>
            <Stack gap={2}>
              <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" tracking="wider">{stat.label}</Text>
              <Text c="#1e293b" fz="28px" fw={900}>{stat.value}</Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Regional Performance Heatmap Mockup */}
      <Paper p="xl" radius="24px" className="border border-[#e2e8f0] shadow-sm">
        <Group justify="space-between" mb="xl">
          <Stack gap={4}>
            <Text fw={900} fz="lg" c="#1e293b">Regional Literacy Coverage</Text>
            <Text c="#94a3b8" fz="xs" fw={700}>NATIONAL PROGRESS METRICS</Text>
          </Stack>
          <Group gap="xs">
             <Badge color="green" variant="dot">On Track</Badge>
             <Badge color="orange" variant="dot">Action Required</Badge>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
          <Stack gap="lg">
             {[
               { region: "Greater Accra", val: 94, status: 'high' },
               { region: "Ashanti", val: 88, status: 'high' },
               { region: "Western", val: 72, status: 'mid' },
               { region: "Central", val: 68, status: 'mid' },
               { region: "Eastern", val: 76, status: 'mid' },
             ].map((r, i) => (
               <Group key={i} align="center">
                 <Text fz="sm" fw={800} c="#475569" className="w-32">{r.region}</Text>
                 <Box className="flex-1">
                   <Progress value={r.val} color={r.val > 80 ? "teal" : "blue"} size="lg" radius="xl" />
                 </Box>
                 <Text fz="sm" fw={900} c="#1e293b" className="w-10 ta-right">{r.val}%</Text>
               </Group>
             ))}
          </Stack>
          <Stack gap="lg">
             {[
               { region: "Northern", val: 42, status: 'low' },
               { region: "Upper East", val: 38, status: 'low' },
               { region: "Upper West", val: 45, status: 'low' },
               { region: "Volta", val: 62, status: 'mid' },
               { region: "Bono", val: 58, status: 'mid' },
             ].map((r, i) => (
               <Group key={i} align="center">
                 <Text fz="sm" fw={800} c="#475569" className="w-32">{r.region}</Text>
                 <Box className="flex-1">
                   <Progress value={r.val} color={r.val < 50 ? "orange" : "blue"} size="lg" radius="xl" />
                 </Box>
                 <Text fz="sm" fw={900} c="#1e293b" className="w-10 ta-right">{r.val}%</Text>
               </Group>
             ))}
          </Stack>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
};
