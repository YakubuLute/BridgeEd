import type { ReactNode } from "react";
import { Button, Stack, Text } from "@mantine/core";
import { Role } from "@bridgeed/shared";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { clearSession, readSession } from "../../../utils/session";

type DashboardLayoutProps = {
  children: ReactNode;
  role: Role;
};

type NavItem = {
  path: string;
  label: string;
};

const teacherNavItems: NavItem[] = [
  { path: "/dashboard/teacher", label: "Dashboard" },
  { path: "/classes", label: "Classes" },
  { path: "/reports", label: "Reports" },
  { path: "/settings", label: "Settings" }
];

const schoolAdminNavItems: NavItem[] = [
  { path: "/dashboard/school-admin", label: "Dashboard" },
  { path: "/school-admin/teachers", label: "Teachers" },
  { path: "/school-admin/transfers", label: "Transfers" },
  { path: "/school-admin/reports", label: "Reports" },
  { path: "/school-admin/settings", label: "Settings" }
];

const nationalAdminNavItems: NavItem[] = [
  { path: "/dashboard/national-admin", label: "Dashboard" },
  { path: "/admin/schools", label: "Schools" },
  { path: "/admin/districts", label: "Districts" },
  { path: "/admin/reports", label: "Reports" },
  { path: "/admin/settings", label: "Settings" }
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
  const session = readSession();
  const navItems = getNavItems(role);

  const handleLogout = (): void => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="lg:hidden min-h-screen bg-[#f3f3f5]">
        {children}
      </div>

      <div className="hidden lg:flex min-h-screen bg-[#f3f3f5]">
        <aside className="w-64 border-r border-[#d5d6dd] bg-white flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-[#d5d6dd]">
            <Text c="#121421" fw={700} fz={20} lh="30px">
              BridgeEd
            </Text>
            <Text c="#6A6C7D" fz={14} lh="20px">
              {session?.user.name ?? "Educator"}
            </Text>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2.5 rounded-md text-[15px] transition-colors ${
                    active ? "bg-[#292b37] text-white" : "text-[#121421] hover:bg-[#e8e8ec]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Stack className="p-4 border-t border-[#d5d6dd]" gap={8}>
            <Button color="dark" onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </Stack>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
};
