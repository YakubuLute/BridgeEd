import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  SimpleGrid,
  Text,
  Title,
  Paper,
  Badge,
  Group,
  Stack
} from "@mantine/core";

// --- Icons ---
const IconChart = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
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

const IconTarget = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconTrendingUp = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconWifiOff = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M8.5 8.5a10 10 0 0 1 11 0" />
    <path d="M5 12a10 10 0 0 1 5-2.5" />
    <path d="M1 16a10 10 0 0 1 2-1" />
    <path d="M12 20h.01" />
  </svg>
);

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      {/* --- Navigation Bar --- */}
      <header className="h-16 md:h-20 bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <Container size="xl" className="h-full flex items-center justify-between">
          <Group gap="sm">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center shadow-sm">
              <Text c="white" fw={700} fz={{ base: 16, md: 20 }} lh="1">
                B
              </Text>
            </div>
            <Text c="#0F172A" fw={800} fz={{ base: 20, md: 24 }} lh="1" className="tracking-tight">
              BridgeEd
            </Text>
          </Group>
          <Group gap="sm">
            <Button
              variant="default"
              color="gray"
              radius="md"
              size="md"
              onClick={() => navigate("/login/phone")}
              className="hidden md:block text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC]"
            >
              Log in
            </Button>
            <Button
              color="#1E3A8A"
              radius="md"
              size="md"
              onClick={() => navigate("/register")}
              className="bg-[#1E3A8A] hover:bg-[#152C6B] transition-colors"
            >
              Get Started
            </Button>
          </Group>
        </Container>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="pt-20 pb-24 md:pt-32 md:pb-36 px-4">
          <Container size="md" className="text-center">
            <Badge
              color="#15803D"
              variant="light"
              size="lg"
              radius="xl"
              mb="xl"
              className="font-semibold px-4 py-2 uppercase tracking-wide"
            >
              Empowering Educators
            </Badge>
            <Title
              order={1}
              className="text-[#0F172A] font-extrabold text-4xl md:text-6xl leading-tight md:leading-[1.1] mb-6 tracking-tight"
            >
              Bridging Foundational <span className="text-[#1E3A8A]">Learning Gaps.</span>
            </Title>
            <Text
              c="#475569"
              fz={{ base: 18, md: 22 }}
              lh="1.6"
              mb="xl"
              className="max-w-2xl mx-auto"
            >
              AI-powered diagnostics and targeted remediation for classrooms everywhere. Quickly
              identify student needs and assign actionable lesson plans—even entirely offline.
            </Text>
            <Group justify="center" gap="md" mt="xl">
              <Button
                color="#1E3A8A"
                radius="md"
                size="xl"
                onClick={() => navigate("/register")}
                className="bg-[#1E3A8A] hover:bg-[#152C6B] transition-colors text-base"
              >
                Register Your School
              </Button>
              <Button
                variant="default"
                radius="md"
                size="xl"
                onClick={() => navigate("/login/phone")}
                className="text-[#0F172A] border-[#E2E8F0] hover:bg-white text-base"
              >
                Teacher Login
              </Button>
            </Group>
          </Container>
        </section>

        {/* --- Core Features Section --- */}
        <section className="py-20 bg-white px-4 border-t border-b border-[#E2E8F0]">
          <Container size="xl">
            <div className="text-center mb-16">
              <Text c="#1E3A8A" fw={700} fz="sm" tt="uppercase" tracking="wider" mb="xs">
                Platform Capabilities
              </Text>
              <Title order={2} className="text-[#0F172A] font-bold text-3xl md:text-4xl">
                Everything you need to accelerate learning
              </Title>
            </div>

            <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="xl">
              {[
                {
                  icon: <IconChart />,
                  title: "Rapid AI Diagnostics",
                  desc: "Administer 5-15 minute screeners that pinpoint exact literacy and numeracy gaps with high accuracy."
                },
                {
                  icon: <IconTarget />,
                  title: "Targeted Remediation",
                  desc: "Instantly generate teacher-ready lesson plans and practice tasks based on the specific gaps identified."
                },
                {
                  icon: <IconTrendingUp />,
                  title: "Longitudinal Tracking",
                  desc: "Follow learner profiles and mastery trends across terms and schools to ensure consistent growth."
                },
                {
                  icon: <IconWifiOff />,
                  title: "Offline-First Design",
                  desc: "Fully functional without internet. Run assessments locally and sync seamlessly when you're back online."
                }
              ].map((feature, idx) => (
                <Paper
                  key={idx}
                  p="xl"
                  radius="xl"
                  className="bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] mb-6 shadow-sm">
                    {feature.icon}
                  </div>
                  <Text c="#0F172A" fw={700} fz="lg" mb="sm">
                    {feature.title}
                  </Text>
                  <Text c="#475569" fz="sm" lh="1.6">
                    {feature.desc}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Container>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-24 px-4">
          <Container size="lg">
            <div className="text-center mb-16">
              <Title order={2} className="text-[#0F172A] font-bold text-3xl md:text-4xl mb-4">
                How BridgeEd Works
              </Title>
              <Text c="#475569" fz="lg">
                A simple 3-step process to transform your classroom.
              </Text>
            </div>

            <div className="flex flex-col md:flex-row gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-[#E2E8F0] z-0" />

              {[
                {
                  step: "1",
                  title: "Assess",
                  desc: "Run quick, adaptive screeners with your class to evaluate foundational skills."
                },
                {
                  step: "2",
                  title: "Analyze",
                  desc: "BridgeEd's AI instantly scores responses and clusters common misconceptions."
                },
                {
                  step: "3",
                  title: "Act",
                  desc: "Assign targeted small-group activities and monitor continuous growth."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-[#F8FAFC] shadow-sm flex items-center justify-center mb-6 text-2xl font-black text-[#1E3A8A]">
                      {item.step}
                    </div>
                    <Text c="#0F172A" fw={700} fz="xl" mb="xs">
                      {item.title}
                    </Text>
                    <Text c="#475569" fz="md" lh="1.6">
                      {item.desc}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* --- CTA / Banner Section --- */}
        <section className="py-20 bg-[#1E3A8A] px-4">
          <Container size="md" className="text-center">
            <Title order={2} className="text-white font-bold text-3xl md:text-4xl mb-6">
              Ready to close the learning gap?
            </Title>
            <Text c="white" opacity={0.9} fz="lg" mb="xl" className="max-w-2xl mx-auto">
              Join hundreds of educators using BridgeEd to accurately diagnose and remediate student
              needs.
            </Text>
            <Button
              color="white"
              variant="white"
              radius="md"
              size="xl"
              onClick={() => navigate("/register")}
              className="text-[#1E3A8A] font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started Today
            </Button>
          </Container>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white py-12 px-4 border-t border-[#E2E8F0]">
        <Container size="xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Group gap="sm">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
                <Text c="white" fw={700} fz={16} lh="1">
                  B
                </Text>
              </div>
              <Text c="#0F172A" fw={800} fz={20} lh="1">
                BridgeEd
              </Text>
            </Group>

            <Group gap="xl">
              <Text
                c="#475569"
                fz="sm"
                className="hover:text-[#1E3A8A] cursor-pointer transition-colors"
              >
                About Us
              </Text>
              <Text
                c="#475569"
                fz="sm"
                className="hover:text-[#1E3A8A] cursor-pointer transition-colors"
              >
                Contact Support
              </Text>
              <Text
                c="#475569"
                fz="sm"
                className="hover:text-[#1E3A8A] cursor-pointer transition-colors"
              >
                Privacy Policy
              </Text>
            </Group>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E2E8F0] text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <Text c="#94A3B8" fz="xs">
              &copy; {new Date().getFullYear()} BridgeEd. All rights reserved.
            </Text>
            <Text c="#94A3B8" fz="xs" mt={{ base: "sm", md: 0 }}>
              Bridging Foundational Learning Gaps.
            </Text>
          </div>
        </Container>
      </footer>
    </div>
  );
};
