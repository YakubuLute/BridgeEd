import { useState } from "react";
import { Button, TextInput, Stack, Text, Box, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useForgotPasswordMutation } from "../../../api/hooks/useAuthMutations";
import { validateEmail } from "../auth.constants";

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to process request");
    }
  });

  const handleSubmit = () => {
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    forgotPasswordMutation.mutate({ email: email.trim() });
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
    <AuthLayout
      title={submitted ? "Check your email" : "Reset Password"}
      subtitle={
        submitted
          ? "We've sent reset instructions to your inbox"
          : "Enter your email to receive a password reset link"
      }
    >
      <Stack gap="xl">
        {error && (
          <Alert color="red" variant="light" radius="md">
            {error}
          </Alert>
        )}

        {!submitted ? (
          <>
            <TextInput
              label="Email Address"
              placeholder="teacher@school.edu"
              size="lg"
              radius="md"
              styles={inputStyles}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              error={!!error}
            />

            <Button
              fullWidth
              size="xl"
              radius="md"
              bg="#ea580c"
              className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100"
              loading={forgotPasswordMutation.isPending}
              onClick={handleSubmit}
            >
              Send Reset Link
            </Button>
          </>
        ) : (
          <Box className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <Text c="#ea580c" fw={600} fz="sm" className="leading-relaxed">
              If an account exists for {email}, you will receive a link to reset your password
              shortly. Please check your spam folder if you don&apos;t see it.
            </Text>
          </Box>
        )}

        <Button
          fullWidth
          variant="outline"
          size="lg"
          radius="md"
          color="gray"
          className="border-2 border-[#E2E8F0] text-[#1e293b] font-bold h-14"
          onClick={() => navigate("/login/email")}
        >
          ← Back to Login
        </Button>
      </Stack>
    </AuthLayout>
  );
};
