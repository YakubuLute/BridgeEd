import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Group,
  Loader,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
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

  const learners = learnersQuery.data ?? [];

  return (
    <DashboardLayout role={Role.Teacher}>
      <div className="p-4 lg:p-8">
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

          <div className="grid lg:grid-cols-2 gap-4">
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
      </div>
    </DashboardLayout>
  );
};
