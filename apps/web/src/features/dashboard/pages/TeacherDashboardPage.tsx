import { Link } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { DashboardLayout } from "../components/DashboardLayout";

type IconProps = {
  className?: string;
};

const IconUsers = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle cx="8.5" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M2.5 19C2.5 15.9 5 13.5 8.5 13.5C12 13.5 14.5 15.9 14.5 19" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M15.5 13.5C17.7 13.8 19.5 15.4 19.5 17.9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconTrendUp = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M4 15L9 10L13 14L20 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M15 7H20V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const IconBook = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M3 5.5C3 4.67 3.67 4 4.5 4H11V20H4.5A1.5 1.5 0 0 1 3 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M21 5.5C21 4.67 20.33 4 19.5 4H13V20H19.5A1.5 1.5 0 0 0 21 18.5V5.5Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconFile = ({ className }: IconProps): JSX.Element => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <path d="M7 3H14L19 8V21H7V3Z" stroke="currentColor" strokeWidth="2" />
    <path d="M14 3V8H19" stroke="currentColor" strokeWidth="2" />
    <path d="M10 12H16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <path d="M10 16H16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
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

const stats = [
  {
    label: "Students",
    value: "165",
    icon: IconUsers,
    iconWrapperClassName: "bg-[#E7F3EC] text-[#1FA54A]"
  },
  {
    label: "On Track",
    value: "78%",
    icon: IconTrendUp,
    iconWrapperClassName: "bg-[#E7F3EC] text-[#1FA54A]"
  },
  {
    label: "Classes",
    value: "4",
    icon: IconBook,
    iconWrapperClassName: "bg-[#EEF0FA] text-[#121421]"
  },
  {
    label: "Pending",
    value: "12",
    icon: IconFile,
    iconWrapperClassName: "bg-[#F7EFE4] text-[#FB9700]"
  }
];

const classes = [
  { id: "jhs-1a", name: "JHS 1A", students: 42, subject: "Mathematics" },
  { id: "jhs-1b", name: "JHS 1B", students: 38, subject: "English" },
  { id: "jhs-2a", name: "JHS 2A", students: 45, subject: "Mathematics" },
  { id: "shs-1c", name: "SHS 1C", students: 40, subject: "English" }
];

const recentActivity = [
  { student: "Kwame Mensah", action: "Assessment completed", time: "2 hours ago" },
  { student: "Akua Asante", action: "Remediation plan created", time: "5 hours ago" },
  { student: "Kofi Owusu", action: "Progress updated", time: "1 day ago" }
];

export const TeacherDashboardPage = (): JSX.Element => (
  <DashboardLayout role={Role.Teacher}>
    <div className="border-b border-[#d5d6dd] bg-[#f3f3f5]">
      <div className="px-10 py-7 flex items-center justify-between">
        <div>
          <h1 className="text-[56px] leading-[64px] font-semibold text-[#121421]">Dashboard</h1>
          <p className="text-[28px] leading-[38px] text-[#6A6C7D] mt-1">Welcome back, Teacher Name</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-[22px] leading-[32px] font-semibold px-8 py-5 rounded-2xl transition-colors"
            to="/assessments"
          >
            New Assessment
          </Link>
          <button
            className="w-20 h-20 rounded-2xl border border-[#d5d6dd] bg-transparent hover:bg-[#eceef2] flex items-center justify-center transition-colors text-[#121421]"
            type="button"
          >
            <IconSettings className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>

    <div className="px-10 py-8">
      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#d5d6dd] bg-white px-8 py-7 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.iconWrapperClassName}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[56px] leading-[60px] font-semibold text-[#121421]">{stat.value}</p>
                  <p className="text-[24px] leading-[34px] text-[#6A6C7D] mt-2">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-[56px] leading-[64px] font-semibold text-[#121421] mb-5">My Classes</h2>
          <div className="space-y-4">
            {classes.map((classItem) => (
              <Link
                key={classItem.id}
                className="rounded-3xl border border-[#d5d6dd] bg-white px-8 py-7 block hover:bg-[#f8f9fc] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                to={`/classes/${classItem.id}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-[42px] leading-[54px] font-semibold text-[#121421]">{classItem.name}</p>
                  <p className="text-[22px] leading-[34px] text-[#6A6C7D]">{classItem.students} students</p>
                </div>
                <p className="text-[24px] leading-[34px] text-[#6A6C7D]">{classItem.subject}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[56px] leading-[64px] font-semibold text-[#121421] mb-5">Recent Activity</h2>
          <div className="rounded-3xl border border-[#d5d6dd] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            {recentActivity.map((item, index) => (
              <div
                key={`${item.student}-${index}`}
                className={`px-8 py-7 ${index < recentActivity.length - 1 ? "border-b border-[#d5d6dd]" : ""}`}
              >
                <p className="text-[48px] leading-[58px] font-semibold text-[#121421]">{item.student}</p>
                <p className="text-[24px] leading-[34px] text-[#6A6C7D] mt-1">{item.action}</p>
                <p className="text-[24px] leading-[34px] text-[#6A6C7D] mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);
