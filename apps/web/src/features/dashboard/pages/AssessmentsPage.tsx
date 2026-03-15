import { useState } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  Stack,
  Button,
  Box,
  Badge,
  Tabs,
  ActionIcon,
  Select,
  Progress,
  Loader,
  Center
} from "@mantine/core";
import {
  useClassesQuery,
  useClassAssessmentOverviewQuery,
  useClassAssessmentHistoryQuery
} from "../../../api/hooks/useClassQueries";

// --- Icons ---
const IconClipboard = () => (
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
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect width="8" height="4" x="8" y="2" rx="1" />
    <path d="M9 14h6" />
    <path d="M9 10h6" />
  </svg>
);

const IconHistory = () => (
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
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const IconArrowRight = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconSparkles = () => (
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

export const AssessmentsPage = (): JSX.Element => {
  const { data: classes } = useClassesQuery();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const { data: overview, isLoading: overviewLoading } = useClassAssessmentOverviewQuery(
    selectedClassId || ""
  );
  const { data: history, isLoading: historyLoading } = useClassAssessmentHistoryQuery(
    selectedClassId || ""
  );

  const assessmentTypes = [
    {
      title: "Foundational Literacy Screener",
      duration: "10-15 mins",
      desc: "Comprehensive diagnostic for letter recognition, phonics, and basic reading fluency.",
      tags: ["LITERACY", "RAPID"],
      color: "blue"
    },
    {
      title: "Core Numeracy Diagnostic",
      duration: "12-18 mins",
      desc: "Evaluates number sense, place value, and basic arithmetic operations (addition/subtraction).",
      tags: ["NUMERACY", "ADAPTIVE"],
      color: "teal"
    },
    {
      title: "Misconception Check: Fractions",
      duration: "5-8 mins",
      desc: "Targeted skill check for identifying common conceptual errors in basic fractions.",
      tags: ["NUMERACY", "FOCUSED"],
      color: "orange"
    }
  ];

  return (
    <Stack gap={32}>
      <Group align="flex-end" justify="space-between">
        <Stack gap={4}>
          <Title className="text-3xl font-black text-[#1e293b] tracking-tight" order={1}>
            Assessments
          </Title>
          <Text c="#64748b" fw={500}>
            Diagnose learning gaps and track mastery across your classes.
          </Text>
        </Stack>
      </Group>

      <Tabs defaultValue="available" radius="md" variant="pills">
        <Tabs.List mb="xl">
          <Tabs.Tab leftSection={<IconClipboard />} value="available">
            Library
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconSparkles />} value="tracking">
            Status & Insights
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconHistory />} value="history">
            History
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="available">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title className="text-2xl font-black text-[#1e293b]" order={2}>
                Available Diagnostics
              </Title>
              <Select
                className="w-64"
                data={classes?.map((c) => ({ value: c.classId, label: c.name })) || []}
                onChange={setSelectedClassId}
                placeholder="Select a class to start"
                radius="md"
                value={selectedClassId}
              />
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
              {assessmentTypes.map((type, i) => (
                <Paper
                  className="border border-[#e2e8f0] shadow-sm flex flex-col justify-between hover:border-[#ea580c] transition-colors bg-white"
                  key={i}
                  p="xl"
                  radius="24px"
                >
                  <Box>
                    <Group justify="space-between" mb="xl">
                      <Group gap={8}>
                        {type.tags.map((tag) => (
                          <Badge color={type.color} key={tag} size="sm" variant="light">
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                      <Text c="#94a3b8" fw={800} fz="xs">
                        {type.duration}
                      </Text>
                    </Group>
                    <Title className="text-xl font-black text-[#1e293b] mb-4" order={3}>
                      {type.title}
                    </Title>
                    <Text c="#64748b" fw={500} fz="sm" lh="1.6" mb="xl">
                      {type.desc}
                    </Text>
                  </Box>

                  <Button
                    bg="#ea580c"
                    className="hover:bg-[#c2410c] h-12"
                    disabled={!selectedClassId}
                    fullWidth
                    radius="md"
                  >
                    Start Assessment
                  </Button>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="tracking">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title className="text-2xl font-black text-[#1e293b]" order={2}>
                Class Insights
              </Title>
              <Select
                className="w-64"
                data={classes?.map((c) => ({ value: c.classId, label: c.name })) || []}
                onChange={setSelectedClassId}
                placeholder="Select Class"
                radius="md"
                value={selectedClassId}
              />
            </Group>

            {!selectedClassId ? (
              <Paper
                className="border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc]"
                p={80}
                radius="24px"
              >
                <Center>
                  <Stack align="center" gap="md">
                    <Box className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#94a3b8]">
                      <IconClipboard />
                    </Box>
                    <Text c="#64748b" fw={700}>
                      Select a class to view diagnostic coverage and results
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            ) : overviewLoading ? (
              <Center py={100}>
                <Loader color="orange" />
              </Center>
            ) : overview ? (
              <Stack gap="xl">
                <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
                  <Paper className="border border-[#e2e8f0] bg-white" p="lg" radius="xl">
                    <Text c="#94a3b8" fw={800} fz="xs" mb="xs">
                      ASSESSED
                    </Text>
                    <Text fz="24px" fw={900}>
                      {overview.summary.totalStudents -
                        (overview.summary.atRisk +
                          overview.summary.support +
                          overview.summary.onTrack)}{" "}
                      / {overview.summary.totalStudents}
                    </Text>
                  </Paper>
                  <Paper className="border border-[#e2e8f0] bg-white" p="lg" radius="xl">
                    <Text c="red" fw={800} fz="xs" mb="xs">
                      AT RISK
                    </Text>
                    <Text c="red" fz="24px" fw={900}>
                      {overview.summary.atRisk}
                    </Text>
                  </Paper>
                  <Paper className="border border-[#e2e8f0] bg-white" p="lg" radius="xl">
                    <Text c="orange" fw={800} fz="xs" mb="xs">
                      NEEDS SUPPORT
                    </Text>
                    <Text c="orange" fz="24px" fw={900}>
                      {overview.summary.support}
                    </Text>
                  </Paper>
                  <Paper className="border border-[#e2e8f0] bg-white" p="lg" radius="xl">
                    <Text c="green" fw={800} fz="xs" mb="xs">
                      ON TRACK
                    </Text>
                    <Text c="green" fz="24px" fw={900}>
                      {overview.summary.onTrack}
                    </Text>
                  </Paper>
                </SimpleGrid>

                <Paper
                  className="border border-[#e2e8f0] bg-white overflow-hidden"
                  p="xl"
                  radius="24px"
                >
                  <Group justify="space-between" mb="xl">
                    <Title className="text-xl font-black text-[#1e293b]" order={3}>
                      Learner Performance Snapshot
                    </Title>
                    <Button color="orange" fw={700} variant="subtle">
                      Download CSV Report
                    </Button>
                  </Group>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#f1f5f9]">
                          <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                            Learner Name
                          </th>
                          <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                            Literacy
                          </th>
                          <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                            Numeracy
                          </th>
                          <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                            Last Assessed
                          </th>
                          <th className="pb-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.learners.map((learner) => (
                          <tr
                            className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors"
                            key={learner.learnerId}
                          >
                            <td className="py-4 font-bold text-[#1e293b]">{learner.name}</td>
                            <td className="py-4">
                              <Badge
                                className="font-bold"
                                color={
                                  learner.status === "at_risk"
                                    ? "red"
                                    : learner.status === "support"
                                      ? "orange"
                                      : "green"
                                }
                                size="sm"
                                variant="light"
                              >
                                {learner.status.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <Group gap="xs" className="w-32">
                                <Progress
                                  className="flex-1"
                                  color="blue"
                                  radius="xl"
                                  size="xs"
                                  value={learner.literacyScore || 0}
                                />
                                <Text c="#1e293b" fw={800} fz="xs">
                                  {learner.literacyScore || 0}%
                                </Text>
                              </Group>
                            </td>
                            <td className="py-4">
                              <Group gap="xs" className="w-32">
                                <Progress
                                  className="flex-1"
                                  color="teal"
                                  radius="xl"
                                  size="xs"
                                  value={learner.numeracyScore || 0}
                                />
                                <Text c="#1e293b" fw={800} fz="xs">
                                  {learner.numeracyScore || 0}%
                                </Text>
                              </Group>
                            </td>
                            <td className="py-4 text-xs font-bold text-[#64748b]">
                              {learner.lastAssessedAt
                                ? new Date(learner.lastAssessedAt).toLocaleDateString()
                                : "Never"}
                            </td>
                            <td className="py-4">
                              <ActionIcon color="gray" radius="xl" variant="subtle">
                                <IconArrowRight />
                              </ActionIcon>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Paper>
              </Stack>
            ) : (
              <Text>Error loading overview.</Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title className="text-2xl font-black text-[#1e293b]" order={2}>
                Assessment History
              </Title>
              <Select
                className="w-64"
                data={classes?.map((c) => ({ value: c.classId, label: c.name })) || []}
                onChange={setSelectedClassId}
                placeholder="Select Class"
                radius="md"
                value={selectedClassId}
              />
            </Group>

            {!selectedClassId ? (
              <Paper
                className="border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc]"
                p={80}
                radius="24px"
              >
                <Center>
                  <Stack align="center" gap="md">
                    <Box className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#94a3b8]">
                      <IconHistory />
                    </Box>
                    <Text c="#64748b" fw={700}>
                      Select a class to view assessment history
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            ) : historyLoading ? (
              <Center py={100}>
                <Loader color="orange" />
              </Center>
            ) : history && history.attempts.length > 0 ? (
              <Paper
                className="border border-[#e2e8f0] bg-white overflow-hidden"
                p="xl"
                radius="24px"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#f1f5f9]">
                        <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                          Learner
                        </th>
                        <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                          Assessment
                        </th>
                        <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                          Score
                        </th>
                        <th className="pb-4 font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="pb-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.attempts.map((attempt) => (
                        <tr
                          className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors"
                          key={attempt.attemptId}
                        >
                          <td className="py-4 font-bold text-[#1e293b]">{attempt.learnerName}</td>
                          <td className="py-4 text-sm font-semibold text-[#475569]">
                            {attempt.assessmentName}
                          </td>
                          <td className="py-4">
                            <Badge
                              color={
                                attempt.score !== null && attempt.score > 70
                                  ? "green"
                                  : attempt.score !== null && attempt.score > 50
                                    ? "orange"
                                    : "red"
                              }
                              variant="light"
                            >
                              {attempt.score !== null ? `${attempt.score}%` : "N/A"}
                            </Badge>
                          </td>
                          <td className="py-4 text-xs font-bold text-[#64748b]">
                            {new Date(attempt.assessedAt).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            <Button color="orange" fw={700} size="xs" variant="subtle">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Paper>
            ) : (
              <Paper
                className="border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc]"
                p={80}
                radius="24px"
              >
                <Center>
                  <Stack align="center" gap="md">
                    <Text c="#64748b" fw={700}>
                      No assessment attempts found for this class yet.
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
