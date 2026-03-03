import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title
} from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { Link } from "react-router-dom";

import { useClassAssessmentOverviewQuery, useClassesQuery } from "../../../api/hooks/useClassQueries";
import { DashboardLayout } from "../components/DashboardLayout";

type IconProps = {
  className?: string;
  style?: CSSProperties;
};

const IconBack = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const IconSearch = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20L16.65 16.65" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </svg>
);

const IconAlertCircle = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8V12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <circle cx="12" cy="16" fill="currentColor" r="1.2" />
  </svg>
);

const IconWarningTriangle = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M12 4L21 20H3L12 4Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M12 10V14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <circle cx="12" cy="17" fill="currentColor" r="1.2" />
  </svg>
);

const IconCheckCircle = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8.5 12.5L11 15L15.5 10.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const formatRelativeDate = (value: string | null): string => {
  if (!value) {
    return "No assessment yet";
  }

  const now = Date.now();
  const measuredAt = new Date(value).getTime();
  if (Number.isNaN(measuredAt) || measuredAt > now) {
    return "No assessment yet";
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.max(1, Math.floor((now - measuredAt) / dayMs));
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(diffDays / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
};

const getStatusMeta = (
  status: "at_risk" | "support" | "on_track"
): { color: string; icon: (props: IconProps) => JSX.Element; label: string } => {
  if (status === "at_risk") {
    return { color: "#D32F45", icon: IconAlertCircle, label: "At Risk" };
  }

  if (status === "support") {
    return { color: "#A4A6B5", icon: IconWarningTriangle, label: "Needs Support" };
  }

  return { color: "#1FA54A", icon: IconCheckCircle, label: "On Track" };
};

export const AssessmentsPage = (): JSX.Element => {
  const classesQuery = useClassesQuery();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (selectedClassId || !classesQuery.data || classesQuery.data.length === 0) {
      return;
    }

    setSelectedClassId(classesQuery.data[0]?.classId ?? "");
  }, [classesQuery.data, selectedClassId]);

  const assessmentQuery = useClassAssessmentOverviewQuery(selectedClassId);
  const assessmentData = assessmentQuery.data;
  const borderColor = "var(--mantine-color-bridgeed-2)";

  const filteredLearners = useMemo(() => {
    const learners = assessmentData?.learners ?? [];
    const query = search.trim().toLowerCase();
    if (!query) {
      return learners;
    }

    return learners.filter((learner) => learner.name.toLowerCase().includes(query));
  }, [assessmentData?.learners, search]);

  const classOptions = useMemo(
    () =>
      (classesQuery.data ?? []).map((classItem) => ({
        value: classItem.classId,
        label: `${classItem.name} (${classItem.gradeLevel})`
      })),
    [classesQuery.data]
  );

  const summary = assessmentData?.summary ?? {
    atRisk: 0,
    support: 0,
    onTrack: 0,
    totalStudents: 0
  };

  return (
    <DashboardLayout role={Role.Teacher}>
      <Box className="lg:hidden max-w-[393px] mx-auto px-4 pt-4 pb-8">
        <Paper bg="green.6" p={16} radius="xl">
          <Stack gap={14}>
            <Group align="center" gap={8} wrap="nowrap">
              <ActionIcon
                aria-label="Go back to classes"
                color="green"
                component={Link}
                radius="xl"
                size={32}
                style={{ color: "white" }}
                to="/classes"
                variant="subtle"
              >
                <IconBack className="w-5 h-5" />
              </ActionIcon>
              <Stack gap={0}>
                <Text c="white" fw={700} fz={34} lh="1">
                  {assessmentData?.class.name ?? "Class"}
                </Text>
                <Text c="green.1" fw={600} fz={14}>
                  {(assessmentData?.class.subject ?? "Subject")} • {summary.totalStudents} Students
                </Text>
              </Stack>
            </Group>

            <TextInput
              leftSection={<IconSearch className="w-5 h-5" />}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search students..."
              radius="md"
              size="md"
              styles={{
                input: {
                  backgroundColor: "white",
                  border: "none"
                },
                section: {
                  color: "#6A6C7D"
                }
              }}
              value={search}
            />
          </Stack>
        </Paper>

        <SimpleGrid cols={3} mt={18} spacing={12}>
          <Card p={14} radius="md" withBorder style={{ borderColor }}>
            <Stack align="center" gap={6}>
              <ThemeIcon color="red" radius="xl" size={32} variant="light">
                <IconAlertCircle className="w-4 h-4" />
              </ThemeIcon>
              <Text c="#121421" fw={700} fz={34} lh="1">
                {summary.atRisk}
              </Text>
              <Text c="#6A6C7D" fz={14}>
                At Risk
              </Text>
            </Stack>
          </Card>
          <Card p={14} radius="md" withBorder style={{ borderColor }}>
            <Stack align="center" gap={6}>
              <ThemeIcon color="gray" radius="xl" size={32} variant="light">
                <IconWarningTriangle className="w-4 h-4" />
              </ThemeIcon>
              <Text c="#121421" fw={700} fz={34} lh="1">
                {summary.support}
              </Text>
              <Text c="#6A6C7D" fz={14}>
                Support
              </Text>
            </Stack>
          </Card>
          <Card p={14} radius="md" withBorder style={{ borderColor }}>
            <Stack align="center" gap={6}>
              <ThemeIcon color="green" radius="xl" size={32} variant="light">
                <IconCheckCircle className="w-4 h-4" />
              </ThemeIcon>
              <Text c="#121421" fw={700} fz={34} lh="1">
                {summary.onTrack}
              </Text>
              <Text c="#6A6C7D" fz={14}>
                On Track
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        <Stack gap="md" mt={24}>
          <Title c="#121421" order={2} size="h2">
            Students
          </Title>

          {assessmentQuery.isLoading && (
            <Group justify="center" py={12}>
              <Loader size="sm" />
            </Group>
          )}

          {assessmentQuery.isError && (
            <Card p={16} radius="md" withBorder>
              <Text c="red" fz={14}>
                {assessmentQuery.error?.message ?? "Unable to load assessments."}
              </Text>
            </Card>
          )}

          <Stack gap={14}>
            {filteredLearners.map((learner) => {
              const statusMeta = getStatusMeta(learner.status);
              const StatusIcon = statusMeta.icon;
              return (
                <Card
                  component={Link}
                  key={learner.learnerId}
                  p={16}
                  radius="md"
                  style={{ borderColor, textDecoration: "none" }}
                  to={`/learners/${learner.learnerId}/profile`}
                  withBorder
                >
                  <Group align="flex-start" justify="space-between" mb={4}>
                    <Text c="#121421" fw={700} fz={16} lh="24px">
                      {learner.name}
                    </Text>
                    <Text c="#6A6C7D" fz={14} lh="20px">
                      {formatRelativeDate(learner.lastAssessedAt)}
                    </Text>
                  </Group>

                  <Group gap={6} mb={12}>
                    <StatusIcon className="w-5 h-5" style={{ color: statusMeta.color }} />
                    <Text fz={16} fw={600} style={{ color: statusMeta.color }}>
                      {statusMeta.label}
                    </Text>
                  </Group>

                  <SimpleGrid cols={2} spacing={14}>
                    <Stack gap={4}>
                      <Text c="#6A6C7D" fz={14}>
                        Literacy
                      </Text>
                      <Group align="center" gap={8} wrap="nowrap">
                        <Progress
                          color="green"
                          radius="xl"
                          size={8}
                          value={learner.literacyScore ?? 0}
                          w="100%"
                        />
                        <Text c="#121421" fz={16} fw={500}>
                          {learner.literacyScore ?? 0}%
                        </Text>
                      </Group>
                    </Stack>

                    <Stack gap={4}>
                      <Text c="#6A6C7D" fz={14}>
                        Numeracy
                      </Text>
                      <Group align="center" gap={8} wrap="nowrap">
                        <Progress
                          color="green"
                          radius="xl"
                          size={8}
                          value={learner.numeracyScore ?? 0}
                          w="100%"
                        />
                        <Text c="#121421" fz={16} fw={500}>
                          {learner.numeracyScore ?? 0}%
                        </Text>
                      </Group>
                    </Stack>
                  </SimpleGrid>
                </Card>
              );
            })}

            {!assessmentQuery.isLoading && filteredLearners.length === 0 && (
              <Card p={16} radius="md" withBorder>
                <Text c="#6A6C7D" fz={14}>
                  No learners match your search.
                </Text>
              </Card>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box className="hidden lg:block p-8">
        <div className="max-w-6xl mx-auto">
          <Group justify="space-between" mb={20}>
            <Stack gap={4}>
              <Title c="#121421" order={1} size="h1">
                Assessments
              </Title>
              <Text c="#6A6C7D" fz={14}>
                Monitor literacy and numeracy progress by class.
              </Text>
            </Stack>
            <Select
              data={classOptions}
              onChange={(value) => setSelectedClassId(value ?? "")}
              placeholder="Select class"
              value={selectedClassId}
              w={260}
            />
          </Group>

          {assessmentQuery.isLoading && (
            <Group justify="center" py={24}>
              <Loader size="sm" />
            </Group>
          )}

          {assessmentQuery.isError && (
            <Card p={16} radius={12} withBorder>
              <Text c="red" fz={14}>
                {assessmentQuery.error?.message ?? "Unable to load assessments."}
              </Text>
            </Card>
          )}

          {assessmentData && (
            <Stack gap={16}>
              <SimpleGrid cols={4} spacing={12}>
                <Card p={14} radius={12} withBorder>
                  <Text c="#6A6C7D" fz={13}>
                    Class
                  </Text>
                  <Text c="#121421" fw={700} fz={16}>
                    {assessmentData.class.name}
                  </Text>
                </Card>
                <Card p={14} radius={12} withBorder>
                  <Text c="#6A6C7D" fz={13}>
                    At Risk
                  </Text>
                  <Text c="#121421" fw={700} fz={16}>
                    {assessmentData.summary.atRisk}
                  </Text>
                </Card>
                <Card p={14} radius={12} withBorder>
                  <Text c="#6A6C7D" fz={13}>
                    Support
                  </Text>
                  <Text c="#121421" fw={700} fz={16}>
                    {assessmentData.summary.support}
                  </Text>
                </Card>
                <Card p={14} radius={12} withBorder>
                  <Text c="#6A6C7D" fz={13}>
                    On Track
                  </Text>
                  <Text c="#121421" fw={700} fz={16}>
                    {assessmentData.summary.onTrack}
                  </Text>
                </Card>
              </SimpleGrid>

              <Card p={0} radius={12} withBorder>
                <Box px={16} py={12}>
                  <TextInput
                    leftSection={<IconSearch className="w-4 h-4" />}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search students..."
                    value={search}
                  />
                </Box>
                <Box px={16} pb={16}>
                  <SimpleGrid cols={{ lg: 2, xl: 3 }} spacing={12}>
                    {filteredLearners.map((learner) => {
                      const statusMeta = getStatusMeta(learner.status);
                      const StatusIcon = statusMeta.icon;

                      return (
                        <Card key={learner.learnerId} p={16} radius="md" style={{ borderColor }} withBorder>
                          <Group align="flex-start" justify="space-between" mb={4}>
                            <Text c="#121421" fw={700} fz={16} lh="24px">
                              {learner.name}
                            </Text>
                            <Text c="#6A6C7D" fz={13} lh="20px">
                              {formatRelativeDate(learner.lastAssessedAt)}
                            </Text>
                          </Group>

                          <Group gap={6} mb={12}>
                            <StatusIcon className="w-5 h-5" style={{ color: statusMeta.color }} />
                            <Text fz={15} fw={600} style={{ color: statusMeta.color }}>
                              {statusMeta.label}
                            </Text>
                          </Group>

                          <SimpleGrid cols={2} spacing={12}>
                            <Stack gap={4}>
                              <Text c="#6A6C7D" fz={13}>
                                Literacy
                              </Text>
                              <Group align="center" gap={8} wrap="nowrap">
                                <Progress
                                  color="green"
                                  radius="xl"
                                  size={8}
                                  value={learner.literacyScore ?? 0}
                                  w="100%"
                                />
                                <Text c="#121421" fz={14} fw={500}>
                                  {learner.literacyScore ?? 0}%
                                </Text>
                              </Group>
                            </Stack>
                            <Stack gap={4}>
                              <Text c="#6A6C7D" fz={13}>
                                Numeracy
                              </Text>
                              <Group align="center" gap={8} wrap="nowrap">
                                <Progress
                                  color="green"
                                  radius="xl"
                                  size={8}
                                  value={learner.numeracyScore ?? 0}
                                  w="100%"
                                />
                                <Text c="#121421" fz={14} fw={500}>
                                  {learner.numeracyScore ?? 0}%
                                </Text>
                              </Group>
                            </Stack>
                          </SimpleGrid>

                          <Group justify="flex-end" mt={12}>
                            <Button
                              component={Link}
                              size="compact-xs"
                              to={`/learners/${learner.learnerId}/profile`}
                              variant="light"
                            >
                              View
                            </Button>
                          </Group>
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </Card>

              {!assessmentQuery.isLoading && filteredLearners.length === 0 && (
                <Card p={16} radius={12} withBorder>
                  <Text c="#6A6C7D" fz={14}>
                    No learners match your search.
                  </Text>
                </Card>
              )}
            </Stack>
          )}
        </div>
      </Box>
    </DashboardLayout>
  );
};
