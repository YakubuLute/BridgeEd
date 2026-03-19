import { 
  Menu, 
  ActionIcon, 
  Indicator, 
  Text, 
  Stack, 
  Group, 
  ScrollArea, 
  Box, 
  Badge, 
  Button,
  Divider,
  Center,
  Loader
} from "@mantine/core";
import { 
  useNotificationsQuery, 
  useMarkReadMutation, 
  useMarkAllReadMutation 
} from "../../../api/hooks/useNotificationQueries";

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const NotificationCenter = () => {
  const { data: notifications, isLoading } = useNotificationsQuery();
  const markRead = useMarkReadMutation();
  const markAllRead = useMarkAllReadMutation();

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <Menu position="bottom-end" shadow="md" width={320} radius="md" transitionProps={{ transition: 'pop-top-right' }}>
      <Menu.Target>
        <Indicator size={10} offset={4} color="orange" withBorder processing={unreadCount > 0} disabled={unreadCount === 0}>
          <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
            <IconBell />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Box p="md" className="border-b border-[#f1f5f9]">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text fw={800} fz="sm">Notifications</Text>
              <Text c="#94a3b8" fz="xs" fw={600}>{unreadCount} unread messages</Text>
            </Stack>
            {unreadCount > 0 && (
              <Button 
                variant="subtle" 
                size="compact-xs" 
                color="orange" 
                onClick={() => markAllRead.mutate()}
                loading={markAllRead.isPending}
              >
                Mark all as read
              </Button>
            )}
          </Group>
        </Box>

        <ScrollArea h={400}>
          {isLoading ? (
            <Center py="xl"><Loader size="sm" color="orange" /></Center>
          ) : !notifications || notifications.length === 0 ? (
            <Box py="xl" px="md">
              <Text ta="center" c="#94a3b8" fz="xs" fw={700}>No notifications yet</Text>
            </Box>
          ) : (
            <Stack gap={0}>
              {notifications.map((n) => (
                <Box 
                  key={n.notificationId} 
                  p="md" 
                  className={`hover:bg-[#f8fafc] transition-colors cursor-pointer relative group border-b border-[#f1f5f9] last:border-0 ${!n.isRead ? 'bg-[#fff7ed]/30' : ''}`}
                  onClick={() => !n.isRead && markRead.mutate(n.notificationId)}
                >
                  {!n.isRead && <Box className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-full" />}
                  <Stack gap={4}>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Text fw={800} fz="xs" c={!n.isRead ? "#1e293b" : "#64748b"}>{n.title}</Text>
                      <Text c="#94a3b8" fz="10px" fw={600}>{new Date(n.createdAt).toLocaleDateString()}</Text>
                    </Group>
                    <Text fz="xs" c={!n.isRead ? "#475569" : "#94a3b8"} fw={500} lh="1.4">
                      {n.message}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </ScrollArea>

        <Box p="xs" className="border-t border-[#f1f5f9]">
          <Button variant="subtle" fullWidth size="xs" color="gray" fw={700}>View All Activity</Button>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};
