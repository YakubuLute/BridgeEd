import { Card, Grid, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { Role, type SkillTrendPoint } from "@bridgeed/shared";
import { Link, useParams } from "react-router-dom";

import { useLearnerProfileQuery } from "../../../api/hooks/useLearnerQueries";
import { DashboardLayout } from "../components/DashboardLayout";

type SimpleLineChartProps = {
  points: SkillTrendPoint[];
};

const formatDateLabel = (value: string): string =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

const SimpleLineChart = ({ points }: SimpleLineChartProps): JSX.Element => {
  const width = 640;
  const height = 200;
  const padding = 28;

  if (points.length === 0) {
    return (
      <Text c="#6A6C7D" fz={13}>
        No mastery trend data available for this skill yet.
      </Text>
    );
  }

  const sorted = [...points].sort(
    (left, right) => new Date(left.measuredAt).getTime() - new Date(right.measuredAt).getTime()
  );

  const maxScore = 100;
  const minScore = 0;
  const xStep = sorted.length > 1 ? (width - padding * 2) / (sorted.length - 1) : 0;

  const pathPoints = sorted.map((point, index) => {
    const x = padding + index * xStep;
    const normalized = (point.masteryScore - minScore) / (maxScore - minScore || 1);
    const y = height - padding - normalized * (height - padding * 2);
    return { x, y };
  });

  const polylinePoints = pathPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <Stack gap={6}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        <line stroke="#D5D6DD" x1={padding} x2={padding} y1={padding} y2={height - padding} />
        <line
          stroke="#D5D6DD"
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
        />
        <polyline
          fill="none"
          points={polylinePoints}
          stroke="#292B37"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
        {pathPoints.map((point, index) => (
          <circle cx={point.x} cy={point.y} fill="#292B37" key={index} r={4} />
        ))}
      </svg>

      <Group gap={12}>
        {sorted.map((point) => (
          <Text c="#6A6C7D" fz={12} key={point.measuredAt}>
            {formatDateLabel(point.measuredAt)}: {Math.round(point.masteryScore)}%
          </Text>
        ))}
      </Group>
    </Stack>
  );
};

export const LearnerProfilePage = (): JSX.Element => {
  const params = useParams();
  const learnerId = params.learnerId ?? "";
  const profileQuery = useLearnerProfileQuery(learnerId);

  const profile = profileQuery.data;

  return (
    <DashboardLayout role={Role.Teacher}>
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {profileQuery.isLoading && (
            <Group justify="center" py={24}>
              <Loader size="sm" />
            </Group>
          )}

          {profileQuery.isError && (
            <Card p={16} radius={12} withBorder>
              <Text c="red" fz={14}>
                {profileQuery.error?.message ?? "Unable to load learner profile."}
              </Text>
            </Card>
          )}

          {profile && (
            <Stack gap={16}>
              <div>
                <Title c="#121421" order={1} size="h1">
                  {profile.learner.name}
                </Title>
                <Text c="#6A6C7D" fz={14}>
                  Learner ID: {profile.learner.learnerId} • Grade: {profile.learner.gradeLevel}
                </Text>
              </div>

              <Grid gutter={16}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card p={16} radius={12} withBorder>
                    <Stack gap={10}>
                      <Text c="#121421" fw={700} fz={17}>
                        Assessment Timeline
                      </Text>

                      {profile.assessmentTimeline.length === 0 && (
                        <Text c="#6A6C7D" fz={14}>
                          No assessments have been recorded yet.
                        </Text>
                      )}

                      {profile.assessmentTimeline.map((item) => (
                        <Card key={item.attemptId} p={12} radius={10} withBorder>
                          <Text c="#121421" fw={600} fz={14}>
                            {item.assessmentName}
                          </Text>
                          <Text c="#6A6C7D" fz={13}>
                            {item.domain ?? "General"} • {formatDateLabel(item.assessedAt)}
                          </Text>
                          <Text c="#121421" fz={13}>
                            Score: {item.score === null ? "N/A" : `${Math.round(item.score)}%`}
                          </Text>
                        </Card>
                      ))}
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card p={16} radius={12} withBorder>
                    <Stack gap={10}>
                      <Text c="#121421" fw={700} fz={17}>
                        Mastery Trends by Skill
                      </Text>

                      {profile.masteryTrends.length === 0 && (
                        <Text c="#6A6C7D" fz={14}>
                          No skill mastery data available yet. Run an assessment to populate trends.
                        </Text>
                      )}

                      {profile.masteryTrends.map((trend) => (
                        <Card key={trend.skillCode} p={12} radius={10} withBorder>
                          <Text c="#121421" fw={600} fz={14} mb={8}>
                            {trend.skillName}
                          </Text>
                          <SimpleLineChart points={trend.points} />
                        </Card>
                      ))}
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              <Group>
                <Text c="#6A6C7D" fz={14}>
                  Need to add more learners?
                </Text>
                <Text component={Link} fz={14} fw={700} to={`/classes/${profile.learner.classId}`}>
                  Return to class learners
                </Text>
              </Group>
            </Stack>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
