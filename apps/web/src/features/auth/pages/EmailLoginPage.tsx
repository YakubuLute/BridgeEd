import { useState } from "react";
import { Button, TextInput, PasswordInput, Stack, Text, Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";

export const EmailLoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/teacher");
    }, 1000);
  };

  const inputStyles = {
    input: { border: "2px solid #E2E8F0", height: "56px", fontSize: "16px", fontWeight: 600 },
    label: {
      fontWeight: 700,
      marginBottom: "8px",
      fontSize: "13px",
      color: "#64748b",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em"
    }
  };

  return (
    <AuthLayout title="Email Login" subtitle="Enter your credentials to access your account">
      <Stack gap="xl">
        <TextInput
          label="Email Address"
          placeholder="teacher@school.edu"
          size="lg"
          radius="md"
          styles={inputStyles}
        />

        <Stack gap={8}>
          <PasswordInput
            label="Password"
            placeholder="Your password"
            size="lg"
            radius="md"
            styles={inputStyles}
          />
          <Anchor
            component="button"
            fz="sm"
            fw={700}
            color="orange"
            ta="right"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </Anchor>
        </Stack>

        <Button
          fullWidth
          size="xl"
          radius="md"
          bg="#ea580c"
          className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100"
          loading={loading}
          onClick={handleLogin}
        >
          Sign In
        </Button>

        <Stack gap="sm" mt="xl">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
            <Text c="#94a3b8" fz="xs" fw={700} tt="uppercase">
              Or
            </Text>
            <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
          </div>
          <Button
            fullWidth
            variant="outline"
            size="lg"
            radius="md"
            color="gray"
            className="border-2 border-[#E2E8F0] text-[#1e293b] font-bold h-14"
            onClick={() => navigate("/login/phone")}
          >
            ← Back to Phone Login
          </Button>
        </Stack>

        <Text ta="center" fz="sm" fw={600} c="#64748b">
          Don&apos;t have an account?{" "}
          <Button
            variant="transparent"
            p={0}
            h="auto"
            fw={700}
            color="orange"
            onClick={() => navigate("/register")}
          >
            Register School
          </Button>
        </Text>
      </Stack>
    </AuthLayout>
  );
};
