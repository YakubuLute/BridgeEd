import { useState } from "react";
import { Alert, Anchor, Box, Button, Card, Center, Group, Input, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useForgotPasswordMutation } from "../../../api/hooks/useAuthMutations";
import { AuthLayout } from "../AuthLayout";
import { AlertCircleIcon, ArrowLeftIcon, CheckCircleIcon, MailIcon } from "../AuthIcons";
import { validateEmail } from "../auth.constants";
import {
  authCardStyle,
  authInputClassNames,
  getActionButtonClassName,
  getActionButtonStyles,
  getAuthInputStyles
} from "../auth.styles";

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [resetTokenExpiresInMinutes, setResetTokenExpiresInMinutes] = useState<number>(60);
  const [error, setError] = useState<string>("");

  const isEmailValid = validateEmail(email);
  const activeEmail = isSubmitted ? submittedEmail : email;

  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: (result) => {
      setError("");
      setIsSubmitted(true);
      setSubmittedEmail(result.email);
      setEmail(result.email);
      setResetTokenExpiresInMinutes(result.resetTokenExpiresInMinutes);
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to send reset email.");
    }
  });

  const requestReset = (targetEmail: string): void => {
    forgotPasswordMutation.mutate({
      email: targetEmail.trim().toLowerCase()
    });
  };

  const handleSubmit = (): void => {
    if (!isEmailValid) {
      return;
    }

    requestReset(email);
  };

  const handleResend = (): void => {
    if (!activeEmail) {
      return;
    }

    requestReset(activeEmail);
  };

  return (
    <AuthLayout
      footer={
        !isSubmitted ? (
          <Stack align="center" gap={8}>
            <Box
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #D5D6DD",
                backgroundColor: "rgba(15, 23, 42, 0.04)"
              }}
            >
              <Text c="#6A6C7D" fz={12} lh="16px" ta="center">
                For security reasons, we don&apos;t disclose whether an email exists in our system. If the
                email is valid, you will receive reset instructions.
              </Text>
            </Box>
            <Text c="#6A6C7D" fz={12} lh="16px" ta="center">
              Need help? Contact your system administrator
            </Text>
          </Stack>
        ) : (
          <Text c="#6A6C7D" fz={12} lh="16px" ta="center">
            Check your spam folder if you don&apos;t see the email
          </Text>
        )
      }
      showTagline={!isSubmitted}
    >
      <Card p={24} radius={16} style={authCardStyle}>
        <Stack gap={24}>
          {error && (
            <Alert
              color="red"
              icon={<AlertCircleIcon />}
              radius="md"
              styles={{
                message: {
                  fontSize: "14px",
                  lineHeight: "20px"
                }
              }}
              variant="light"
            >
              {error}
            </Alert>
          )}

          {!isSubmitted && (
            <>
              <Stack align="center" gap={8}>
                <Text c="#121421" fw={700} fz={22} lh="32px" ta="center">
                  Reset Password
                </Text>
                <Text c="#696C7D" fw={500} fz={16} lh="24px" ta="center">
                  Enter your email address and we&apos;ll send you instructions to reset your password
                </Text>
              </Stack>

              <Stack gap={8}>
                <Text c="#151721" fw={700} fz={16} lh="24px">
                  Email Address
                </Text>
                <Input
                  classNames={authInputClassNames}
                  leftSection={<MailIcon />}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  placeholder="teacher@example.com"
                  styles={getAuthInputStyles()}
                  type="email"
                  value={email}
                />
                <Text c="#696C7D" fz={12} lh="16px">
                  Enter the email associated with your account
                </Text>
              </Stack>

              <Button
                className={getActionButtonClassName(isEmailValid)}
                color="gray"
                disabled={!isEmailValid || forgotPasswordMutation.isPending}
                fullWidth
                onClick={handleSubmit}
                radius={14}
                size="md"
                styles={getActionButtonStyles()}
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>

              <Group justify="center">
                <Anchor
                  c="#6A6C7D"
                  component="button"
                  fw={500}
                  fz={14}
                  lh="20px"
                  onClick={() => navigate("/login/email")}
                  style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}
                  type="button"
                >
                  <ArrowLeftIcon />
                  Back to Login
                </Anchor>
              </Group>
            </>
          )}

          {isSubmitted && (
            <>
              <Stack align="center" gap={8}>
                <Center
                  h={64}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "rgba(21, 128, 61, 0.10)"
                  }}
                  w={64}
                >
                  <CheckCircleIcon />
                </Center>

                <Text c="#121421" fw={700} fz={22} lh="32px" ta="center">
                  Check Your Email
                </Text>
                <Text c="#696C7D" fw={500} fz={14} lh="20px" ta="center">
                  We&apos;ve sent password reset instructions to:
                </Text>
                <Text c="#151721" fw={600} fz={14} lh="20px" ta="center">
                  {submittedEmail}
                </Text>
              </Stack>

              <Box
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #D5D6DD",
                  backgroundColor: "rgba(15, 23, 42, 0.04)"
                }}
              >
                <Stack gap={8}>
                  <Text c="#151721" fw={600} fz={14} lh="20px">
                    Next Steps:
                  </Text>
                  <Text c="#6A6C7D" fz={14} lh="20px">
                    1. Check your email inbox
                  </Text>
                  <Text c="#6A6C7D" fz={14} lh="20px">
                    2. Click the reset link (valid for {resetTokenExpiresInMinutes} minutes)
                  </Text>
                  <Text c="#6A6C7D" fz={14} lh="20px">
                    3. Create a new password
                  </Text>
                </Stack>
              </Box>

              <Stack align="center" gap={8}>
                <Text c="#6A6C7D" fz={14} lh="20px" ta="center">
                  Didn&apos;t receive the email?
                </Text>
                <Anchor component="button" fw={600} fz={14} lh="20px" onClick={handleResend} type="button">
                  {forgotPasswordMutation.isPending ? "Sending..." : "Resend Email"}
                </Anchor>
              </Stack>

              <Button
                className={getActionButtonClassName(true)}
                color="gray"
                fullWidth
                onClick={() => navigate("/login/email")}
                radius={14}
                size="md"
                styles={getActionButtonStyles()}
              >
                <Group gap={8} justify="center" wrap="nowrap">
                  <ArrowLeftIcon />
                  <span>Back to Login</span>
                </Group>
              </Button>
            </>
          )}
        </Stack>
      </Card>
    </AuthLayout>
  );
};
