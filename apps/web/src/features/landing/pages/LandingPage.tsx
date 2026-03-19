import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  SimpleGrid,
  Text,
  Title,
  Paper,
  Group,
  Stack,
  Box,
  Badge,
  Avatar
} from "@mantine/core";
import { IconActivity, IconBook, IconClipboard, IconReports, IconSettings } from "../../dashboard/components/DashboardLayout";

// --- Icons (Lucide-style) ---
const IconPlay = () => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconArrowRight = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconDashboard = () => (
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
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const IconShield = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ea580c"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCpu = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ea580c"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const IconCloud = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ea580c"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.1-3.9-4.4-.5-3.3-3.3-5.9-6.6-5.9-2.7 0-5 1.7-6 4.1-2.3.2-4.1 2.2-4.1 4.5C1.5 15.1 3.4 17 5.7 17H17.5" />
    <polyline points="12 11 12 16" />
    <polyline points="9 13 12 11 15 13" />
  </svg>
);

const IconDatabase = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ea580c"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-[#334155]">
      {/* --- Navigation Bar --- */}
      <header className="h-20 bg-white sticky top-0 z-50">
        <Container size="xl" className="h-full flex items-center justify-between">
          <Group gap="xs">
            <Box className="w-10 h-10 rounded-lg bg-[#ea580c] flex items-center justify-center shadow-lg shadow-orange-200">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </Box>
            <Text c="#1e293b" fw={900} fz={24} className="tracking-tight">
              BridgeEd
            </Text>
          </Group>

          <Group gap="xl" className="hidden lg:flex">
            <Text fw={600} fz="sm" className="cursor-pointer hover:text-[#ea580c]">
              Features
            </Text>
            <Text fw={600} fz="sm" className="cursor-pointer hover:text-[#ea580c]">
              Dashboard
            </Text>
            <Text fw={600} fz="sm" className="cursor-pointer hover:text-[#ea580c]">
              Technology
            </Text>
            <Text fw={600} fz="sm" className="cursor-pointer hover:text-[#ea580c]">
              Pricing
            </Text>
          </Group>

          <Group gap="md">
            <Text
              fw={700}
              fz="sm"
              className="cursor-pointer hover:text-[#ea580c] px-4"
              onClick={() => navigate("/login/phone")}
            >
              Log in
            </Text>
            <Button
              bg="#ea580c"
              radius="md"
              size="md"
              onClick={() => navigate("/register")}
              className="hover:bg-[#c2410c] px-6 h-12 font-bold shadow-lg shadow-orange-100"
            >
              Book Demo
            </Button>
          </Group>
        </Container>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="pt-16 pb-20 px-4 bg-white overflow-hidden">
          <Container size="md" className="text-center relative">
            <Badge
              variant="light"
              color="orange"
              radius="xl"
              size="lg"
              mb="xl"
              className="py-4 px-6 font-bold"
              leftSection={<Box className="w-2 h-2 rounded-full bg-orange-500" />}
            >
              BridgeEd Solution
            </Badge>

            <Title
              order={1}
              className="text-[#334155] font-black text-5xl md:text-7xl leading-tight mb-6"
            >
              AI-Driven Digital <br />
              <span className="text-[#ea580c]">Transformation</span> for <br />
              Schools
            </Title>

            <Text
              c="#64748b"
              fz={20}
              className="max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
            >
              Manage every school operation smoothly with BridgeEd dashboard. Revolutionize
              diagnostics, remediation, and daily tasks with powerful AI automation.
            </Text>

            <Group justify="center" gap="lg" mt="xl">
              <Button
                bg="#ea580c"
                radius="md"
                size="xl"
                onClick={() => navigate("/register")}
                rightSection={<IconArrowRight />}
                className="h-16 px-10 text-lg font-bold shadow-2xl shadow-orange-200 hover:bg-[#c2410c]"
              >
                Start Free Trial
              </Button>
              <Button
                variant="white"
                color="dark"
                radius="md"
                size="xl"
                leftSection={<IconPlay />}
                className="h-16 px-10 text-lg font-bold border border-[#e2e8f0] hover:bg-gray-50 shadow-sm"
              >
                Watch Video
              </Button>
            </Group>
          </Container>
        </section>

        {/* --- Dashboard Preview / KPIs --- */}
        <section className="pb-24 px-4 bg-white">
          <Container size="xl">
            {/* The Browser/App UI Frame */}
            <Box className="bg-[#f1f5f9] rounded-[32px] p-1 md:p-3 border border-[#e2e8f0] shadow-2xl overflow-hidden">
              <div className="bg-white rounded-[24px] overflow-hidden flex min-h-[600px] border border-[#e2e8f0]">
                {/* Sidebar Mockup */}
                <div className="w-[240px] bg-[#ea580c] p-6 hidden md:flex flex-col">
                  <Group mb={40}>
                    <Box className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </Box>
                    <Stack gap={0}>
                      <Text c="white" fw={800} fz="sm">
                        BridgeEd
                      </Text>
                      <Text c="white" opacity={0.7} fz={10} fw={700}>
                        Academy
                      </Text>
                    </Stack>
                  </Group>

                  <div className="flex-1 space-y-1">
                    <Group className="bg-white/20 px-4 py-3 rounded-xl text-white">
                      <IconDashboard />
                      <Text fz="sm" fw={700}>
                        Dashboard
                      </Text>
                    </Group>
                    <Group className="bg-gray-600/20 px-4 py-3 rounded-xl text-white">
                     <IconBook className="w-5 h-5"/>
                      <Text fz="sm" fw={700}>
                        Classes
                      </Text>
                    </Group>
                    <Group className="bg-gray-600/20 px-4 py-3 rounded-xl text-white">
                      <IconClipboard className="w-5 h-5"/>
                      <Text fz="sm" fw={700}>
                        Assessments
                      </Text>
                    </Group>
                    <Group className="bg-gray-600/20 px-4 py-3 rounded-xl text-white">
                      <IconActivity className="w-5 h-5"/>
                      <Text fz="sm" fw={700}>
                        Activity
                      </Text>
                    </Group>
                    <Group className="bg-gray-600/20 px-4 py-3 rounded-xl text-white">
                      <IconReports className="w-5 h-5"/>
                      <Text fz="sm" fw={700}>
                        Reports
                      </Text>
                    </Group>
                    <Group className="bg-gray-600/20 px-4 py-3 rounded-xl text-white">
                      <IconSettings className="w-5 h-5"/>
                      <Text fz="sm" fw={700}>
                        Settings
                      </Text>
                    </Group>
                
                
                  </div>
                </div>

                {/* Main Content Mockup */}
                <div className="flex-1 bg-[#f8fafc] flex flex-col">
                  <header className="h-20 bg-white border-b border-[#e2e8f0] flex items-center justify-end px-8">
                    <Group gap="sm">
                      <Avatar
                        size="md"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                        radius="xl"
                      />
                      <Stack gap={0}>
                        <Text fw={800} fz="sm">
                          Ruth Armstrong
                        </Text>
                        <Text c="#94a3b8" fz={10} fw={700}>
                          School Teacher
                        </Text>
                      </Stack>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2.5"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Group>
                  </header>

                  <div className="p-8 space-y-8">
                    {/* Welcome Banner */}
                    <Paper
                      radius="24px"
                      p={40}
                      className="bg-[#475569] text-white relative overflow-hidden"
                    >
                      <div className="relative z-10 max-w-md">
                        <Text fz="xl" fw={500} opacity={0.8} mb="xs">
                          Welcome,
                        </Text>
                        <Title order={2} className="text-5xl font-black mb-4">
                          <span className="text-[#ea580c]">Lute's School of Sciences</span>
                        </Title>
                        <Text fz="xl" fw={700} mb="xl">
                          to the digital revolution
                        </Text>
                        <Text opacity={0.7} mb={32} fw={500}>
                          We&apos;ve created this hub to revolutionise school diagnostic and
                          tracking teams by solving your daily frustrations.
                        </Text>

                        <Text fw={800} mb="sm">
                          its core focus
                        </Text>
                        <Stack gap="xs">
                          <Text fz="sm">
                            <span className="text-[#ea580c] fw-bold">Save you time</span> with
                            Dashboard
                          </Text>
                          <Text fz="sm">
                            <span className="text-[#ea580c] fw-bold">Save you money</span> with
                            clear gap attribution
                          </Text>
                          <Text fz="sm">
                            <span className="text-[#ea580c] fw-bold">Reduce your stress</span> by
                            removing daily hurdles
                          </Text>
                        </Stack>
                      </div>
                      <Box className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                        <svg width="300" height="300" viewBox="0 0 24 24" fill="#ea580c">
                          <path d="M4.5 16.5c.34.46.62.96.83 1.48a14 14 0 0 0 5.17-5.17 11.2 11.2 0 0 0-1.48-.83c-.48 1.6-1.92 3.04-4.52 4.52zM15 9l-3 3 6 6 3-3-6-6zM3 3l18 18" />
                        </svg>
                      </Box>
                    </Paper>

                    {/* KPI Grid */}
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="lg">
                      {[
                        { label: "Diagnostic Chats", val: "280", trend: "+10%" },
                        { label: "Remediation Plans", val: "32", trend: "+4.2%" },
                        { label: "Learner Profiles", val: "54", trend: "+4.8%" },
                        { label: "Total Assessments", val: "120", trend: "+2.8%" },
                        { label: "Support Requests", val: "45", trend: "+12%" }
                      ].map((item, i) => (
                        <Paper
                          key={i}
                          p="xl"
                          radius="24px"
                          className="border border-[#e2e8f0] shadow-sm"
                        >
                          <Title order={3} className="text-4xl font-black mb-1">
                            {item.val}
                          </Title>
                          <Text c="#94a3b8" fz={12} fw={700} mb="md">
                            {item.label}
                          </Text>
                          <Group gap={6}>
                            <Badge variant="light" color="green" radius="sm" className="font-bold">
                              {item.trend}
                            </Badge>
                            <Text c="#94a3b8" fz={10} fw={700}>
                              from last 30 days
                            </Text>
                          </Group>
                        </Paper>
                      ))}
                    </SimpleGrid>
                  </div>
                </div>
              </div>
            </Box>
          </Container>
        </section>

        {/* --- Technology Highlights Section --- */}
        <section className="py-24 bg-[#f8fafc] px-4">
          <Container size="xl">
            <Title order={2} className="text-[#334155] font-black text-3xl mb-12">
              Technology Highlights
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={24}>
              {[
                { icon: <IconCloud />, title: "AWS-based architecture" },
                { icon: <IconDatabase />, title: "Multi-tenant platform" },
                { icon: <IconCpu />, title: "Gemini-powered Voice AI" },
                { icon: <IconShield />, title: "GDPR Compliant" },
                {
                  icon: (
                    <Box className="w-10 h-10 flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </Box>
                  ),
                  title: "AES-256 encryption"
                },
                { icon: <IconCloud />, title: "Automatic data sync" },
                { icon: <IconCpu />, title: "Vector embeddings (LlamaParse)" }
              ].map((tech, i) => (
                <Paper
                  key={i}
                  p={32}
                  radius="20px"
                  className="bg-white border border-[#e2e8f0] flex flex-col items-center justify-center text-center shadow-sm min-h-[200px]"
                >
                  <Box mb={24} className="flex items-center justify-center">
                    {tech.icon}
                  </Box>
                  <Text fw={800} fz="md" c="#334155" className="max-w-[160px] leading-snug">
                    {tech.title}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white py-20 px-4 border-t border-[#e2e8f0]">
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 4 }} spacing={48}>
            <Stack gap="lg">
              <Group gap="xs">
                <Box className="w-8 h-8 rounded-lg bg-[#ea580c] flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </Box>
                <Text c="#1e293b" fw={900} fz={20}>
                  BridgeEd
                </Text>
              </Group>
              <Text c="#64748b" fz="14px" fw={400} className="leading-relaxed max-w-[240px]">
                Empowering educational institutions with AI-driven tools to streamline operations
                and enhance learning environments.
              </Text>
              <Group gap="lg" mt={24}>
                <Box className="text-[#94a3b8] hover:text-[#ea580c] cursor-pointer transition-colors">
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
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Box>
                <Box className="text-[#94a3b8] hover:text-[#ea580c] cursor-pointer transition-colors">
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
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Box>
                <Box className="text-[#94a3b8] hover:text-[#ea580c] cursor-pointer transition-colors">
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
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Box>
              </Group>
            </Stack>

            {["Product", "Resources", "Company"].map((title, i) => (
              <Stack key={title} gap="lg">
                <Text fw={900} fz="md" c="#1e293b">
                  {title}
                </Text>
                <Stack gap="xs">
                  {[
                    "Features",
                    "Pricing",
                    "Case Studies",
                    "Reviews",
                    "Blog",
                    "Help Center",
                    "Webinars",
                    "Community",
                    "About Us",
                    "Careers",
                    "Contact",
                    "Partners"
                  ]
                    .slice(i * 4, (i + 1) * 4)
                    .map((link) => (
                      <Text
                        key={link}
                        c="#64748b"
                        fz="14px"
                        fw={400}
                        className="cursor-pointer hover:text-[#ea580c]"
                      >
                        {link}
                      </Text>
                    ))}
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </footer>
    </div>
  );
};
