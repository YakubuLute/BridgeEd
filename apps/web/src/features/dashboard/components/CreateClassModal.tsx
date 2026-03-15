import { useState } from "react";
import { Modal, Button, TextInput, Select, Stack, Group } from "@mantine/core";
import { GradeLevel } from "@bridgeed/shared";
import { useCreateClassMutation } from "../../../api/hooks/useClassQueries";

type CreateClassModalProps = {
  opened: boolean;
  onClose: () => void;
};

export const CreateClassModal = ({ opened, onClose }: CreateClassModalProps) => {
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | "">("");
  const [subject, setSubject] = useState("");
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState<string | null>(null);

  const createClassMutation = useCreateClassMutation({
    onSuccess: () => {
      handleClose();
    }
  });

  const handleClose = () => {
    setName("");
    setGradeLevel("");
    setSubject("");
    setAcademicYear(new Date().getFullYear().toString());
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.length < 2) {
      setError("Name must have at least 2 characters");
      return;
    }

    if (!gradeLevel) {
      setError("Grade level is required");
      return;
    }

    createClassMutation.mutate({
      name,
      gradeLevel: gradeLevel as GradeLevel,
      subject: subject || undefined,
      academicYear: academicYear || undefined
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<span className="font-black text-xl text-[#1e293b]">Create New Class</span>}
      centered
      radius="lg"
      padding="xl"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Class Name"
            placeholder="e.g. JHS 1A, Grade 4 Blue"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            error={error === "Name must have at least 2 characters"}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <Select
            label="Grade Level"
            placeholder="Select grade level"
            required
            data={Object.values(GradeLevel).map((v) => ({ value: v, label: v }))}
            value={gradeLevel}
            onChange={(value) => setGradeLevel(value as GradeLevel)}
            error={error === "Grade level is required"}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <TextInput
            label="Subject (Optional)"
            placeholder="e.g. Mathematics, English"
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <TextInput
            label="Academic Year"
            placeholder="e.g. 2026"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.currentTarget.value)}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" color="gray" onClick={handleClose} fw={700}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#ea580c"
              className="hover:bg-[#c2410c] px-8"
              loading={createClassMutation.isPending}
              fw={700}
            >
              Create Class
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
