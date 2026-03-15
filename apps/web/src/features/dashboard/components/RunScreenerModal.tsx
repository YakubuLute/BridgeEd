import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Select, Stack, Group, Text, Loader, Center, Paper, Radio } from "@mantine/core";
import { useClassesQuery } from "../../../api/hooks/useClassQueries";
import { useGenerateScreenerMutation, useCreateAssessmentMutation } from "../../../api/hooks/useAssessmentQueries";

type RunScreenerModalProps = {
  opened: boolean;
  onClose: () => void;
  defaultClassId?: string | null;
};

export const RunScreenerModal = ({ opened, onClose, defaultClassId }: RunScreenerModalProps): JSX.Element => {
  const navigate = useNavigate();
  const { data: classes, isLoading: classesLoading } = useClassesQuery();
  const generateScreenerMutation = useGenerateScreenerMutation();
  const createAssessmentMutation = useCreateAssessmentMutation({
    onSuccess: (data) => {
      resetAndClose();
      navigate(`/assessments/${data.assessmentId}/administer`);
    }
  });
  
  const [classId, setClassId] = useState<string | null>(defaultClassId || null);
  const [subject, setSubject] = useState<string>("Foundational Literacy");
  
  const selectedClass = classes?.find((c) => c.classId === classId);
  
  const handleGenerate = () => {
    if (!classId || !selectedClass) return;
    
    generateScreenerMutation.mutate({
      classId,
      subject,
      gradeLevel: selectedClass.gradeLevel,
    });
  };

  const handleSaveAndAdminister = () => {
    if (!classId || !selectedClass || !generateScreenerMutation.data) return;

    createAssessmentMutation.mutate({
      classId,
      subject,
      gradeLevel: selectedClass.gradeLevel,
      title: generateScreenerMutation.data.title,
      description: generateScreenerMutation.data.description,
      questions: generateScreenerMutation.data.questions,
    });
  };

  const resetAndClose = () => {
    generateScreenerMutation.reset();
    createAssessmentMutation.reset();
    onClose();
  };

  if (classesLoading) {
    return (
      <Modal opened={opened} onClose={resetAndClose} title="Run New Screener" radius="md">
        <Center py="xl"><Loader color="orange" /></Center>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={resetAndClose}
      title={<Text fw={900} fz="lg" c="#1e293b">AI Diagnostic Generator</Text>}
      radius="xl"
      size={generateScreenerMutation.isSuccess ? "xl" : "md"}
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      {!generateScreenerMutation.isSuccess ? (
        <Stack gap="xl" mt="sm">
          <Text c="#64748b" fz="sm">
            Select a class and subject to instantly generate a targeted 5-question rapid screener using Gemini AI.
          </Text>

          <Select
            label="Select Class"
            placeholder="Choose class"
            data={classes?.map((c) => ({ value: c.classId, label: c.name })) || []}
            value={classId}
            onChange={setClassId}
            required
            styles={{ label: { fontWeight: 700, marginBottom: 8 } }}
          />

          <Radio.Group
            label="Select Domain Focus"
            value={subject}
            onChange={setSubject}
            required
            styles={{ label: { fontWeight: 700, marginBottom: 8 } }}
          >
            <Stack gap="sm" mt="xs">
              <Radio value="Foundational Literacy" label="Literacy (Phonics, Decoding, Comp.)" color="orange" />
              <Radio value="Core Numeracy" label="Numeracy (Operations, Place Value)" color="orange" />
            </Stack>
          </Radio.Group>

          <Button
            fullWidth
            size="lg"
            bg="#ea580c"
            className="hover:bg-[#c2410c] font-bold mt-4"
            loading={generateScreenerMutation.isPending}
            onClick={handleGenerate}
            disabled={!classId}
          >
            Generate Screener
          </Button>

          {generateScreenerMutation.isError && (
            <Text c="red" fz="sm" fw={600} ta="center">
              Failed to generate screener. Please try again.
            </Text>
          )}
        </Stack>
      ) : (
        <Stack gap="lg">
          <Paper p="md" bg="#fff7ed" className="border border-orange-200" radius="md">
            <Text fw={800} fz="xl" c="#ea580c" mb="xs">
              {generateScreenerMutation.data.title}
            </Text>
            <Text fz="sm" c="#c2410c" fw={600}>
              {generateScreenerMutation.data.description}
            </Text>
          </Paper>

          <Stack gap="md" mt="md">
            {generateScreenerMutation.data.questions.map((q, idx) => (
              <Paper key={idx} p="md" radius="md" className="border border-[#e2e8f0] bg-[#f8fafc]">
                <Group justify="space-between" align="flex-start" mb="sm">
                  <Text fw={800} c="#1e293b" style={{ flex: 1 }}>
                    {idx + 1}. {q.questionText}
                  </Text>
                  {q.skillTag && (
                    <Text fz="xs" fw={700} c="#94a3b8" bg="white" px="xs" py={2} className="border border-[#e2e8f0] rounded-md">
                      {q.skillTag}
                    </Text>
                  )}
                </Group>
                <Stack gap="xs" mt="md">
                  {q.options.map((opt, oIdx) => (
                    <Group key={oIdx} gap="sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${opt === q.correctAnswer ? "bg-green-100 text-green-700 border border-green-300" : "bg-white border border-[#cbd5e1] text-[#64748b]"}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <Text fz="sm" fw={opt === q.correctAnswer ? 700 : 500} c={opt === q.correctAnswer ? "green" : "#475569"}>
                        {opt}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" color="gray" onClick={resetAndClose} fw={700}>
              Discard
            </Button>
            <Button 
              bg="#ea580c" 
              className="hover:bg-[#c2410c]" 
              fw={700} 
              onClick={handleSaveAndAdminister}
              loading={createAssessmentMutation.isPending}
            >
              Save & Administer
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};