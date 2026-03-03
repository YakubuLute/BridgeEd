import type { ReactNode } from "react";
import { Text } from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { clearSession } from "../../../utils/session";

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

const IconDashboard = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="2" width="7" x="3" y="3" />
    <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="2" width="7" x="14" y="3" />
    <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="2" width="7" x="3" y="14" />
    <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="2" width="7" x="14" y="14" />
  </svg>
);

const IconBook = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M3 5.5C3 4.67 3.67 4 4.5 4H11V20H4.5A1.5 1.5 0 0 1 3 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M21 5.5C21 4.67 20.33 4 19.5 4H13V20H19.5A1.5 1.5 0 0 0 21 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconClipboard = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <rect height="18" rx="2" stroke="currentColor" strokeWidth="2" width="14" x="5" y="4" />
    <path d="M9 4.5A2.5 2.5 0 0 1 11.5 2H12.5A2.5 2.5 0 0 1 15 4.5V6H9V4.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M9 11H15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <path d="M9 15H15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </svg>
);

const IconActivity = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M2 13H7L10.5 5L14.5 19L17.5 11H22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const IconReports = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M4 20H20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <rect height="9" rx="1" stroke="currentColor" strokeWidth="2" width="3" x="6" y="10" />
    <rect height="13" rx="1" stroke="currentColor" strokeWidth="2" width="3" x="11" y="6" />
    <rect height="7" rx="1" stroke="currentColor" strokeWidth="2" width="3" x="16" y="12" />
  </svg>
);

const IconSettings = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19.4 15.1L20.5 17L18.3 19.2L16.4 18.1C15.9 18.4 15.3 18.6 14.7 18.8L14.1 21H9.9L9.3 18.8C8.7 18.6 8.1 18.4 7.6 18.1L5.7 19.2L3.5 17L4.6 15.1C4.3 14.6 4.1 14 3.9 13.4L1.7 12.8V11.2L3.9 10.6C4.1 10 4.3 9.4 4.6 8.9L3.5 7L5.7 4.8L7.6 5.9C8.1 5.6 8.7 5.4 9.3 5.2L9.9 3H14.1L14.7 5.2C15.3 5.4 15.9 5.6 16.4 5.9L18.3 4.8L20.5 7L19.4 8.9C19.7 9.4 19.9 10 20.1 10.6L22.3 11.2V12.8L20.1 13.4C19.9 14 19.7 14.6 19.4 15.1Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const IconLogout = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M15 17L20 12L15 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M20 12H9" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <path
      d="M11 20H5C3.9 20 3 19.1 3 18V6C3 4.9 3.9 4 5 4H11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
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
  if (role === Role.Teacher) {
    return teacherNavItems;
  }

  if (role === Role.SchoolAdmin) {
    return schoolAdminNavItems;
  }

  return nationalAdminNavItems;
};

export const DashboardLayout = ({ children, role }: DashboardLayoutProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavItems(role);

  const handleLogout = (): void => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="md:hidden min-h-screen bg-[#f3f3f5]">{children}</div>

      <div className="hidden md:flex min-h-screen bg-[#f3f3f5]">
        <aside className="w-60 border-r border-[#d5d6dd] bg-white flex flex-col sticky top-0 h-screen">
          <div className="p-8 border-b border-[#d5d6dd]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a] flex items-center justify-center">
                <Text c="white" fw={700} fz={18} lh="1">
                  B
                </Text>
              </div>
              <div>
                <Text c="#121421" fw={700} fz={16} lh="24px">
                  BridgeEd
                </Text>
                <Text c="#6A6C7D" fz={12} lh="16px">
                  Ghana Education
                </Text>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
                    active ? "bg-[#f4f5f7] text-[#121421]" : "text-[#121421] hover:bg-[#f7f8fa]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[16px] leading-[24px]">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#d5d6dd]">
            <button
              className="w-full flex items-center gap-4 px-3 py-3 text-[#D32F45] hover:bg-[#fff5f7] rounded-xl transition-colors"
              onClick={handleLogout}
              type="button"
            >
              <IconLogout className="w-5 h-5" />
              <span className="text-[16px] leading-[24px]">Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
};
