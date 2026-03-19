import { useState } from "react";
import { Button, Stack, Text, Box, Center } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";

export const EmailVerificationPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResend = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent a verification link to your email address"
    >
      <Stack gap="xl">
        <Box className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col items-center text-center">
          <Box className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Box>
          <Text c="#1e293b" fw={700} fz="lg" mb="xs">
            Waiting for verification...
          </Text>
          <Text c="#64748b" fz="sm" fw={500} className="leading-relaxed">
            Please click the link in the email we sent you. If you don&apos;t see it, check your
            spam folder.
          </Text>
        </Box>

        <Stack gap="md">
          <Button
            fullWidth
            size="lg"
            radius="md"
            bg="#ea580c"
            className="hover:bg-[#c2410c] h-14 font-bold shadow-lg shadow-orange-100"
            loading={loading}
            onClick={() => navigate("/dashboard/teacher")}
          >
            I&apos;ve verified my email
          </Button>

          <Button
            fullWidth
            variant="outline"
            size="lg"
            radius="md"
            color="gray"
            className="border-2 border-[#E2E8F0] text-[#1e293b] font-bold h-14"
            onClick={handleResend}
          >
            Resend Verification Email
          </Button>
        </Stack>

        <Text ta="center" fz="sm" fw={600} c="#64748b">
          Need help?{" "}
          <Anchor component="button" color="orange" fw={700}>
            Contact Support
          </Anchor>
        </Text>
      </Stack>
    </AuthLayout>
  );
};

const Anchor = ({ children, ...props }: any) => (
  <Text component="span" {...props} className="cursor-pointer">
    {children}
  </Text>
);
