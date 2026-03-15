import { useState } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  Stack,
  Button,
  TextInput,
  Box,
  Badge,
  ActionIcon,
  Loader,
  Center
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useClassesQuery } from "../../../api/hooks/useClassQueries";
import { CreateClassModal } from "../components/CreateClassModal";

// --- Icons ---
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconFilter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const ClassesPage = (): JSX.Element => {
  const { data: classes, isLoading } = useClassesQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");

  const filteredClasses = classes?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.gradeLevel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap={32}>
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
            My Classes
          </Title>
          <Text c="#64748b" fw={500}>Manage and track progress across your assigned class streams.</Text>
        </Stack>
        <Button
          onClick={open}
          bg="#ea580c"
          radius="md"
          size="md"
          leftSection={<IconPlus />}
          className="hover:bg-[#c2410c] font-bold shadow-lg shadow-orange-100 h-12 px-6"
        >
          Create New Class
        </Button>
      </Group>

      {/* Filters & Actions Bar */}
      <Paper p="md" radius="xl" className="border border-[#e2e8f0] shadow-sm">
        <Group justify="space-between">
          <Box className="flex-1 max-w-md">
            <TextInput
              placeholder="Search classes by name or grade..."
              leftSection={<IconSearch />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              variant="unstyled"
              className="px-4"
              styles={{
                input: { fontSize: "15px", fontWeight: 600 }
              }}
            />
          </Box>
          <Group gap="sm">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconFilter />}
              fw={700}
              size="sm"
            >
              Filter
            </Button>
            <div className="w-[1px] h-6 bg-[#e2e8f0]" />
            <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase" px="xs">
              {filteredClasses?.length || 0} Classes Total
            </Text>
          </Group>
        </Group>
      </Paper>

      {/* Classes Grid */}
      {isLoading ? (
        <Center py={100}>
          <Loader color="orange" size="xl" />
        </Center>
      ) : filteredClasses && filteredClasses.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          {filteredClasses.map((cls) => (
            <Paper
              key={cls.id}
              p={0}
              radius="24px"
              className="border border-[#e2e8f0] shadow-sm hover:shadow-md hover:border-[#ea580c] transition-all cursor-pointer group overflow-hidden bg-white"
            >
              <Box className="p-8">
                <Group justify="space-between" mb="xl">
                  <Badge
                    bg="#fff7ed"
                    c="#ea580c"
                    size="lg"
                    radius="md"
                    className="font-black border border-orange-100"
                  >
                    {cls.gradeLevel}
                  </Badge>
                  <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                    <IconArrowRight />
                  </ActionIcon>
                </Group>

                <Title order={3} className="text-2xl font-black text-[#1e293b] mb-2 tracking-tight group-hover:text-[#ea580c] transition-colors">
                  {cls.name}
                </Title>
                <Text c="#64748b" fw={600} fz="sm" mb="xl">
                  {cls.subject || "General Classroom"} • {cls.academicYear}
                </Text>

                <SimpleGrid cols={2} spacing="md" className="pt-6 border-t border-[#f1f5f9]">
                  <Stack gap={2}>
                    <Text c="#94a3b8" fz="10px" fw={800} tt="uppercase" className="tracking-wider">Total Students</Text>
                    <Text fw={900} fz="xl" c="#1e293b">--</Text>
                  </Stack>
                  <Stack gap={2}>
                    <Text c="#94a3b8" fz="10px" fw={800} tt="uppercase" className="tracking-wider">Status</Text>
                    <Badge
                      variant="dot"
                      color={cls.isActive ? "green" : "gray"}
                      size="sm"
                      className="font-bold p-0"
                    >
                      {cls.isActive ? "Active" : "Archived"}
                    </Badge>
                  </Stack>
                </SimpleGrid>
              </Box>
              
              <Box className="bg-[#f8fafc] px-8 py-4 border-t border-[#f1f5f9] flex justify-between items-center group-hover:bg-[#fff7ed] transition-colors">
                 <Text c="#64748b" fz="xs" fw={700}>Last assessed: 2 days ago</Text>
                 <Text c="#ea580c" fz="xs" fw={800} className="opacity-0 group-hover:opacity-100 transition-opacity">Manage Class →</Text>
              </Box>
            </Paper>
          ))}
        </SimpleGrid>
      ) : (
        <Paper p={80} radius="24px" className="border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc]">
          <Stack align="center" gap="md">
            <Box className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#94a3b8]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </Box>
            <Title order={3} className="text-[#1e293b]">No classes found</Title>
            <Text c="#64748b" ta="center" className="max-w-xs">
              {search ? `No classes match "${search}". Try a different search term.` : "You haven't created any classes yet. Click the button above to get started."}
            </Text>
            {search && (
               <Button variant="subtle" color="orange" onClick={() => setSearch("")} fw={700}>Clear search</Button>
            )}
          </Stack>
        </Paper>
      )}

      <CreateClassModal opened={opened} onClose={close} />
    </Stack>
  );
};
