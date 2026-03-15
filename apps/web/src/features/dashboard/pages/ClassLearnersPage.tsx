import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Stack,
  Group,
  Paper,
  Box,
  Badge,
  Button,
  SimpleGrid,
  ActionIcon,
  Loader,
  Center,
  TextInput,
  Avatar,
  Table
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useClassDetailQuery, useClassLearnersQuery } from "../../../api/hooks/useClassQueries";
import { AddLearnerModal } from "../components/AddLearnerModal";

// --- Icons ---
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export const ClassLearnersPage = (): JSX.Element => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const { data: classData, isLoading: classLoading } = useClassDetailQuery(classId || "");
  const { data: learners, isLoading: learnersLoading } = useClassLearnersQuery(classId || "");

  const filteredLearners = learners?.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  if (classLoading) {
    return <Center py={100}><Loader color="orange" /></Center>;
  }

  if (!classData) {
    return (
      <Center py={100}>
        <Stack align="center">
          <Text fw={700}>Class not found.</Text>
          <Button variant="subtle" color="orange" onClick={() => navigate("/classes")}>Back to Classes</Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap={32}>
      {/* Header */}
      <Stack gap={16}>
        <Group>
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate("/classes")} radius="xl">
            <IconArrowLeft />
          </ActionIcon>
          <Text c="#94a3b8" fw={700} fz="xs" tt="uppercase" className="tracking-wider">Back to Classes</Text>
        </Group>

        <Group justify="space-between" align="flex-end">
          <Stack gap={4}>
            <Group gap="sm">
               <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
                {classData.name}
              </Title>
              <Badge bg="#fff7ed" c="#ea580c" radius="md" size="lg" className="font-black border border-orange-100">
                {classData.gradeLevel}
              </Badge>
            </Group>
            <Text c="#64748b" fw={500}>
              {classData.subject || "General Classroom"} • {classData.academicYear} • {learners?.length || 0} Students
            </Text>
          </Stack>
          <Button
            onClick={open}
            bg="#ea580c"
            radius="md"
            h={48}
            px="xl"
            leftSection={<IconPlus />}
            className="hover:bg-[#c2410c] font-bold shadow-lg shadow-orange-100"
          >
            Add New Learner
          </Button>
        </Group>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xl">
         {/* KPI Summaries for this class */}
         <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white">
            <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">Total Students</Text>
            <Title order={2} fz="28px" fw={900}>{learners?.length || 0}</Title>
         </Paper>
         <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white">
            <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">Assessed</Text>
            <Title order={2} fz="28px" fw={900}>--</Title>
         </Paper>
         <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white">
            <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">Avg. Literacy</Text>
            <Title order={2} fz="28px" fw={900}>--%</Title>
         </Paper>
         <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white">
            <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" mb="xs">Avg. Numeracy</Text>
            <Title order={2} fz="28px" fw={900}>--%</Title>
         </Paper>
      </SimpleGrid>

      <Paper p="xl" radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
        <Group justify="space-between" mb="xl">
          <Title order={3} className="text-xl font-black text-[#1e293b]">Learner Roster</Title>
          <TextInput
            placeholder="Search learners..."
            leftSection={<IconSearch />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            radius="md"
            className="w-72"
            styles={{ input: { fontWeight: 600, border: '2px solid #f1f5f9' } }}
          />
        </Group>

        {learnersLoading ? (
           <Center py={40}><Loader color="orange" /></Center>
        ) : filteredLearners && filteredLearners.length > 0 ? (
          <div className="overflow-x-auto">
            <Table verticalSpacing="md">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">Learner Name</th>
                  <th className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">Learner ID</th>
                  <th className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">Last Assessed</th>
                  <th className="font-black text-[#94a3b8] text-[10px] uppercase tracking-wider">Status</th>
                  <th className="text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLearners.map((learner) => (
                  <tr key={learner.learnerId} className="hover:bg-[#f8fafc] transition-colors cursor-pointer group">
                    <td className="py-4">
                       <Group gap="sm">
                          <Avatar radius="xl" color="orange" size="sm" className="font-bold">{learner.name[0]}</Avatar>
                          <Text fw={800} c="#1e293b" fz="sm">{learner.name}</Text>
                       </Group>
                    </td>
                    <td className="py-4">
                       <Text c="#64748b" fw={700} fz="xs">{learner.learnerId.substring(0, 8)}...</Text>
                    </td>
                    <td className="py-4">
                       <Text c="#94a3b8" fw={700} fz="xs">Never</Text>
                    </td>
                    <td className="py-4">
                       <Badge color="gray" variant="light" size="sm">No Data</Badge>
                    </td>
                    <td className="py-4 text-right">
                       <Button variant="subtle" color="orange" size="xs" fw={700} onClick={() => navigate(`/learners/${learner.learnerId}`)}>View Profile</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Center py={80}>
             <Stack align="center" gap="sm">
                <IconUser />
                <Text c="#94a3b8" fw={700}>
                  {search ? `No learners match "${search}"` : "No learners in this class yet."}
                </Text>
             </Stack>
          </Center>
        )}
      </Paper>

      {classId && <AddLearnerModal opened={opened} onClose={close} classId={classId} />}
    </Stack>
  );
};
