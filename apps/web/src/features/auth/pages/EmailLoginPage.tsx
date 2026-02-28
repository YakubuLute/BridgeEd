import { useMemo, useState } from "react";
import { Alert, Anchor, Button, Card, Group, Input, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../AuthLayout";
import { AlertCircleIcon, LockIcon, MailIcon } from "../AuthIcons";
import {
  LOCKOUT_DURATION_MINUTES,
  MAX_LOGIN_ATTEMPTS,
  SESSION_STORAGE_KEY,
  getPasswordStrength,
  requirementColor,
  validateEmail,
  validatePassword
} from "../auth.constants";
import { authCardStyle, getActionButtonStyles, getAuthInputStyles } from "../auth.styles";

const DEMO_LOGIN_EMAIL = "teacher@bridgeed.gh";
const DEMO_LOGIN_PASSWORD = "Teacher123";

export const EmailLoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const isFormValid = validateEmail(email) && passwordValidation.isValid && !isLockedOut;

  const handleLogin = (): void => {
    setError("");
    setSuccess("");

    if (isLockedOut) {
      setError(`Account locked. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);

      const loginSuccess = email === DEMO_LOGIN_EMAIL && password === DEMO_LOGIN_PASSWORD;
      if (loginSuccess) {
        setFailedAttempts(0);
        sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({
            accessToken: "email-login-demo-session",
            user: {
              role: "teacher",
              name: email
            },
            loginAt: new Date().toISOString()
          })
        );
        setSuccess("Login successful. A secure session has been created.");
        return;
      }

      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsLockedOut(true);
        setError(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION_MINUTES} minutes.`);
        return;
      }

      setError(
        `Invalid email or password. ${MAX_LOGIN_ATTEMPTS - newFailedAttempts} attempt(s) remaining.`
      );
    }, 1000);
  };

  return (
    <AuthLayout
      footer={
        <Stack align="center" gap={4}>
          <Text c="#6A6C7D" fz={14} fw={500} lh="20px" ta="center">
            Secure login for authorized teachers only
          </Text>
          {isLockedOut && (
            <Text c="#DC2626" fz={12} lh="16px" ta="center">
              For security assistance, contact your administrator
            </Text>
          )}
        </Stack>
      }
    >
      <Card p={24} radius={16} style={authCardStyle}>
        <Stack gap={24}>
          <Stack align="center" gap={8}>
            <Text c="#121421" fw={700} fz={22} lh="32px" ta="center">
              Email Login
            </Text>
            <Text c="#696C7D" fw={500} fz={16} lh="24px" ta="center">
              Enter your credentials to access your account
            </Text>
          </Stack>

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

          {failedAttempts > 0 && !isLockedOut && (
            <Alert
              color="yellow"
              radius="md"
              styles={{
                message: {
                  fontSize: "14px",
                  lineHeight: "20px"
                }
              }}
              variant="light"
            >
              Warning: {MAX_LOGIN_ATTEMPTS - failedAttempts} attempt(s) remaining before lockout
            </Alert>
          )}

          {success && (
            <Alert
              color="teal"
              radius="md"
              styles={{
                message: {
                  fontSize: "14px",
                  lineHeight: "20px"
                }
              }}
              variant="light"
            >
              {success}
            </Alert>
          )}

          <Stack gap={8}>
            <Text c="#151721" fw={700} fz={16} lh="24px">
              Email Address
            </Text>
            <Input
              disabled={isLockedOut}
              leftSection={<MailIcon />}
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="teacher@example.com"
              styles={getAuthInputStyles()}
              type="email"
              value={email}
            />
          </Stack>

          <Stack gap={8}>
            <Text c="#151721" fw={700} fz={16} lh="24px">
              Password
            </Text>
            <Input
              disabled={isLockedOut}
              leftSection={<LockIcon />}
              onChange={(event) => setPassword(event.currentTarget.value)}
              placeholder="Enter your password"
              rightSection={
                <Anchor
                  component="button"
                  fw={600}
                  fz={12}
                  lh="16px"
                  onClick={() => setShowPassword((value) => !value)}
                  style={{ color: "#1B1D2D" }}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </Anchor>
              }
              rightSectionWidth={52}
              styles={getAuthInputStyles()}
              type={showPassword ? "text" : "password"}
              value={password}
            />
          </Stack>

          {password.length > 0 && (
            <Stack gap={8}>
              {passwordStrength && (
                <Text c="#6A6C7D" fz={14} fw={500} lh="20px">
                  Password strength:{" "}
                  <Text c={passwordStrength.color} component="span" fz={14} fw={600} lh="20px">
                    {passwordStrength.label}
                  </Text>
                </Text>
              )}

              <Stack gap={4}>
                <Text c={requirementColor(passwordValidation.minLength)} fz={12} lh="16px">
                  {passwordValidation.minLength ? "✓" : "○"} At least 8 characters
                </Text>
                <Text c={requirementColor(passwordValidation.hasUpperCase)} fz={12} lh="16px">
                  {passwordValidation.hasUpperCase ? "✓" : "○"} One uppercase letter
                </Text>
                <Text c={requirementColor(passwordValidation.hasLowerCase)} fz={12} lh="16px">
                  {passwordValidation.hasLowerCase ? "✓" : "○"} One lowercase letter
                </Text>
                <Text c={requirementColor(passwordValidation.hasNumber)} fz={12} lh="16px">
                  {passwordValidation.hasNumber ? "✓" : "○"} One number
                </Text>
              </Stack>
            </Stack>
          )}

          <Group justify="flex-end">
            <Anchor
              component="button"
              fw={600}
              fz={14}
              lh="20px"
              onClick={() => navigate("/forgot-password")}
              type="button"
            >
              Forgot Password?
            </Anchor>
          </Group>

          <Button
            color="gray"
            disabled={!email || !password || isLoading || isLockedOut}
            fullWidth
            onClick={handleLogin}
            radius={14}
            size="md"
            styles={getActionButtonStyles(isFormValid)}
          >
            {isLoading ? "Logging in..." : isLockedOut ? "Account Locked" : "Login"}
          </Button>

          <Group justify="center">
            <Anchor
              c="#6A6C7D"
              component="button"
              fw={500}
              fz={14}
              lh="20px"
              onClick={() => navigate("/")}
              type="button"
            >
              ← Back to Phone Login
            </Anchor>
          </Group>
        </Stack>
      </Card>
    </AuthLayout>
  );
};
