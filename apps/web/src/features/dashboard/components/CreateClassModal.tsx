import { Modal, Button, TextInput, Select, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GradeLevel } from "@bridgeed/shared";
import { useCreateClassMutation } from "../../../api/hooks/useClassQueries";

type CreateClassModalProps = {
  opened: boolean;
  onClose: () => void;
};

export const CreateClassModal = ({ opened, onClose }: CreateClassModalProps) => {
  const createClassMutation = useCreateClassMutation({
    onSuccess: () => {
      onClose();
      form.reset();
    }
  });

  const form = useForm({
    initialValues: {
      name: "",
      gradeLevel: "" as GradeLevel,
      subject: "",
      academicYear: new Date().getFullYear().toString()
    },
    validate: {
      name: (value: string) => (value.length < 2 ? "Name must have at least 2 characters" : null),
      gradeLevel: (value: GradeLevel | "") => (!value ? "Grade level is required" : null)
    }
  });

  const handleSubmit = (values: typeof form.values) => {
    createClassMutation.mutate(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<span className="font-black text-xl text-[#1e293b]">Create New Class</span>}
      centered
      radius="lg"
      padding="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Class Name"
            placeholder="e.g. JHS 1A, Grade 4 Blue"
            required
            {...form.getInputProps("name")}
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
            {...form.getInputProps("gradeLevel")}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <TextInput
            label="Subject (Optional)"
            placeholder="e.g. Mathematics, English"
            {...form.getInputProps("subject")}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <TextInput
            label="Academic Year"
            placeholder="e.g. 2026"
            {...form.getInputProps("academicYear")}
            styles={{
              input: { height: "50px", border: "2px solid #E2E8F0" },
              label: { fontWeight: 700, marginBottom: "4px", fontSize: "14px", color: "#64748b" }
            }}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" color="gray" onClick={onClose} fw={700}>
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
