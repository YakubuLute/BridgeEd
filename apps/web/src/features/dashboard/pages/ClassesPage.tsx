import { useMemo, useState } from "react";
import { Button, Card, Grid, Group, Loader, Modal, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { GradeLevel, Role, type ClassRecord } from "@bridgeed/shared";
import { Link } from "react-router-dom";

import { useClassesQuery, useCreateClassMutation, useUpdateClassMutation } from "../../../api/hooks/useClassQueries";
import { DashboardLayout } from "../components/DashboardLayout";

const gradeLevelOptions = Object.values(GradeLevel).map((gradeLevel) => ({
  value: gradeLevel,
  label: gradeLevel
}));

type ClassFormState = {
  name: string;
  gradeLevel: GradeLevel;
  subject: string;
  academicYear: string;
};

const defaultClassFormState: ClassFormState = {
  name: "",
  gradeLevel: GradeLevel.JHS1,
  subject: "",
  academicYear: ""
};

const toUpdatePayload = (values: ClassFormState) => ({
  name: values.name.trim(),
  gradeLevel: values.gradeLevel,
  subject: values.subject.trim() || undefined,
  academicYear: values.academicYear.trim() || undefined
});

export const ClassesPage = (): JSX.Element => {
  const classesQuery = useClassesQuery();
  const [classForm, setClassForm] = useState<ClassFormState>(defaultClassFormState);
  const [formError, setFormError] = useState<string>("");
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null);
  const [editForm, setEditForm] = useState<ClassFormState>(defaultClassFormState);

  const createClassMutation = useCreateClassMutation({
    onSuccess: () => {
      setClassForm(defaultClassFormState);
      setFormError("");
    },
    onError: (error) => {
      setFormError(error.message);
    }
  });

  const updateClassMutation = useUpdateClassMutation({
    onSuccess: () => {
      setEditingClass(null);
    }
  });

  const isCreateDisabled = classForm.name.trim().length === 0 || createClassMutation.isPending;

  const sortedClasses = useMemo(() => {
    const sourceClasses = classesQuery.data ?? [];
    return [...sourceClasses].sort((a, b) => a.name.localeCompare(b.name));
  }, [classesQuery.data]);

  const handleCreateClass = (): void => {
    if (classForm.name.trim().length === 0) {
      setFormError("Class name is required.");
      return;
    }

    setFormError("");
    createClassMutation.mutate(toUpdatePayload(classForm));
  };

  const openEditModal = (classItem: ClassRecord): void => {
    setEditingClass(classItem);
    setEditForm({
      name: classItem.name,
      gradeLevel: classItem.gradeLevel,
      subject: classItem.subject ?? "",
      academicYear: classItem.academicYear ?? ""
    });
  };

  const handleUpdateClass = (): void => {
    if (!editingClass) {
      return;
    }

    if (editForm.name.trim().length === 0) {
      return;
    }

    updateClassMutation.mutate({
      classId: editingClass.classId,
      payload: toUpdatePayload(editForm)
    });
  };

  return (
    <DashboardLayout role={Role.Teacher}>
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Stack gap={4} mb={20}>
            <Title c="#121421" order={1} size="h1">
              Classes
            </Title>
            <Text c="#6A6C7D" fz={14}>
              Create and manage your classes by grade level.
            </Text>
          </Stack>

          <Grid gutter={16}>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card p={18} radius={12} withBorder>
                <Stack gap={10}>
                  <Text c="#121421" fw={700} fz={18}>
                    Create Class
                  </Text>
                  <TextInput
                    label="Class name"
                    onChange={(event) =>
                      setClassForm((current) => ({
                        ...current,
                        name: event.currentTarget.value
                      }))
                    }
                    placeholder="JHS 1A"
                    required
                    value={classForm.name}
                  />
                  <Select
                    data={gradeLevelOptions}
                    label="Grade level"
                    onChange={(value) =>
                      setClassForm((current) => ({
                        ...current,
                        gradeLevel: (value as GradeLevel | null) ?? GradeLevel.JHS1
                      }))
                    }
                    required
                    value={classForm.gradeLevel}
                  />
                  <TextInput
                    label="Subject (optional)"
                    onChange={(event) =>
                      setClassForm((current) => ({
                        ...current,
                        subject: event.currentTarget.value
                      }))
                    }
                    placeholder="Mathematics"
                    value={classForm.subject}
                  />
                  <TextInput
                    label="Academic year (optional)"
                    onChange={(event) =>
                      setClassForm((current) => ({
                        ...current,
                        academicYear: event.currentTarget.value
                      }))
                    }
                    placeholder="2025/2026"
                    value={classForm.academicYear}
                  />
                  {formError && (
                    <Text c="red" fz={13}>
                      {formError}
                    </Text>
                  )}
                  <Button disabled={isCreateDisabled} onClick={handleCreateClass}>
                    {createClassMutation.isPending ? "Creating..." : "Create Class"}
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card p={18} radius={12} withBorder>
                <Stack gap={12}>
                  <Group justify="space-between">
                    <Text c="#121421" fw={800} fz={18}>
                      My Classes
                    </Text>
                    <Text c="#6A6C7D" fz={13}>
                      {sortedClasses.length} total
                    </Text>
                  </Group>

                  {classesQuery.isLoading && <Loader size="sm" />}
                  {classesQuery.isError && (
                    <Text c="red" fz={14}>
                      {classesQuery.error?.message ?? "Unable to load classes."}
                    </Text>
                  )}

                  {!classesQuery.isLoading && sortedClasses.length === 0 && (
                    <Text c="#6A6C7D" fz={14}>
                      No classes created yet.
                    </Text>
                  )}

                  {sortedClasses.map((classItem) => (
                    <Card key={classItem.classId} p={14} radius={10} withBorder>
                      <Group justify="space-between" align="flex-start">
                        <div>
                          <Text c="#121421" fw={600} fz={15}>
                            {classItem.name}
                          </Text>
                          <Text c="#6A6C7D" fz={13}>
                            {classItem.gradeLevel}
                            {classItem.subject ? ` • ${classItem.subject}` : ""}
                          </Text>
                        </div>

                        <Group gap={8}>
                          <Button
                            component={Link}
                            size="xs"
                            to={`/classes/${classItem.classId}`}
                            variant="light"
                          >
                            Open
                          </Button>
                          <Button onClick={() => openEditModal(classItem)} size="xs" variant="outline">
                            Edit
                          </Button>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </div>
      </div>

      <Modal
        centered
        onClose={() => setEditingClass(null)}
        opened={Boolean(editingClass)}
        title="Edit Class"
      >
        <Stack gap={10}>
          <TextInput
            label="Class name"
            onChange={(event) =>
              setEditForm((current) => ({
                ...current,
                name: event.currentTarget.value
              }))
            }
            value={editForm.name}
          />
          <Select
            data={gradeLevelOptions}
            label="Grade level"
            onChange={(value) =>
              setEditForm((current) => ({
                ...current,
                gradeLevel: (value as GradeLevel | null) ?? GradeLevel.JHS1
              }))
            }
            value={editForm.gradeLevel}
          />
          <TextInput
            label="Subject (optional)"
            onChange={(event) =>
              setEditForm((current) => ({
                ...current,
                subject: event.currentTarget.value
              }))
            }
            value={editForm.subject}
          />
          <TextInput
            label="Academic year (optional)"
            onChange={(event) =>
              setEditForm((current) => ({
                ...current,
                academicYear: event.currentTarget.value
              }))
            }
            value={editForm.academicYear}
          />
          <Button disabled={updateClassMutation.isPending} onClick={handleUpdateClass}>
            {updateClassMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Modal>
    </DashboardLayout>
  );
};
