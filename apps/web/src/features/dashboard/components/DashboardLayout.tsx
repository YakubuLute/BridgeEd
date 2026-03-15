import { useState, type ReactNode } from "react";
import {
  Text,
  Burger,
  Drawer,
  Group,
  Stack,
  Box,
  ActionIcon,
  Indicator,
  Avatar,
  Menu
} from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { clearSession } from "../../../utils/session";
import { useProfileQuery } from "../../../api/hooks/useUserQueries";
import { NotificationCenter } from "./NotificationCenter";

type DashboardLayoutProps = {
  children: ReactNode;
  role: Role;
};

type IconProps = {
  className?: string;
};

type NavItem = {
  path: string;
  label: string;
  icon: (props: IconProps) => JSX.Element;
};

// --- Modern 1.5px Stroke Icons ---
const IconDashboard = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const IconBook = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const IconClipboard = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect width="8" height="4" x="8" y="2" rx="1" />
    <path d="M9 14h6" />
    <path d="M9 10h6" />
  </svg>
);

const IconActivity = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const IconReports = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const IconSettings = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconLogout = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const IconBell = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconSearch = ({ className }: IconProps): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const teacherNavItems: NavItem[] = [
  { path: "/dashboard/teacher", label: "Dashboard", icon: IconDashboard },
  { path: "/classes", label: "Classes", icon: IconBook },
  { path: "/assessments", label: "Assessments", icon: IconClipboard },
  { path: "/activity", label: "Activity", icon: IconActivity },
  { path: "/reports", label: "Reports", icon: IconReports },
  { path: "/settings", label: "Settings", icon: IconSettings }
];

const schoolAdminNavItems: NavItem[] = [
  { path: "/dashboard/school-admin", label: "Dashboard", icon: IconDashboard },
  { path: "/school-admin/school", label: "School", icon: IconBook },
  { path: "/school-admin/teachers", label: "Teachers", icon: IconClipboard },
  { path: "/school-admin/transfers", label: "Transfers", icon: IconActivity },
  { path: "/school-admin/reports", label: "Reports", icon: IconReports },
  { path: "/school-admin/settings", label: "Settings", icon: IconSettings }
];

const nationalAdminNavItems: NavItem[] = [
  { path: "/dashboard/national-admin", label: "Dashboard", icon: IconDashboard },
  { path: "/admin/schools", label: "Schools", icon: IconBook },
  { path: "/admin/districts", label: "Districts", icon: IconClipboard },
  { path: "/admin/reports", label: "Reports", icon: IconReports },
  { path: "/admin/settings", label: "Settings", icon: IconSettings }
];

const getNavItems = (role: Role): NavItem[] => {
  if (role === Role.Teacher) return teacherNavItems;
  if (role === Role.SchoolAdmin) return schoolAdminNavItems;
  return nationalAdminNavItems;
};

export const DashboardLayout = ({ children, role }: DashboardLayoutProps): JSX.Element => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavItems(role);
  const { data: userProfile } = useProfileQuery();

  const handleLogout = (): void => {
    clearSession();
    navigate("/", { replace: true });
  };

  const NavLinks = () => (
    <Stack gap={4}>
      {navItems.map((item) => {
        const active =
          location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold group relative ${
              active
                ? "bg-[#F5F3FF] text-[#EF4444]"
                : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]"
            }`}
          >
            {active && <Box className="absolute left-0 w-1 h-6 bg-[#EF4444] rounded-r-full" />}
            <Icon
              className={`w-5 h-5 transition-colors ${active ? "text-[#EF4444]" : "group-hover:text-[#EF4444]"}`}
            />
            <span className="text-[14px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </Stack>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFF] flex flex-col md:flex-row font-sans text-[#111827]">
      {/* --- Mobile Header --- */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <Group gap="xs">
          <div className="w-8 h-8 rounded-lg bg-[#EF4444] flex items-center justify-center shadow-md shadow-purple-100">
            <Text c="white" fw={800} fz={16} lh="1">
              B
            </Text>
          </div>
          <Text c="#111827" fw={800} fz={18}>
            BridgeEd
          </Text>
        </Group>
        <Burger
          opened={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((o) => !o)}
          size="sm"
          color="#64748B"
        />
      </header>

      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex w-[260px] bg-white border-r border-[#E5E7EB] flex-col sticky top-0 h-screen z-30">
        <div className="h-20 flex items-center px-8">
          <Group gap="xs">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444] flex items-center justify-center shadow-lg shadow-purple-100 transform -rotate-3">
              <Text c="white" fw={800} fz={18} lh="1">
                B
              </Text>
            </div>
            <Text c="#111827" fw={800} fz={22} className="tracking-tight">
              BridgeEd
            </Text>
          </Group>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <Text c="#94A3B8" fw={700} fz={11} tt="uppercase" className="px-4 pb-4 tracking-[0.15em]">
            Management
          </Text>
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl transition-colors font-semibold"
            onClick={handleLogout}
            type="button"
          >
            <IconLogout className="w-5 h-5" />
            <span className="text-[14px]">Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* --- Top Navbar --- */}
        <header className="hidden md:flex h-20 bg-white border-b border-[#E5E7EB] items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2 w-full max-w-md group focus-within:border-[#EF4444] transition-colors">
            <IconSearch className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#EF4444]" />
            <input
              type="text"
              placeholder="Search students, classes, results..."
              className="bg-transparent border-none outline-none ml-3 text-sm w-full placeholder-[#94A3B8] text-[#111827]"
            />
          </div>

          <Group gap="lg">
            <NotificationCenter />

            <Menu position="bottom-end" shadow="md" width={200} radius="md">
              <Menu.Target>
                <Group
                  gap="sm"
                  className="cursor-pointer hover:bg-[#F8FAFC] p-1.5 rounded-xl transition-colors"
                >
                  <Avatar radius="md" color="orange" size="sm">
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : (role === Role.Teacher ? "T" : role === Role.SchoolAdmin ? "S" : "N")}
                  </Avatar>
                  <Stack gap={0}>
                    <Text fw={700} fz="sm" lh={1.2}>
                      {userProfile?.name || (role === Role.Teacher ? "Alex Teacher" : "Admin User")}
                    </Text>
                    <Text c="#94A3B8" fz={11} fw={600} tt="uppercase" className="tracking-wider">
                      {role}
                    </Text>
                  </Stack>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings className="w-4 h-4" />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout className="w-4 h-4" />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </header>

        {/* --- Page Content --- */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-6 md:p-10">{children}</div>
        </main>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <Drawer
        opened={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        size="xs"
        padding="md"
        title={
          <Group gap="xs">
            <div className="w-8 h-8 rounded-lg bg-[#EF4444] flex items-center justify-center">
              <Text c="white" fw={800} fz={16} lh="1">
                B
              </Text>
            </div>
            <Text c="#111827" fw={800} fz={18}>
              BridgeEd
            </Text>
          </Group>
        }
      >
        <div className="flex flex-col h-full pt-4">
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="pt-4 border-t border-[#E5E7EB]">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] rounded-xl font-semibold"
              onClick={handleLogout}
              type="button"
            >
              <IconLogout className="w-5 h-5" />
              <span className="text-[14px]">Log Out</span>
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
