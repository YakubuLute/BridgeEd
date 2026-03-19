import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Stack,
  Group,
  Paper,
  TextInput,
  Button,
  Tabs,
  Switch,
  Divider,
  Avatar,
  Box,
  SimpleGrid,
  Select,
  Badge,
  Alert,
  Loader,
  Center
} from "@mantine/core";
import { useProfileQuery, useUpdateProfileMutation } from "../../../api/hooks/useUserQueries";

// --- Icons ---
const IconUser = () => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBell = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconShield = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

export const SettingsPage = (): JSX.Element => {
  const { data: profile, isLoading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [activeTab, setActiveTab] = useState<string | null>("account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email || "");
      setPhone(profile.phoneNumber || "");
    }
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      name,
      email,
      phoneNumber: phone
    });
  };

  if (isLoading) {
    return (
      <Center py={100}>
        <Loader color="orange" />
      </Center>
    );
  }

  return (
    <Stack gap={32}>
      <Stack gap={4}>
        <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
          Settings
        </Title>
        <Text c="#64748b" fw={500}>
          Manage your account preferences and system configurations.
        </Text>
      </Stack>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="xl">
          <Box className="md:col-span-1">
            <Paper
              p="md"
              radius="24px"
              className="border border-[#e2e8f0] bg-white shadow-sm sticky top-24"
            >
              <Stack gap={4}>
                <Tabs.List variant="unstyled" className="flex flex-col gap-1 w-full">
                  <Tabs.Tab
                    value="account"
                    leftSection={<IconUser />}
                    className={`w-full justify-start px-4 py-3 rounded-xl transition-all font-bold ${activeTab === "account" ? "bg-[#ea580c] text-white shadow-lg shadow-orange-100" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
                  >
                    Account
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="notifications"
                    leftSection={<IconBell />}
                    className={`w-full justify-start px-4 py-3 rounded-xl transition-all font-bold ${activeTab === "notifications" ? "bg-[#ea580c] text-white shadow-lg shadow-orange-100" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
                  >
                    Notifications
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="security"
                    leftSection={<IconShield />}
                    className={`w-full justify-start px-4 py-3 rounded-xl transition-all font-bold ${activeTab === "security" ? "bg-[#ea580c] text-white shadow-lg shadow-orange-100" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
                  >
                    Security
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="sync"
                    leftSection={<IconCloud />}
                    className={`w-full justify-start px-4 py-3 rounded-xl transition-all font-bold ${activeTab === "sync" ? "bg-[#ea580c] text-white shadow-lg shadow-orange-100" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
                  >
                    Sync & Offline
                  </Tabs.Tab>
                </Tabs.List>
              </Stack>
            </Paper>
          </Box>

          <Box className="md:col-span-3">
            <Tabs.Panel value="account">
              <Stack gap="xl">
                <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
                  <Title order={2} className="text-xl font-black mb-8">
                    Personal Information
                  </Title>

                  <Group gap={40} mb={40} align="center">
                    <Avatar
                      size={100}
                      radius="xl"
                      color="orange"
                      className="font-black text-3xl shadow-md border-4 border-white"
                    >
                      {profile?.name[0]}
                    </Avatar>
                    <Stack gap={8}>
                      <Button variant="outline" color="orange" radius="md" fw={700}>
                        Change Photo
                      </Button>
                      <Text c="#94a3b8" fz="xs" fw={700}>
                        JPG, GIF or PNG. Max size 2MB
                      </Text>
                    </Stack>
                  </Group>

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    <TextInput
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.currentTarget.value)}
                      radius="md"
                      styles={{
                        input: { height: "50px", fontWeight: 600, border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                    <TextInput
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      radius="md"
                      styles={{
                        input: { height: "50px", fontWeight: 600, border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                    <TextInput
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.currentTarget.value)}
                      placeholder="+233"
                      radius="md"
                      styles={{
                        input: { height: "50px", fontWeight: 600, border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                    <Select
                      label="Preferred Language"
                      defaultValue="English"
                      data={["English", "Twi", "Ga", "Ewe"]}
                      radius="md"
                      styles={{
                        input: { height: "50px", fontWeight: 600, border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                  </SimpleGrid>

                  <Button
                    bg="#ea580c"
                    radius="md"
                    mt={40}
                    className="hover:bg-[#c2410c] px-8 h-12 font-bold"
                    onClick={handleSaveProfile}
                    loading={updateProfileMutation.isPending}
                  >
                    Save Changes
                  </Button>
                </Paper>

                <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
                  <Title order={2} className="text-xl font-black mb-4">
                    School Scope
                  </Title>
                  <Text c="#64748b" fz="sm" mb="xl" fw={500}>
                    Your account is currently scoped to the following institution.
                  </Text>

                  <Box className="bg-[#f8fafc] p-6 rounded-2xl border border-[#f1f5f9]">
                    <Group justify="space-between">
                      <Stack gap={4}>
                        <Text fw={900} c="#1e293b" fz="lg">
                          Accra Academy
                        </Text>
                        <Text c="#94a3b8" fz="xs" fw={700}>
                          ID: {profile?.scope?.schoolId || "SCH-99212"}
                        </Text>
                      </Stack>
                      <Badge color="orange" variant="filled">
                        VERIFIED SCHOOL
                      </Badge>
                    </Group>
                  </Box>
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="notifications">
              <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
                <Title order={2} className="text-xl font-black mb-8">
                  Notification Preferences
                </Title>

                <Stack gap="xl">
                  <Group justify="space-between">
                    <Stack gap={4}>
                      <Text fw={800} c="#1e293b">
                        Email Notifications
                      </Text>
                      <Text c="#64748b" fz="sm" fw={500}>
                        Receive weekly performance summaries and platform updates.
                      </Text>
                    </Stack>
                    <Switch color="orange" size="lg" defaultChecked />
                  </Group>
                  <Divider color="#f1f5f9" />
                  <Group justify="space-between">
                    <Stack gap={4}>
                      <Text fw={800} c="#1e293b">
                        Screener Alerts
                      </Text>
                      <Text c="#64748b" fz="sm" fw={500}>
                        Get notified when a scheduled assessment window is closing.
                      </Text>
                    </Stack>
                    <Switch color="orange" size="lg" defaultChecked />
                  </Group>
                  <Divider color="#f1f5f9" />
                  <Group justify="space-between">
                    <Stack gap={4}>
                      <Text fw={800} c="#1e293b">
                        System Sync Alerts
                      </Text>
                      <Text c="#64748b" fz="sm" fw={500}>
                        Notify me when my offline data has successfully synced to cloud.
                      </Text>
                    </Stack>
                    <Switch color="orange" size="lg" />
                  </Group>
                </Stack>

                <Button
                  bg="#ea580c"
                  radius="md"
                  mt={40}
                  className="hover:bg-[#c2410c] px-8 h-12 font-bold"
                >
                  Update Preferences
                </Button>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="security">
              <Stack gap="xl">
                <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
                  <Title order={2} className="text-xl font-black mb-8">
                    Change Password
                  </Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    <TextInput
                      label="Current Password"
                      type="password"
                      radius="md"
                      styles={{
                        input: { height: "50px", border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                    <Box className="hidden sm:block" />
                    <TextInput
                      label="New Password"
                      type="password"
                      radius="md"
                      styles={{
                        input: { height: "50px", border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                    <TextInput
                      label="Confirm New Password"
                      type="password"
                      radius="md"
                      styles={{
                        input: { height: "50px", border: "2px solid #f1f5f9" },
                        label: { fontWeight: 700, marginBottom: 8, color: "#475569" }
                      }}
                    />
                  </SimpleGrid>
                  <Button
                    bg="#ea580c"
                    radius="md"
                    mt={40}
                    className="hover:bg-[#c2410c] px-8 h-12 font-bold"
                  >
                    Update Password
                  </Button>
                </Paper>

                <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
                  <Title order={2} className="text-xl font-black mb-4 text-red-600">
                    Danger Zone
                  </Title>
                  <Text c="#64748b" fz="sm" mb="xl" fw={500}>
                    Permanent actions regarding your account data.
                  </Text>

                  <Group
                    justify="space-between"
                    className="p-6 rounded-2xl bg-red-50 border border-red-100"
                  >
                    <Stack gap={4}>
                      <Text fw={800} c="#1e293b">
                        Delete My Account
                      </Text>
                      <Text c="#64748b" fz="xs" fw={500}>
                        Once deleted, all your classroom and student data will be permanently
                        removed.
                      </Text>
                    </Stack>
                    <Button variant="filled" color="red" radius="md" fw={700}>
                      Request Deletion
                    </Button>
                  </Group>
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="sync">
              <Paper p={40} radius="24px" className="border border-[#e2e8f0] bg-white shadow-sm">
                <Title order={2} className="text-xl font-black mb-8">
                  Offline Storage & Synchronization
                </Title>

                <Alert color="blue" variant="light" radius="xl" mb="xl" icon={<IconCloud />}>
                  <Text fz="sm" fw={700}>
                    Your local database is currently taking up 12.4 MB of storage.
                  </Text>
                </Alert>

                <Stack gap="xl">
                  <Group justify="space-between">
                    <Stack gap={4}>
                      <Text fw={800} c="#1e293b">
                        Sync Strategy
                      </Text>
                      <Text c="#64748b" fz="sm" fw={500}>
                        Control when the platform attempts to push data to the server.
                      </Text>
                    </Stack>
                    <Select
                      defaultValue="wifi"
                      data={[
                        { value: "wifi", label: "Wi-Fi Only" },
                        { value: "all", label: "Any Network" },
                        { value: "manual", label: "Manual Only" }
                      ]}
                      radius="md"
                      className="w-48"
                      styles={{ input: { fontWeight: 700 } }}
                    />
                  </Group>
                  <Divider color="#f1f5f9" />
                  <Group justify="space-between">
                    <Stack gap={4}>
                      <Text fw={800} c="#1e293b">
                        Clear Local Cache
                      </Text>
                      <Text c="#64748b" fz="sm" fw={500}>
                        Removes all locally stored assessment assets. Use if you experience issues.
                      </Text>
                    </Stack>
                    <Button variant="outline" color="gray" radius="md" fw={700}>
                      Clear Cache
                    </Button>
                  </Group>
                </Stack>

                <Box className="mt-12 pt-8 border-t border-[#f1f5f9]">
                  <Group justify="space-between">
                    <Text fz="sm" fw={800} c="#94a3b8">
                      LAST SUCCESSFUL SYNC
                    </Text>
                    <Text fz="sm" fw={800} c="#ea580c">
                      2 minutes ago
                    </Text>
                  </Group>
                </Box>
              </Paper>
            </Tabs.Panel>
          </Box>
        </SimpleGrid>
      </Tabs>
    </Stack>
  );
};
