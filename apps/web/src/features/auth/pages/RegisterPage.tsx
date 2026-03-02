import { useMemo, useState } from "react";
import { Alert, Anchor, Button, Card, Group, Input, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useRegisterEmailMutation } from "../../../api/hooks/useAuthMutations";
import { AuthLayout } from "../AuthLayout";
import { AlertCircleIcon, LockIcon, MailIcon } from "../AuthIcons";
import {
  SESSION_STORAGE_KEY,
  getPasswordStrength,
  requirementColor,
  validateEmail,
  validatePassword
} from "../auth.constants";
import {
  authCardStyle,
  authInputClassNames,
  getActionButtonClassName,
  getActionButtonStyles,
  getAuthInputStyles
} from "../auth.styles";

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const isFormValid =
    name.trim().length > 0 &&
    schoolId.trim().length > 0 &&
    validateEmail(email) &&
    passwordValidation.isValid &&
    passwordsMatch;

  const registerMutation = useRegisterEmailMutation({
    onSuccess: (result) => {
      setError("");
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

      navigate("/role-selection", { replace: true });
    },
    onError: (mutationError) => {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to create account right now.");
    }
  });

  const handleRegister = (): void => {
    setError("");

    if (name.trim().length === 0) {
      setError("Full name is required.");
      return;
    }

    if (schoolId.trim().length === 0) {
      setError("School identifier is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Password confirmation does not match.");
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      schoolId: schoolId.trim(),
      email: email.trim().toLowerCase(),
      password
    });
  };

  return (
    <AuthLayout
      footer={
        <Text c="#6A6C7D" fz={14} fw={500} lh="20px" ta="center">
          Already have an account?{" "}
          <Anchor component="button" fw={600} onClick={() => navigate("/login/email")} type="button">
            Sign in
          </Anchor>
        </Text>
      }
    >
      <Card p={24} radius={16} style={authCardStyle}>
        <Stack gap={20}>
          <Stack align="center" gap={8}>
            <Text c="#121421" fw={700} fz={22} lh="32px" ta="center">
              Create Teacher Account
            </Text>
            <Text c="#696C7D" fw={500} fz={16} lh="24px" ta="center">
              Register with your school identifier
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

          <Stack gap={8}>
            <Text c="#151721" fw={700} fz={16} lh="24px">
              Full Name
            </Text>
            <Input
              classNames={authInputClassNames}
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Kwame Mensah"
              styles={getAuthInputStyles()}
              value={name}
            />
          </Stack>

          <Stack gap={8}>
            <Text c="#151721" fw={700} fz={16} lh="24px">
              School Identifier
            </Text>
            <Input
              classNames={authInputClassNames}
              onChange={(event) => setSchoolId(event.currentTarget.value)}
              placeholder="school-demo-001"
              styles={getAuthInputStyles()}
              value={schoolId}
            />
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
          </Stack>

          <Stack gap={8}>
            <Text c="#151721" fw={700} fz={16} lh="24px">
              Password
            </Text>
            <Input
              classNames={authInputClassNames}
              leftSection={<LockIcon />}
              onChange={(event) => setPassword(event.currentTarget.value)}
              placeholder="Create password"
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

          <Stack gap={8}>
            <Text c="#151721" fw={700} fz={16} lh="24px">
              Confirm Password
            </Text>
            <Input
              classNames={authInputClassNames}
              leftSection={<LockIcon />}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              placeholder="Re-enter password"
              styles={getAuthInputStyles()}
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
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
                <Text c={requirementColor(passwordsMatch)} fz={12} lh="16px">
                  {passwordsMatch ? "✓" : "○"} Password confirmation matches
                </Text>
              </Stack>
            </Stack>
          )}

          <Button
            className={getActionButtonClassName(isFormValid)}
            color="gray"
            disabled={!isFormValid || registerMutation.isPending}
            fullWidth
            onClick={handleRegister}
            radius={14}
            size="md"
            styles={getActionButtonStyles()}
          >
            {registerMutation.isPending ? "Creating account..." : "Create Account"}
          </Button>

          <Group justify="center">
            <Anchor component="button" fw={600} fz={14} lh="20px" onClick={() => navigate("/")} type="button">
              Back to Phone Login
            </Anchor>
          </Group>
        </Stack>
      </Card>
    </AuthLayout>
  );
};
