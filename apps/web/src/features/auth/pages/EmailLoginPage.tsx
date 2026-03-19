import { useState } from "react";
import { Button, TextInput, PasswordInput, Stack, Text, Anchor, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useEmailLoginMutation } from "../../../api/hooks/useAuthMutations";
import { validateEmail, SESSION_STORAGE_KEY } from "../auth.constants";
import { getPostLoginPath } from "../../../utils/role-routing";

export const EmailLoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useEmailLoginMutation({
    onSuccess: (result) => {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresAt: result.expiresAt,
          user: result.user,
          loginAt: new Date().toISOString()
        })
      );
      navigate(getPostLoginPath(result.user), { replace: true });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    }
  });

  const handleLogin = () => {
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    loginMutation.mutate({ email: email.trim(), password });
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
        {error && (
          <Alert color="red" variant="light" radius="md">
            {error}
          </Alert>
        )}

        <TextInput
          label="Email Address"
          placeholder="teacher@school.edu"
          size="lg"
          radius="md"
          styles={inputStyles}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          error={error?.includes("email")}
        />

        <Stack gap={8}>
          <PasswordInput
            label="Password"
            placeholder="Your password"
            size="lg"
            radius="md"
            styles={inputStyles}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            error={error?.includes("password")}
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
          loading={loginMutation.isPending}
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
