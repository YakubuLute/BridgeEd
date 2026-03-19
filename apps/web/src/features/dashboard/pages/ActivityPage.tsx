import {
  Title,
  Text,
  Stack,
  Group,
  Paper,
  Box,
  Badge,
  Timeline,
  Center,
  Loader,
  SimpleGrid,
  Button,
  ActionIcon
} from "@mantine/core";
import { useActivityQuery } from "../../../api/hooks/useActivityQuery";

// --- Icons ---
const IconRefresh = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconAlertCircle = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

const IconCloud = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.1-3.9-4.4-.5-3.3-3.3-5.9-6.6-5.9-2.7 0-5 1.7-6 4.1-2.3.2-4.1 2.2-4.1 4.5C1.5 15.1 3.4 17 5.7 17H17.5" />
  </svg>
);

export const ActivityPage = (): JSX.Element => {
  const { data, isLoading, refetch } = useActivityQuery();

  const getActionLabel = (action: string) => {
    switch (action) {
      case "class.create":
        return "Created a new class";
      case "class.update":
        return "Updated class settings";
      case "learner.create":
        return "Added a new learner";
      case "learner.batchCreate":
        return "Imported learners in batch";
      case "auth.login":
        return "Logged into the platform";
      default:
        return action;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("create"))
      return (
        <Box bg="#ea580c" className="w-6 h-6 rounded-full flex items-center justify-center">
          <IconPlus />
        </Box>
      );
    return (
      <Box bg="#475569" className="w-6 h-6 rounded-full flex items-center justify-center">
        <IconCheck />
      </Box>
    );
  };

  return (
    <Stack gap={32}>
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
            Recent Activity
          </Title>
          <Text c="#64748b" fw={500}>
            Monitor your actions and system synchronization status.
          </Text>
        </Stack>
        <Button
          variant="outline"
          color="gray"
          radius="md"
          leftSection={<IconRefresh />}
          onClick={() => refetch()}
          className="border-[#e2e8f0] font-bold"
        >
          Refresh Feed
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
        <Paper
          p="xl"
          radius="24px"
          className="border border-[#e2e8f0] bg-white shadow-sm flex items-center gap-4"
        >
          <Box className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <IconCloud />
          </Box>
          <Stack gap={0}>
            <Text fw={900} fz="lg" c="#1e293b">
              Cloud Synced
            </Text>
            <Text c="#94a3b8" fz="xs" fw={700}>
              ALL DATA IS UP TO DATE
            </Text>
          </Stack>
        </Paper>

        <Paper
          p="xl"
          radius="24px"
          className="border border-[#e2e8f0] bg-white shadow-sm flex items-center gap-4"
        >
          <Box className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <IconRefresh />
          </Box>
          <Stack gap={0}>
            <Text fw={900} fz="lg" c="#1e293b">
              Automatic Sync
            </Text>
            <Text c="#94a3b8" fz="xs" fw={700}>
              ENABLED (WI-FI ONLY)
            </Text>
          </Stack>
        </Paper>

        <Paper
          p="xl"
          radius="24px"
          className="border border-[#e2e8f0] bg-white shadow-sm flex items-center gap-4"
        >
          <Box className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <IconAlertCircle />
          </Box>
          <Stack gap={0}>
            <Text fw={900} fz="lg" c="#1e293b">
              System Health
            </Text>
            <Text c="#94a3b8" fz="xs" fw={700}>
              STABLE • 99.9% UPTIME
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>

      <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
        <Title order={2} className="text-xl font-black text-[#1e293b] mb-12">
          Action Timeline
        </Title>

        {isLoading ? (
          <Center py={60}>
            <Loader color="orange" />
          </Center>
        ) : data && data.activities.length > 0 ? (
          <Timeline active={data.activities.length} bulletSize={32} lineWidth={2} color="orange">
            {data.activities.map((activity) => (
              <Timeline.Item
                key={activity.id}
                bullet={getActionIcon(activity.action)}
                title={
                  <Group gap="xs">
                    <Text fw={800} c="#1e293b">
                      {getActionLabel(activity.action)}
                    </Text>
                    <Badge
                      size="xs"
                      variant="dot"
                      color={activity.result === "success" ? "green" : "red"}
                    >
                      {activity.result}
                    </Badge>
                  </Group>
                }
              >
                <Stack gap={4} mt={4}>
                  <Text c="#64748b" fz="sm" fw={500}>
                    Entity:{" "}
                    <Text component="span" fw={700} c="#1e293b">
                      {activity.entity}
                    </Text>
                    {activity.entityId && ` • ID: ${activity.entityId.substring(0, 8)}...`}
                  </Text>
                  <Text c="#94a3b8" fz="xs" fw={700}>
                    {new Date(activity.occurredAt).toLocaleString()}
                  </Text>
                </Stack>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Center py={60}>
            <Stack align="center" gap="sm">
              <Text c="#94a3b8" fw={700}>
                No recent activity found.
              </Text>
              <Button variant="subtle" color="orange" onClick={() => refetch()}>
                Check for updates
              </Button>
            </Stack>
          </Center>
        )}
      </Paper>

      {/* Action Center - Next Steps */}
      <Paper p="xl" radius="24px" className="bg-[#1e293b] text-white">
        <Group justify="space-between" mb="xl">
          <Stack gap={4}>
            <Title order={3} className="text-xl font-black">
              Action Center
            </Title>
            <Text c="#94a3b8" fz="sm" fw={500}>
              System suggested next steps based on your activity.
            </Text>
          </Stack>
          <Badge color="orange" variant="filled">
            3 TASKS
          </Badge>
        </Group>

        <Stack gap="md">
          {[
            { task: "Assign remediation for JHS 1A", urgency: "High", color: "red" },
            { task: "Review sync errors from yesterday", urgency: "Medium", color: "orange" },
            { task: "Complete profile for 12 new learners", urgency: "Routine", color: "blue" }
          ].map((item, i) => (
            <Paper
              key={i}
              bg="rgba(255,255,255,0.05)"
              p="md"
              radius="xl"
              className="border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Group justify="space-between">
                <Group gap="md">
                  <Box className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                  <Text fw={700} fz="sm">
                    {item.task}
                  </Text>
                </Group>
                <Text c="#94a3b8" fz="xs" fw={800} tt="uppercase">
                  {item.urgency}
                </Text>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};
