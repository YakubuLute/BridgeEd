import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Title, 
  Text, 
  Stack, 
  Group, 
  Paper, 
  Button, 
  Loader, 
  Center, 
  ActionIcon, 
  Table,
  Checkbox,
  Badge,
  Box
} from "@mantine/core";
import { useClassLearnersQuery } from "../../../api/hooks/useClassQueries";
import { useAssessmentQuery, useSubmitResultsMutation } from "../../../api/hooks/useAssessmentQueries";

// --- Icons ---
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const AdministerAssessmentPage = (): JSX.Element => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const { data: assessment, isLoading: assessmentLoading } = useAssessmentQuery(assessmentId || "");
  const { data: learners, isLoading: learnersLoading } = useClassLearnersQuery(assessment?.classId || "");
  const submitResultsMutation = useSubmitResultsMutation(assessmentId || "", {
    onSuccess: () => {
      navigate("/assessments");
    }
  });

  // State to track [learnerId][questionIndex] = isCorrect
  const [results, setResults] = useState<Record<string, boolean[]>>({});

  const handleToggle = (learnerId: string, qIdx: number) => {
    setResults((prev) => {
      const learnerResults = prev[learnerId] || new Array(assessment?.questions.length).fill(false);
      const newLearnerResults = [...learnerResults];
      newLearnerResults[qIdx] = !newLearnerResults[qIdx];
      return { ...prev, [learnerId]: newLearnerResults };
    });
  };

  const handleSubmit = () => {
    if (!assessment || !learners) return;

    const formattedResults = learners.map((learner) => ({
      learnerId: learner.learnerId,
      scores: assessment.questions.map((q, qIdx) => ({
        questionText: q.questionText,
        isCorrect: !!results[learner.learnerId]?.[qIdx],
        skillTag: q.skillTag
      }))
    }));

    submitResultsMutation.mutate({
      classId: assessment.classId!,
      results: formattedResults
    });
  };

  if (assessmentLoading || learnersLoading) {
    return <Center py={100}><Loader color="orange" /></Center>;
  }

  if (!assessment) {
    return (
      <Center py={100}>
        <Stack align="center">
          <Text fw={700}>Assessment not found.</Text>
          <Button variant="subtle" color="orange" onClick={() => navigate("/assessments")}>Back to Assessments</Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap={32}>
      <Stack gap={16}>
        <Group>
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate("/assessments")} radius="xl">
            <IconArrowLeft />
          </ActionIcon>
          <Text c="#94a3b8" fw={700} fz="xs" tt="uppercase" className="tracking-wider">Back to Assessments</Text>
        </Group>

        <Group justify="space-between" align="flex-end">
          <Stack gap={4}>
            <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
              {assessment.title}
            </Title>
            <Text c="#64748b" fw={600}>
              Administering to Class: <Text span fw={800} c="#1e293b">{assessment.gradeLevel}</Text> • {assessment.subject}
            </Text>
          </Stack>
          <Stack gap={4} align="flex-end">
            <Button
              onClick={handleSubmit}
              bg="#ea580c"
              radius="md"
              h={48}
              px="xl"
              loading={submitResultsMutation.isPending}
              className="hover:bg-[#c2410c] font-bold shadow-lg shadow-orange-100"
            >
              Complete & Sync Results
            </Button>
            {submitResultsMutation.isError && (
              <Text c="red" fz="xs" fw={700}>Failed to sync results. Please try again.</Text>
            )}
          </Stack>
        </Group>
      </Stack>

      <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white overflow-hidden">
        <Box className="overflow-x-auto">
          <Table verticalSpacing="md" withColumnBorders={false}>
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th style={{ width: 250 }} className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider pb-4">Learner Name</th>
                {assessment.questions.map((_, idx) => (
                  <th key={idx} className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider pb-4 text-center">
                    Q{idx + 1}
                  </th>
                ))}
                <th className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider pb-4 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {learners?.map((learner) => {
                const learnerScores = results[learner.learnerId] || [];
                const correctCount = learnerScores.filter(Boolean).length;
                const score = Math.round((correctCount / assessment.questions.length) * 100);

                return (
                  <tr key={learner.learnerId} className="hover:bg-[#f8fafc] transition-colors border-b border-[#f8fafc] last:border-0">
                    <td className="py-4">
                      <Text fw={800} c="#1e293b" fz="sm">{learner.name}</Text>
                      <Text c="#94a3b8" fz="xs" fw={700}>{learner.learnerId.substring(0, 8)}...</Text>
                    </td>
                    {assessment.questions.map((_, qIdx) => (
                      <td key={qIdx} className="text-center py-4">
                        <Center>
                          <Checkbox 
                            size="md"
                            color="orange"
                            checked={!!results[learner.learnerId]?.[qIdx]}
                            onChange={() => handleToggle(learner.learnerId, qIdx)}
                            styles={{ input: { cursor: 'pointer' } }}
                          />
                        </Center>
                      </td>
                    ))}
                    <td className="text-center py-4">
                      <Badge 
                        variant="light" 
                        color={score >= 70 ? "green" : score >= 40 ? "orange" : "red"}
                        size="lg"
                        radius="sm"
                        className="font-black"
                      >
                        {score}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Box>
      </Paper>

      <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-[#f8fafc]">
        <Title order={3} fz="md" fw={900} mb="lg" c="#1e293b">Question Key</Title>
        <Stack gap="md">
          {assessment.questions.map((q, idx) => (
            <Group key={idx} align="flex-start" gap="md" className="bg-white p-4 rounded-xl border border-[#e2e8f0]">
              <Box className="w-8 h-8 rounded-lg bg-[#ea580c] flex items-center justify-center text-white font-black fz-sm">
                {idx + 1}
              </Box>
              <Stack gap={4} style={{ flex: 1 }}>
                <Text fw={700} fz="sm" c="#1e293b">{q.questionText}</Text>
                <Group gap="xs">
                  <Badge variant="dot" color="green" size="sm" className="font-bold">Correct: {q.correctAnswer}</Badge>
                  {q.skillTag && <Badge variant="light" color="gray" size="sm" className="font-bold">{q.skillTag}</Badge>}
                </Group>
              </Stack>
            </Group>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};