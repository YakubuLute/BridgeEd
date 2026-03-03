import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { Role, type AssessmentTimelineItem, type SkillMasteryTrend } from "@bridgeed/shared";
import { useNavigate, useParams } from "react-router-dom";

import { useClassesQuery } from "../../../api/hooks/useClassQueries";
import { useLearnerProfileQuery } from "../../../api/hooks/useLearnerQueries";
import { DashboardLayout } from "../components/DashboardLayout";

type IconProps = {
  className?: string;
};

type AssessmentArea = "literacy" | "numeracy";
type AssessmentStep = "select" | "assess";
type SkillLevel = "mastery" | "intermediate" | "basic" | "emerging";
type AssessmentLevel = SkillLevel | "not_assessed";

type SkillItem = {
  assessed: boolean;
  id: string;
  level: SkillLevel;
  name: string;
};

type SkillsData = {
  literacy: SkillItem[];
  numeracy: SkillItem[];
};

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

const toSkillLevelFromScore = (score: number): SkillLevel => {
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

const levelFromScore = (score: number | null): AssessmentLevel => {
  if (score === null) {
    return "not_assessed";
  }
  return toSkillLevelFromScore(score);
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

const levelBadgeStyles = (level: AssessmentLevel): { backgroundColor: string; color: string } => {
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

const skillButtonStyles = (level: SkillLevel, active: boolean): CSSProperties => {
  if (!active) {
    return {
      backgroundColor: "white",
      border: "2px solid var(--mantine-color-bridgeed-2)",
      color: "#121421"
    };
  }

  if (level === "mastery") {
    return {
      backgroundColor: "#1FA54A",
      border: "2px solid #1FA54A",
      color: "white"
    };
  }

  if (level === "intermediate") {
    return {
      backgroundColor: "#E6EEFF",
      border: "2px solid #3855B3",
      color: "#1E3A8A"
    };
  }

  if (level === "basic") {
    return {
      backgroundColor: "#DDF4E6",
      border: "2px solid #1FA54A",
      color: "#1FA54A"
    };
  }

  return {
    backgroundColor: "#FDE8EC",
    border: "2px solid #D32F45",
    color: "#D32F45"
  };
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
  domain: AssessmentArea
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
  domain: AssessmentArea,
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

const findLatestTrendScore = (trends: SkillMasteryTrend[], tokens: string[]): number | null => {
  let latestMeasuredAt = Number.NEGATIVE_INFINITY;
  let latestScore: number | null = null;

  for (const trend of trends) {
    const source = `${trend.skillCode} ${trend.skillName}`.toLowerCase();
    if (!includesToken(source, tokens)) {
      continue;
    }

    for (const point of trend.points) {
      const measuredAt = new Date(point.measuredAt).getTime();
      if (Number.isNaN(measuredAt)) {
        continue;
      }

      if (measuredAt > latestMeasuredAt) {
        latestMeasuredAt = measuredAt;
        latestScore = point.masteryScore;
      }
    }
  }

  return latestScore;
};

const buildInitialSkillsData = (trends: SkillMasteryTrend[]): SkillsData => {
  const literacyDefaults: Array<{ defaultLevel: SkillLevel; id: string; name: string; tokens: string[] }> = [
    {
      id: "phonics",
      name: "Phonics & Decoding",
      defaultLevel: "basic",
      tokens: ["phonics", "decoding"]
    },
    {
      id: "fluency",
      name: "Reading Fluency",
      defaultLevel: "intermediate",
      tokens: ["fluency", "reading_fluency", "reading fluency"]
    },
    {
      id: "comprehension",
      name: "Comprehension",
      defaultLevel: "basic",
      tokens: ["comprehension"]
    },
    {
      id: "vocabulary",
      name: "Vocabulary",
      defaultLevel: "emerging",
      tokens: ["vocabulary"]
    }
  ];

  const numeracyDefaults: Array<{ defaultLevel: SkillLevel; id: string; name: string; tokens: string[] }> = [
    {
      id: "counting",
      name: "Counting & Number Sense",
      defaultLevel: "intermediate",
      tokens: ["counting", "number_sense", "number sense"]
    },
    {
      id: "addition",
      name: "Addition & Subtraction",
      defaultLevel: "basic",
      tokens: ["addition", "subtraction", "operations"]
    },
    {
      id: "multiplication",
      name: "Multiplication",
      defaultLevel: "emerging",
      tokens: ["multiplication"]
    },
    {
      id: "fractions",
      name: "Fractions",
      defaultLevel: "emerging",
      tokens: ["fractions"]
    }
  ];

  return {
    literacy: literacyDefaults.map((skill) => {
      const score = findLatestTrendScore(trends, skill.tokens);
      return {
        id: skill.id,
        name: skill.name,
        level: score === null ? skill.defaultLevel : toSkillLevelFromScore(score),
        assessed: score !== null
      };
    }),
    numeracy: numeracyDefaults.map((skill) => {
      const score = findLatestTrendScore(trends, skill.tokens);
      return {
        id: skill.id,
        name: skill.name,
        level: score === null ? skill.defaultLevel : toSkillLevelFromScore(score),
        assessed: score !== null
      };
    })
  };
};

export const AssessmentDetailPage = (): JSX.Element => {
  const params = useParams();
  const learnerId = params.learnerId ?? "";
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState<AssessmentArea | null>(null);
  const [assessmentStep, setAssessmentStep] = useState<AssessmentStep>("select");
  const [skillsData, setSkillsData] = useState<SkillsData>({
    literacy: [],
    numeracy: []
  });

  const profileQuery = useLearnerProfileQuery(learnerId);
  const classesQuery = useClassesQuery();
  const borderColor = "var(--mantine-color-bridgeed-2)";
  const profile = profileQuery.data;

  useEffect(() => {
    if (!profile) {
      return;
    }

    setSkillsData(buildInitialSkillsData(profile.masteryTrends));
  }, [profile]);

  const learnerClass = classesQuery.data?.find((classItem) => classItem.classId === profile?.learner.classId);
  const learnerClassName = learnerClass?.name ?? profile?.learner.gradeLevel ?? "Class";

  const literacySummary = useMemo(
    () => buildAssessmentSummary(profile?.assessmentTimeline ?? [], "literacy", "Literacy Assessment"),
    [profile?.assessmentTimeline]
  );
  const numeracySummary = useMemo(
    () => buildAssessmentSummary(profile?.assessmentTimeline ?? [], "numeracy", "Numeracy Assessment"),
    [profile?.assessmentTimeline]
  );

  const handleAreaSelect = (area: AssessmentArea): void => {
    setSelectedArea(area);
    setAssessmentStep("assess");
  };

  const handleSkillAssess = (skillId: string, level: SkillLevel): void => {
    if (!selectedArea) {
      return;
    }

    setSkillsData((current) => ({
      ...current,
      [selectedArea]: current[selectedArea].map((skill) =>
        skill.id === skillId ? { ...skill, level, assessed: true } : skill
      )
    }));
  };

  const handleGenerateReport = (): void => {
    navigate(`/learners/${learnerId}/profile`);
  };

  return (
    <DashboardLayout role={Role.Teacher}>
      <Box className="max-w-[393px] mx-auto px-4 pt-4 pb-28 lg:pt-8">
        <Paper bg="green.6" p={16} radius="xl">
          <Stack gap={6}>
            <Group align="center" gap={8} wrap="nowrap">
              <ActionIcon
                aria-label="Go back"
                color="green"
                onClick={() => {
                  if (assessmentStep === "select") {
                    navigate("/assessments");
                    return;
                  }
                  setAssessmentStep("select");
                  setSelectedArea(null);
                }}
                radius="xl"
                size={32}
                style={{ color: "white" }}
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

        {profile && assessmentStep === "select" && (
          <Stack gap={18} mt={16}>
            <Title c="#121421" order={2} size="h2">
              Select Assessment Area
            </Title>

            <Stack gap={14}>
              <Card
                component="button"
                onClick={() => handleAreaSelect("literacy")}
                p={20}
                radius="md"
                style={{ borderColor, textAlign: "left", width: "100%" }}
                type="button"
                withBorder
              >
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

              <Card
                component="button"
                onClick={() => handleAreaSelect("numeracy")}
                p={20}
                radius="md"
                style={{ borderColor, textAlign: "left", width: "100%" }}
                type="button"
                withBorder
              >
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
                const levelStyle = levelBadgeStyles(summary.level);
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

        {profile && assessmentStep === "assess" && selectedArea && (
          <Stack gap={18} mt={16}>
            <Stack gap={4}>
              <Title c="#121421" order={2} size="h2">
                {selectedArea === "literacy" ? "Literacy" : "Numeracy"} Skills Assessment
              </Title>
              <Text c="#6A6C7D" fz={14}>
                Tap each skill to assess the learner&apos;s level.
              </Text>
            </Stack>

            <Stack gap={14}>
              {skillsData[selectedArea].map((skill) => (
                <Card key={skill.id} p={16} radius="md" style={{ borderColor }} withBorder>
                  <Text c="#121421" fw={700} fz={16} mb={12}>
                    {skill.name}
                  </Text>

                  <SimpleGrid cols={2} spacing={8}>
                    {(["mastery", "intermediate", "basic", "emerging"] as SkillLevel[]).map((level) => (
                      <Button
                        key={`${skill.id}-${level}`}
                        onClick={() => handleSkillAssess(skill.id, level)}
                        style={skillButtonStyles(level, skill.level === level)}
                        variant="filled"
                      >
                        {levelLabel(level)}
                      </Button>
                    ))}
                  </SimpleGrid>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}
      </Box>

      {profile && assessmentStep === "assess" && selectedArea && (
        <Box
          className="fixed bottom-0 left-0 right-0 p-4"
          style={{
            backgroundColor: "white",
            borderTop: "1px solid var(--mantine-color-bridgeed-2)"
          }}
        >
          <Box className="max-w-[393px] mx-auto">
            <Button color="green" fullWidth onClick={handleGenerateReport} size="lg">
              Generate Remediation Plan
            </Button>
          </Box>
        </Box>
      )}
    </DashboardLayout>
  );
};
