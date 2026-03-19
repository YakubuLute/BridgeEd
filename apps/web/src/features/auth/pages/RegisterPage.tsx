import { useState } from "react";
import { Button, TextInput, PasswordInput, Stack, Text, Box, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useRegisterEmailMutation } from "../../../api/hooks/useAuthMutations";
import { SESSION_STORAGE_KEY, validateEmail, validatePassword } from "../auth.constants";
import { getPostLoginPath } from "../../../utils/role-routing";

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useRegisterEmailMutation({
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
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  });

  const handleRegister = () => {
    setError(null);

    if (!schoolId.trim()) {
      setError("Please enter your School Identifier");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      schoolId: schoolId.trim(),
      email: email.trim(),
      password
    });
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
    <AuthLayout title="Create Account" subtitle="Register your school to start tracking progress">
      <Stack gap="lg">
        {error && (
          <Alert color="red" variant="light" radius="md">
            {error}
          </Alert>
        )}

        <TextInput
          label="School Identifier"
          placeholder="SCH-123456"
          size="lg"
          radius="md"
          styles={inputStyles}
          description="Provided by your school administrator"
          value={schoolId}
          onChange={(e) => setSchoolId(e.currentTarget.value)}
        />

        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          size="lg"
          radius="md"
          styles={inputStyles}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <TextInput
          label="Email Address"
          placeholder="teacher@school.edu"
          size="lg"
          radius="md"
          styles={inputStyles}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          size="lg"
          radius="md"
          styles={inputStyles}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <Button
          fullWidth
          size="xl"
          radius="md"
          bg="#ea580c"
          className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100 mt-4"
          loading={registerMutation.isPending}
          onClick={handleRegister}
        >
          Create Teacher Account
        </Button>

        <Text ta="center" fz="sm" fw={600} c="#64748b">
          Already have an account?{" "}
          <Button
            variant="transparent"
            p={0}
            h="auto"
            fw={700}
            color="orange"
            onClick={() => navigate("/login/phone")}
          >
            Sign In
          </Button>
        </Text>

        <Box className="pt-4 border-t border-[#E2E8F0]">
          <Text c="#94a3b8" fz="xs" ta="center" className="leading-relaxed">
            By creating an account, you agree to BridgeEd&apos;s <br />
            <span className="font-bold cursor-pointer hover:text-[#ea580c]">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-bold cursor-pointer hover:text-[#ea580c]">Privacy Policy</span>.
          </Text>
        </Box>
      </Stack>
    </AuthLayout>
  );
};
