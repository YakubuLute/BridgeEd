import {
  ActionIcon,
  Box,
  Card,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { Role, type AssessmentTimelineItem } from "@bridgeed/shared";
import { Link, useParams } from "react-router-dom";

import { useClassesQuery } from "../../../api/hooks/useClassQueries";
import { useLearnerProfileQuery } from "../../../api/hooks/useLearnerQueries";
import { DashboardLayout } from "../components/DashboardLayout";

type IconProps = {
  className?: string;
};

type AssessmentLevel = "emerging" | "basic" | "intermediate" | "mastery" | "not_assessed";

type AssessmentSummary = {
  assessedAt: string | null;
  label: string;
  level: AssessmentLevel;
  score: number | null;
  title: string;
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

const IconBook = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M3 5.5C3 4.67 3.67 4 4.5 4H11V20H4.5A1.5 1.5 0 0 1 3 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M21 5.5C21 4.67 20.33 4 19.5 4H13V20H19.5A1.5 1.5 0 0 0 21 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconCalculator = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <rect height="18" rx="2" stroke="currentColor" strokeWidth="2" width="14" x="5" y="3" />
    <rect height="3" rx="1" stroke="currentColor" strokeWidth="2" width="8" x="8" y="6" />
    <circle cx="9.5" cy="12.5" fill="currentColor" r="1.2" />
    <circle cx="14.5" cy="12.5" fill="currentColor" r="1.2" />
    <circle cx="9.5" cy="16.5" fill="currentColor" r="1.2" />
    <circle cx="14.5" cy="16.5" fill="currentColor" r="1.2" />
  </svg>
);

const levelFromScore = (score: number | null): AssessmentLevel => {
  if (score === null) {
    return "not_assessed";
  }
  if (score < 55) {
    return "emerging";
  }
  if (score < 70) {
    return "basic";
  }
  if (score < 85) {
    return "intermediate";
  }
  return "mastery";
};

const levelLabel = (level: AssessmentLevel): string => {
  if (level === "emerging") {
    return "Emerging";
  }
  if (level === "basic") {
    return "Basic";
  }
  if (level === "intermediate") {
    return "Intermediate";
  }
  if (level === "mastery") {
    return "Mastery";
  }
  return "Not Assessed";
};

const levelStyles = (level: AssessmentLevel): { backgroundColor: string; color: string } => {
  if (level === "emerging") {
    return { backgroundColor: "#FDE8EC", color: "#D32F45" };
  }
  if (level === "basic") {
    return { backgroundColor: "#DDF4E6", color: "#1FA54A" };
  }
  if (level === "intermediate") {
    return { backgroundColor: "#E6EEFF", color: "#3855B3" };
  }
  if (level === "mastery") {
    return { backgroundColor: "#D8F5E2", color: "#027A48" };
  }
  return { backgroundColor: "#ECEEF5", color: "#6A6C7D" };
};

const formatRelativeDate = (value: string | null): string => {
  if (!value) {
    return "No assessment yet";
  }

  const now = Date.now();
  const assessedAt = new Date(value).getTime();
  if (Number.isNaN(assessedAt) || assessedAt > now) {
    return "No assessment yet";
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.max(1, Math.floor((now - assessedAt) / dayMs));
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(diffDays / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
};

const includesToken = (value: string, tokens: string[]): boolean =>
  tokens.some((token) => value.includes(token));

const filterTimelineByDomain = (
  timeline: AssessmentTimelineItem[],
  domain: "literacy" | "numeracy"
): AssessmentTimelineItem[] => {
  const tokens =
    domain === "literacy"
      ? ["literacy", "reading", "phonics", "fluency", "vocabulary", "comprehension"]
      : ["numeracy", "number", "counting", "operations", "addition", "subtraction", "multiplication"];

  return timeline.filter((item) => {
    const source = `${item.domain ?? ""} ${item.assessmentName}`.toLowerCase();
    return includesToken(source, tokens);
  });
};

const buildAssessmentSummary = (
  timeline: AssessmentTimelineItem[],
  domain: "literacy" | "numeracy",
  title: string
): AssessmentSummary => {
  const domainTimeline = filterTimelineByDomain(timeline, domain);
  if (domainTimeline.length === 0) {
    return {
      title,
      assessedAt: null,
      score: null,
      level: "not_assessed",
      label: "Overall: Not Assessed"
    };
  }

  const latest = [...domainTimeline].sort(
    (left, right) => new Date(right.assessedAt).getTime() - new Date(left.assessedAt).getTime()
  )[0];

  const level = levelFromScore(latest?.score ?? null);
  return {
    title,
    assessedAt: latest?.assessedAt ?? null,
    score: latest?.score ?? null,
    level,
    label: `Overall: ${levelLabel(level)}`
  };
};

export const AssessmentDetailPage = (): JSX.Element => {
  const params = useParams();
  const learnerId = params.learnerId ?? "";
  const profileQuery = useLearnerProfileQuery(learnerId);
  const classesQuery = useClassesQuery();
  const borderColor = "var(--mantine-color-bridgeed-2)";

  const profile = profileQuery.data;
  const learnerClass = classesQuery.data?.find((classItem) => classItem.classId === profile?.learner.classId);
  const learnerClassName = learnerClass?.name ?? profile?.learner.gradeLevel ?? "Class";

  const literacySummary = buildAssessmentSummary(
    profile?.assessmentTimeline ?? [],
    "literacy",
    "Literacy Assessment"
  );
  const numeracySummary = buildAssessmentSummary(
    profile?.assessmentTimeline ?? [],
    "numeracy",
    "Numeracy Assessment"
  );

  return (
    <DashboardLayout role={Role.Teacher}>
      <Box className="max-w-[393px] mx-auto px-4 pt-4 pb-8 lg:pt-8">
        <Paper bg="green.6" p={16} radius="xl">
          <Stack gap={6}>
            <Group align="center" gap={8} wrap="nowrap">
              <ActionIcon
                aria-label="Go back to assessments"
                color="green"
                component={Link}
                radius="xl"
                size={32}
                style={{ color: "white" }}
                to="/assessments"
                variant="subtle"
              >
                <IconBack className="w-5 h-5" />
              </ActionIcon>
              <Stack gap={0}>
                <Text c="white" fw={700} fz={34} lh="1">
                  {profile?.learner.name ?? "Learner"}
                </Text>
                <Text c="green.1" fw={600} fz={14}>
                  {learnerClassName} • Student Assessment
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>

        {profileQuery.isLoading && (
          <Group justify="center" py={20}>
            <Loader size="sm" />
          </Group>
        )}

        {profileQuery.isError && (
          <Card p={16} radius="md" mt={16} withBorder>
            <Text c="red" fz={14}>
              {profileQuery.error?.message ?? "Unable to load learner assessment detail."}
            </Text>
          </Card>
        )}

        {profile && (
          <Stack gap={18} mt={16}>
            <Title c="#121421" order={2} size="h2">
              Select Assessment Area
            </Title>

            <Stack gap={14}>
              <Card p={20} radius="md" style={{ borderColor }} withBorder>
                <Group align="center" gap={14} wrap="nowrap">
                  <ThemeIcon color="green" radius="xl" size={56} variant="light">
                    <IconBook className="w-7 h-7" />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text c="#121421" fw={700} fz={18} lh="26px">
                      Foundational Literacy
                    </Text>
                    <Text c="#6A6C7D" fz={14} fw={600}>
                      Assess reading, comprehension & vocabulary
                    </Text>
                  </Stack>
                </Group>
              </Card>

              <Card p={20} radius="md" style={{ borderColor }} withBorder>
                <Group align="center" gap={14} wrap="nowrap">
                  <ThemeIcon color="green" radius="xl" size={56} variant="light">
                    <IconCalculator className="w-7 h-7" />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text c="#121421" fw={700} fz={18} lh="26px">
                      Foundational Numeracy
                    </Text>
                    <Text c="#6A6C7D" fz={14} fw={600}>
                      Assess counting, operations & problem-solving
                    </Text>
                  </Stack>
                </Group>
              </Card>
            </Stack>

            <Title c="#121421" mt={8} order={2} size="h2">
              Previous Assessments
            </Title>

            <Card p={0} radius="md" style={{ borderColor }} withBorder>
              {[literacySummary, numeracySummary].map((summary, index) => {
                const levelStyle = levelStyles(summary.level);
                return (
                  <Box
                    key={summary.title}
                    px={16}
                    py={14}
                    style={{
                      borderTop: index === 0 ? "none" : `1px solid var(--mantine-color-bridgeed-2)`
                    }}
                  >
                    <Group justify="space-between" mb={8}>
                      <Text c="#121421" fz={16} fw={600}>
                        {summary.title}
                      </Text>
                      <Text c="#6A6C7D" fz={14}>
                        {formatRelativeDate(summary.assessedAt)}
                      </Text>
                    </Group>
                    <Text
                      component="span"
                      fz={14}
                      fw={500}
                      px={10}
                      py={4}
                      style={{
                        backgroundColor: levelStyle.backgroundColor,
                        color: levelStyle.color,
                        borderRadius: 6
                      }}
                    >
                      {summary.label}
                    </Text>
                  </Box>
                );
              })}
            </Card>
          </Stack>
        )}
      </Box>
    </DashboardLayout>
  );
};
