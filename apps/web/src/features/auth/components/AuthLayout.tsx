import type { ReactNode } from "react";
import { Box, Container, Center, Stack, Text, Title } from "@mantine/core";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps): JSX.Element => {
  return (
    <div className="h-screen bg-white flex flex-col md:flex-row font-sans text-[#334155] overflow-hidden">
      {/* --- Left Panel: Branding (Desktop) --- */}
      <div className="hidden md:flex w-1/2 bg-[#ea580c] p-16 flex-col justify-between relative overflow-hidden h-full">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="10" cy="10" r="30" fill="white" />
            <circle cx="90" cy="90" r="40" fill="white" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Box className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xl">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ea580c"
                strokeWidth="3"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </Box>
            <Text c="white" fw={900} fz={32} className="tracking-tighter">
              BridgeEd
            </Text>
          </div>

          <Title order={1} c="white" className="text-6xl font-black leading-tight mb-6">
            Bridging the gap to <br />
            <span className="opacity-80">digital learning.</span>
          </Title>
          <Text c="white" fz="xl" fw={500} className="max-w-md opacity-90 leading-relaxed">
            Empowering teachers with AI-driven diagnostics and automated remediation tools.
          </Text>
        </div>

        <div className="relative z-10">
          <Text c="white" fw={700} fz="sm" className="opacity-60 uppercase tracking-widest">
            © {new Date().getFullYear()} BridgeEd Platform
          </Text>
        </div>
      </div>

      {/* --- Right Panel: Content --- */}
      <div className="flex-1 flex flex-col items-center p-8 md:p-16 bg-[#FBFBFF] h-full overflow-y-auto">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-3 mb-12">
          <Box className="w-10 h-10 rounded-lg bg-[#ea580c] flex items-center justify-center shadow-lg">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </Box>
          <Text c="#1e293b" fw={900} fz={24} className="tracking-tighter">
            BridgeEd
          </Text>
        </div>

        <Box className="w-full max-w-md my-auto py-8">
          <Stack
            gap="xs"
            mb={40}
            align={{ base: "center", md: "flex-start" }}
            className="text-center md:text-left"
          >
            <Title order={2} className="text-4xl font-black text-[#1e293b] tracking-tight">
              {title}
            </Title>
            <Text c="#64748b" fz="lg" fw={500}>
              {subtitle}
            </Text>
          </Stack>

          {children}
        </Box>
      </div>
    </div>
  );
};
