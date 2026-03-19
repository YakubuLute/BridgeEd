import { useState } from "react";
import { Modal, Button, TextInput, Select, Stack, Group } from "@mantine/core";
import { GradeLevel } from "@bridgeed/shared";
import { useCreateLearnerMutation } from "../../../api/hooks/useLearnerQueries";

type AddLearnerModalProps = {
  opened: boolean;
  onClose: () => void;
  classId: string;
};

export const AddLearnerModal = ({ opened, onClose, classId }: AddLearnerModalProps) => {
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | "">("");
  const [error, setError] = useState<string | null>(null);

  const createLearnerMutation = useCreateLearnerMutation(classId, {
    onSuccess: () => {
      handleClose();
    }
  });

  const handleClose = () => {
    setName("");
    setGradeLevel("");
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

    createLearnerMutation.mutate({
      classId,
      name: name.trim(),
      gradeLevel: gradeLevel as GradeLevel
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<span className="font-black text-xl text-[#1e293b]">Add New Learner</span>}
      centered
      radius="lg"
      padding="xl"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Learner Full Name"
            placeholder="e.g. John Doe"
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

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" color="gray" onClick={handleClose} fw={700}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#ea580c"
              className="hover:bg-[#c2410c] px-8"
              loading={createLearnerMutation.isPending}
              fw={700}
            >
              Add Learner
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
