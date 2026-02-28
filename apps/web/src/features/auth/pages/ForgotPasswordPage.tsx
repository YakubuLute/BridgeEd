import { useState } from "react";
import { Anchor, Box, Button, Card, Center, Group, Input, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../AuthLayout";
import { ArrowLeftIcon, CheckCircleIcon, MailIcon } from "../AuthIcons";
import { validateEmail } from "../auth.constants";
import { authCardStyle, getActionButtonStyles, getAuthInputStyles } from "../auth.styles";

export const ForgotPasswordPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const isEmailValid = validateEmail(email);

  const handleSubmit = (): void => {
    if (!isEmailValid) {
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleResend = (): void => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
                color="gray"
                disabled={!isEmailValid || isLoading}
                fullWidth
                onClick={handleSubmit}
                radius={14}
                size="md"
                styles={getActionButtonStyles(isEmailValid)}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
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
                  {email}
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
                    2. Click the reset link (valid for 1 hour)
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
                  {isLoading ? "Sending..." : "Resend Email"}
                </Anchor>
              </Stack>

              <Button
                color="gray"
                fullWidth
                onClick={() => navigate("/login/email")}
                radius={14}
                size="md"
                styles={getActionButtonStyles(true)}
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
