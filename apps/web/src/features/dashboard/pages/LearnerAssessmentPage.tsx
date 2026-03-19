import { useState, useEffect } from "react";
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
  Radio,
  Progress,
  Avatar,
  Select,
  Badge
} from "@mantine/core";
import { useJoinSessionQuery } from "../../../api/hooks/useAssessmentQueries";
import { useClassLearnersQuery } from "../../../api/hooks/useClassQueries";
import { useSocket } from "../../../api/hooks/useSocket";

export const LearnerAssessmentPage = (): JSX.Element => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useJoinSessionQuery(code || "");
  const { data: learners } = useClassLearnersQuery(data?.session.classId || "");
  const { joinSession, updateProgress } = useSocket();

  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (data?.session.sessionId) {
      joinSession(data.session.sessionId);
    }
  }, [data?.session.sessionId]);

  const handleNext = () => {
    if (!data) return;
    
    const nextIdx = currentQuestionIdx + 1;
    const progress = Math.round((nextIdx / data.assessment.questions.length) * 100);
    
    if (selectedLearnerId) {
      updateProgress({
        sessionId: data.session.sessionId,
        learnerId: selectedLearnerId,
        progress,
        currentQuestion: nextIdx
      });
    }

    if (nextIdx < data.assessment.questions.length) {
      setCurrentQuestionIdx(nextIdx);
    } else {
      setIsFinished(true);
    }
  };

  if (isLoading) return <Center py={100}><Loader color="orange" size="xl" /></Center>;
  
  if (isError || !data) {
    return (
      <Center py={100}>
        <Stack align="center">
          <Title order={2}>Invalid Code</Title>
          <Text>This assessment session does not exist or has been closed.</Text>
          <Button onClick={() => navigate("/join")} variant="subtle" color="orange">Back to Join</Button>
        </Stack>
      </Center>
    );
  }

  const { assessment } = data;
  const currentQuestion = assessment.questions[currentQuestionIdx];

  if (!currentQuestion && !isFinished && selectedLearnerId) {
    return <Center py={100}><Loader color="orange" /></Center>;
  }

  if (!selectedLearnerId) {
    return (
      <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center p-6">
        <Paper p={40} radius="24px" className="w-full max-w-md border border-[#e2e8f0] shadow-xl bg-white">
          <Stack gap="xl">
            <Stack gap={4}>
              <Title order={2} className="text-2xl font-black text-[#1e293b]">Welcome!</Title>
              <Text c="#64748b" fw={600}>Please select your name to begin the <Text span fw={800} c="#ea580c">{assessment.title}</Text></Text>
            </Stack>

            <Select
              label="Select Your Name"
              placeholder="Pick from list"
              searchable
              data={learners?.map(l => ({ value: l.learnerId, label: l.name })) || []}
              value={selectedLearnerId}
              onChange={setSelectedLearnerId}
              size="lg"
              radius="md"
            />

            <Button 
              size="lg" 
              bg="#ea580c" 
              disabled={!selectedLearnerId} 
              onClick={() => setCurrentQuestionIdx(0)}
              className="hover:bg-[#c2410c] font-bold"
            >
              Start Diagnostic
            </Button>
          </Stack>
        </Paper>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center p-6">
        <Paper p={40} radius="24px" className="w-full max-w-md border border-[#e2e8f0] shadow-xl bg-white text-center">
          <Stack gap="xl" align="center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl">✓</div>
            <Title order={2} className="text-3xl font-black">Well Done!</Title>
            <Text c="#64748b" fw={600} fz="lg">
              You have completed the assessment. Your teacher will review the results.
            </Text>
            <Button variant="outline" color="gray" onClick={() => navigate("/join")} fullWidth radius="md">Finish</Button>
          </Stack>
        </Paper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFF] p-6">
      <div className="max-w-2xl mx-auto">
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Avatar color="orange" radius="xl" size="md">
                {learners?.find(l => l.learnerId === selectedLearnerId)?.name[0]}
              </Avatar>
              <Text fw={800} c="#1e293b">
                {learners?.find(l => l.learnerId === selectedLearnerId)?.name}
              </Text>
            </Group>
            <Badge color="orange" variant="filled" size="lg" radius="sm" className="font-black">
              {currentQuestionIdx + 1} / {assessment.questions.length}
            </Badge>
          </Group>

          <Progress 
            value={((currentQuestionIdx) / assessment.questions.length) * 100} 
            color="orange" 
            size="sm" 
            radius="xl" 
            className="bg-[#e2e8f0]"
          />

          <Paper p={40} radius="32px" className="border border-[#e2e8f0] shadow-lg bg-white mt-4">
            <Stack gap="xl">
              <Title order={3} className="text-2xl font-black text-[#1e293b] leading-tight">
                {currentQuestion?.questionText}
              </Title>

              <Radio.Group
                value={answers[currentQuestionIdx]}
                onChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestionIdx]: val }))}
              >
                <Stack gap="md" mt="xl">
                  {currentQuestion?.options.map((opt, i) => (
                    <Paper 
                      key={i} 
                      onClick={() => setAnswers(prev => ({ ...prev, [currentQuestionIdx]: opt }))}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${answers[currentQuestionIdx] === opt ? 'border-[#ea580c] bg-[#fff7ed]' : 'border-[#f1f5f9] hover:border-[#e2e8f0] bg-white'}`}
                    >
                      <Radio 
                        value={opt} 
                        label={<Text fw={700} fz="lg" ml="sm">{opt}</Text>} 
                        color="orange"
                        styles={{ radio: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </Radio.Group>

              <Button 
                size="xl" 
                bg="#ea580c" 
                mt="xl"
                radius="xl"
                disabled={!answers[currentQuestionIdx]}
                onClick={handleNext}
                className="hover:bg-[#c2410c] font-black h-16 shadow-lg shadow-orange-100"
              >
                {currentQuestionIdx === assessment.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </div>
    </div>
  );
};
