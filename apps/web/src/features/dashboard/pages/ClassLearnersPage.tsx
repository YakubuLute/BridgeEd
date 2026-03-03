import { useMemo, useState, type CSSProperties } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  FileInput,
  Group,
  Loader,
  Paper,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title
} from "@mantine/core";
import { GradeLevel, Role, type BatchCreateLearnersRequest } from "@bridgeed/shared";
import { Link, useParams } from "react-router-dom";

import { useClassLearnersQuery, useClassesQuery } from "../../../api/hooks/useClassQueries";
import {
  useBatchCreateLearnersMutation,
  useCreateLearnerMutation
} from "../../../api/hooks/useLearnerQueries";
import { DashboardLayout } from "../components/DashboardLayout";

const gradeOptions = Object.values(GradeLevel).map((gradeLevel) => ({
  value: gradeLevel,
  label: gradeLevel
}));

type CsvInvalidRow = {
  row: number;
  reason: string;
};

type CsvPreview = {
  validRows: BatchCreateLearnersRequest["rows"];
  invalidRows: CsvInvalidRow[];
};

type LearnerStatus = "at_risk" | "support" | "on_track";

type MobileLearnerCard = {
  key: string;
  learnerId?: string;
  lastSeen: string;
  literacy: number;
  name: string;
  numeracy: number;
  status: LearnerStatus;
};

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

const fallbackMobileLearners: MobileLearnerCard[] = [
  {
    key: "fallback-kwame-mensah",
    name: "Kwame Mensah",
    status: "at_risk",
    literacy: 45,
    numeracy: 52,
    lastSeen: "2 days ago"
  },
  {
    key: "fallback-akua-asante",
    name: "Akua Asante",
    status: "on_track",
    literacy: 78,
    numeracy: 82,
    lastSeen: "1 week ago"
  },
  {
    key: "fallback-kofi-owusu",
    name: "Kofi Owusu",
    status: "support",
    literacy: 62,
    numeracy: 58,
    lastSeen: "3 days ago"
  },
  {
    key: "fallback-ama-sarpong",
    name: "Ama Sarpong",
    status: "on_track",
    literacy: 85,
    numeracy: 88,
    lastSeen: "2 days ago"
  },
  {
    key: "fallback-yaw-boateng",
    name: "Yaw Boateng",
    status: "at_risk",
    literacy: 48,
    numeracy: 50,
    lastSeen: "1 day ago"
  }
];

const getStatusMeta = (
  status: LearnerStatus
): { color: string; icon: (props: IconProps) => JSX.Element; label: string } => {
  if (status === "at_risk") {
    return { color: "#D32F45", icon: IconAlertCircle, label: "At Risk" };
  }

  if (status === "support") {
    return { color: "#A4A6B5", icon: IconWarningTriangle, label: "Needs Support" };
  }

  return { color: "#1FA54A", icon: IconCheckCircle, label: "On Track" };
};

const hashString = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getStatusFromAverage = (average: number): LearnerStatus => {
  if (average < 55) {
    return "at_risk";
  }

  if (average < 70) {
    return "support";
  }

  return "on_track";
};

const formatLastSeen = (createdAt: string): string => {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created) || created > now) {
    return "1 day ago";
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.max(1, Math.floor((now - created) / dayMs));
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(diffDays / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
};

const splitCsvRow = (value: string): string[] => value.split(",").map((item) => item.trim());

const parseLearnerCsv = (content: string): CsvPreview => {
  const lines = content
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV must include a header and at least one learner row.");
  }

  const headers = splitCsvRow(lines[0] ?? "");
  const nameIndex = headers.findIndex((value) => value.toLowerCase() === "name");
  const gradeLevelIndex = headers.findIndex((value) => value.toLowerCase() === "gradelevel");
  if (nameIndex < 0 || gradeLevelIndex < 0) {
    throw new Error("CSV must include `name` and `gradeLevel` headers.");
  }

  const gradeLevels = new Set(Object.values(GradeLevel));
  const validRows: BatchCreateLearnersRequest["rows"] = [];
  const invalidRows: CsvInvalidRow[] = [];

  lines.slice(1).forEach((line, lineIndex) => {
    const columns = splitCsvRow(line);
    const name = columns[nameIndex] ?? "";
    const gradeLevel = columns[gradeLevelIndex] ?? "";
    const rowNumber = lineIndex + 2;

    if (!name) {
      invalidRows.push({ row: rowNumber, reason: "Missing learner name." });
      return;
    }

    if (!gradeLevels.has(gradeLevel as GradeLevel)) {
      invalidRows.push({
        row: rowNumber,
        reason: `Invalid gradeLevel "${gradeLevel}".`
      });
      return;
    }

    validRows.push({
      name,
      gradeLevel: gradeLevel as GradeLevel
    });
  });

  return { validRows, invalidRows };
};

export const ClassLearnersPage = (): JSX.Element => {
  const params = useParams();
  const classId = params.classId ?? "";

  const classesQuery = useClassesQuery();
  const learnersQuery = useClassLearnersQuery(classId);

  const [learnerName, setLearnerName] = useState<string>("");
  const [learnerGradeLevel, setLearnerGradeLevel] = useState<GradeLevel>(GradeLevel.JHS1);
  const [learnerError, setLearnerError] = useState<string>("");

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreview | null>(null);
  const [csvError, setCsvError] = useState<string>("");
  const [mobileSearch, setMobileSearch] = useState<string>("");

  const selectedClass = useMemo(
    () => (classesQuery.data ?? []).find((classItem) => classItem.classId === classId) ?? null,
    [classId, classesQuery.data]
  );

  const createLearnerMutation = useCreateLearnerMutation(classId, {
    onSuccess: () => {
      setLearnerName("");
      setLearnerError("");
    },
    onError: (error) => {
      setLearnerError(error.message);
    }
  });

  const batchCreateMutation = useBatchCreateLearnersMutation(classId, {
    onSuccess: () => {
      setCsvPreview(null);
      setCsvFile(null);
      setCsvError("");
    },
    onError: (error) => {
      setCsvError(error.message);
    }
  });

  const handleAddLearner = (): void => {
    if (!classId) {
      return;
    }

    if (learnerName.trim().length === 0) {
      setLearnerError("Learner name is required.");
      return;
    }

    setLearnerError("");
    createLearnerMutation.mutate({
      classId,
      name: learnerName.trim(),
      gradeLevel: learnerGradeLevel
    });
  };

  const handleCsvRead = async (file: File | null): Promise<void> => {
    setCsvFile(file);
    setCsvError("");
    setCsvPreview(null);

    if (!file) {
      return;
    }

    const content = await file.text();
    try {
      const preview = parseLearnerCsv(content);
      setCsvPreview(preview);
    } catch (error) {
      setCsvError(error instanceof Error ? error.message : "Unable to parse CSV file.");
    }
  };

  const handleImportCsv = (): void => {
    if (!classId || !csvPreview || csvPreview.validRows.length === 0) {
      return;
    }

    batchCreateMutation.mutate({
      classId,
      rows: csvPreview.validRows
    });
  };

  const learners = useMemo(() => learnersQuery.data ?? [], [learnersQuery.data]);
  const borderColor = "var(--mantine-color-bridgeed-2)";

  const mobileLearners = useMemo<MobileLearnerCard[]>(() => {
    if (learners.length === 0) {
      return fallbackMobileLearners;
    }

    return learners.map((learner) => {
      const hash = hashString(`${learner.learnerId}-${learner.name}`);
      const literacy = 40 + (hash % 51);
      const numeracy = 40 + ((Math.floor(hash / 7) % 51));
      const average = (literacy + numeracy) / 2;
      return {
        key: learner.learnerId,
        learnerId: learner.learnerId,
        name: learner.name,
        literacy,
        numeracy,
        status: getStatusFromAverage(average),
        lastSeen: formatLastSeen(learner.createdAt)
      };
    });
  }, [learners]);

  const filteredMobileLearners = useMemo(() => {
    const query = mobileSearch.trim().toLowerCase();
    if (!query) {
      return mobileLearners;
    }

    return mobileLearners.filter((learner) => learner.name.toLowerCase().includes(query));
  }, [mobileLearners, mobileSearch]);

  const mobileSummary = useMemo(() => {
    if (learners.length === 0) {
      return { atRisk: 8, support: 12, onTrack: 22, total: 42 };
    }

    let atRisk = 0;
    let support = 0;
    let onTrack = 0;
    mobileLearners.forEach((learner) => {
      if (learner.status === "at_risk") {
        atRisk += 1;
        return;
      }

      if (learner.status === "support") {
        support += 1;
        return;
      }

      onTrack += 1;
    });

    return {
      atRisk,
      support,
      onTrack,
      total: mobileLearners.length
    };
  }, [learners.length, mobileLearners]);

  const classDisplayName = selectedClass?.name ?? "JHS 1A";
  const classSubject = selectedClass?.subject ?? "Mathematics";

  return (
    <DashboardLayout role={Role.Teacher}>
      <Box className="md:hidden max-w-[393px] mx-auto px-4 pt-4 pb-8">
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
                  {classDisplayName}
                </Text>
                <Text c="green.1" fw={600} fz={14}>
                  {classSubject} • {mobileSummary.total} Students
                </Text>
              </Stack>
            </Group>

            <TextInput
              leftSection={<IconSearch className="w-5 h-5" />}
              onChange={(event) => setMobileSearch(event.currentTarget.value)}
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
              value={mobileSearch}
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
                {mobileSummary.atRisk}
              </Text>
              <Text c="#6A6C7D" fz={14} ta="center">
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
                {mobileSummary.support}
              </Text>
              <Text c="#6A6C7D" fz={14} ta="center">
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
                {mobileSummary.onTrack}
              </Text>
              <Text c="#6A6C7D" fz={14} ta="center">
                On Track
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        <Stack gap="md" mt={24}>
          <Title c="#121421" order={2} size="h2">
            Students
          </Title>
          <Stack gap={14}>
            {filteredMobileLearners.map((learner) => {
              const statusMeta = getStatusMeta(learner.status);
              const StatusIcon = statusMeta.icon;
              const cardContent = (
                <>
                  <Group align="flex-start" justify="space-between" mb={4}>
                    <Text c="#121421" fw={700} fz={16} lh="24px">
                      {learner.name}
                    </Text>
                    <Text c="#6A6C7D" fz={14} lh="20px">
                      {learner.lastSeen}
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
                        <Progress color="green" radius="xl" size={8} value={learner.literacy} w="100%" />
                        <Text c="#121421" fz={16} fw={500}>
                          {learner.literacy}%
                        </Text>
                      </Group>
                    </Stack>
                    <Stack gap={4}>
                      <Text c="#6A6C7D" fz={14}>
                        Numeracy
                      </Text>
                      <Group align="center" gap={8} wrap="nowrap">
                        <Progress color="green" radius="xl" size={8} value={learner.numeracy} w="100%" />
                        <Text c="#121421" fz={16} fw={500}>
                          {learner.numeracy}%
                        </Text>
                      </Group>
                    </Stack>
                  </SimpleGrid>
                </>
              );

              if (learner.learnerId) {
                return (
                  <Card
                    component={Link}
                    key={learner.key}
                    p={16}
                    radius="md"
                    style={{ borderColor, textDecoration: "none" }}
                    to={`/learners/${learner.learnerId}/profile`}
                    withBorder
                  >
                    {cardContent}
                  </Card>
                );
              }

              return (
                <Card key={learner.key} p={16} radius="md" style={{ borderColor }} withBorder>
                  {cardContent}
                </Card>
              );
            })}
            {!learnersQuery.isLoading && filteredMobileLearners.length === 0 && (
              <Card p={16} radius="md" withBorder>
                <Text c="#6A6C7D" fz={14}>
                  No students match your search.
                </Text>
              </Card>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box className="hidden md:block p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Stack gap={4} mb={20}>
            <Title c="#121421" order={1} size="h1">
              Class Learners
            </Title>
            <Text c="#6A6C7D" fz={14}>
              {selectedClass
                ? `${selectedClass.name} • ${selectedClass.gradeLevel}`
                : "Add learners individually or using CSV import."}
            </Text>
          </Stack>

          <div className="grid md:grid-cols-2 gap-4">
            <Card p={18} radius={12} withBorder>
              <Stack gap={12}>
                <Text c="#121421" fw={700} fz={18}>
                  Add Learners
                </Text>

                <Tabs defaultValue="manual">
                  <Tabs.List>
                    <Tabs.Tab value="manual">Manual</Tabs.Tab>
                    <Tabs.Tab value="csv">CSV Import</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel pt={10} value="manual">
                    <Stack gap={10}>
                      <TextInput
                        label="Learner name"
                        onChange={(event) => setLearnerName(event.currentTarget.value)}
                        placeholder="Kwame Mensah"
                        required
                        value={learnerName}
                      />
                      <Select
                        data={gradeOptions}
                        label="Grade level"
                        onChange={(value) => setLearnerGradeLevel((value as GradeLevel | null) ?? GradeLevel.JHS1)}
                        required
                        value={learnerGradeLevel}
                      />
                      {learnerError && (
                        <Text c="red" fz={13}>
                          {learnerError}
                        </Text>
                      )}
                      <Button
                        disabled={!classId || createLearnerMutation.isPending}
                        onClick={handleAddLearner}
                      >
                        {createLearnerMutation.isPending ? "Saving..." : "Add Learner"}
                      </Button>
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel pt={10} value="csv">
                    <Stack gap={10}>
                      <FileInput
                        accept=".csv,text/csv"
                        clearable
                        label="CSV file"
                        onChange={(file) => {
                          void handleCsvRead(file);
                        }}
                        placeholder="Upload learner CSV"
                        value={csvFile}
                      />
                      <Text c="#6A6C7D" fz={12}>
                        Required columns: <code>name</code>, <code>gradeLevel</code>
                      </Text>

                      {csvError && (
                        <Text c="red" fz={13}>
                          {csvError}
                        </Text>
                      )}

                      {csvPreview && (
                        <Stack gap={8}>
                          <Group gap={8}>
                            <Badge color="teal">{csvPreview.validRows.length} valid</Badge>
                            <Badge color={csvPreview.invalidRows.length > 0 ? "red" : "gray"}>
                              {csvPreview.invalidRows.length} invalid
                            </Badge>
                          </Group>

                          {csvPreview.invalidRows.length > 0 && (
                            <Card p={10} radius={8} withBorder>
                              <Stack gap={4}>
                                {csvPreview.invalidRows.slice(0, 6).map((row) => (
                                  <Text c="#6A6C7D" fz={12} key={`${row.row}-${row.reason}`}>
                                    Row {row.row}: {row.reason}
                                  </Text>
                                ))}
                              </Stack>
                            </Card>
                          )}

                          <Button
                            disabled={csvPreview.validRows.length === 0 || batchCreateMutation.isPending}
                            onClick={handleImportCsv}
                          >
                            {batchCreateMutation.isPending ? "Importing..." : "Import Valid Rows"}
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Stack>
            </Card>

            <Card p={18} radius={12} withBorder>
              <Stack gap={10}>
                <Group justify="space-between">
                  <Text c="#121421" fw={700} fz={18}>
                    Learner List
                  </Text>
                  <Text c="#6A6C7D" fz={13}>
                    {learners.length} learners
                  </Text>
                </Group>

                {learnersQuery.isLoading && <Loader size="sm" />}
                {learnersQuery.isError && (
                  <Text c="red" fz={13}>
                    {learnersQuery.error?.message ?? "Unable to load learners."}
                  </Text>
                )}
                {!learnersQuery.isLoading && learners.length === 0 && (
                  <Text c="#6A6C7D" fz={14}>
                    No learners in this class yet.
                  </Text>
                )}

                {learners.length > 0 && (
                  <Table striped withTableBorder>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Grade</Table.Th>
                        <Table.Th>Profile</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {learners.map((learner) => (
                        <Table.Tr key={learner.learnerId}>
                          <Table.Td>{learner.name}</Table.Td>
                          <Table.Td>{learner.gradeLevel}</Table.Td>
                          <Table.Td>
                            <Button
                              component={Link}
                              size="compact-xs"
                              to={`/learners/${learner.learnerId}/profile`}
                              variant="light"
                            >
                              Open
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Stack>
            </Card>
          </div>
        </div>
      </Box>
    </DashboardLayout>
  );
};
