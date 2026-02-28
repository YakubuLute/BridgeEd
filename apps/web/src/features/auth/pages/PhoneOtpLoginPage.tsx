import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Alert, Anchor, Box, Button, Card, Group, Input, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { useRequestOtpMutation, useVerifyOtpMutation } from "../../../api/hooks/useAuthMutations";
import { AuthLayout } from "../AuthLayout";
import { PhoneIcon } from "../AuthIcons";
import {
  COUNTRY_CODE,
  DEFAULT_OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
  PHONE_DIGIT_LIMIT,
  SESSION_STORAGE_KEY,
  emptyOtp,
  formatCountdown,
  sanitizePhoneDigits,
  toE164Phone
} from "../auth.constants";
import {
  authCardStyle,
  authOtpInputClassNames,
  getActionButtonClassName,
  getActionButtonStyles,
  getOtpDigitStyles
} from "../auth.styles";

type Feedback = {
  tone: "error" | "success" | "info";
  message: string;
};

export const PhoneOtpLoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const configuredExpiry = useMemo(() => {
    const parsedValue = Number(import.meta.env.VITE_OTP_EXPIRY_SECONDS ?? DEFAULT_OTP_EXPIRY_SECONDS);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return DEFAULT_OTP_EXPIRY_SECONDS;
    }

    return Math.floor(parsedValue);
  }, []);

  const otpExpired = step === "otp" && secondsLeft <= 0;
  const otpValue = otp.join("");
  const isPhoneValid = phoneNumber.length === PHONE_DIGIT_LIMIT;
  const isOtpValid = otpValue.length === OTP_LENGTH && !otpExpired;

  const requestOtpMutation = useRequestOtpMutation({
    onSuccess: (result) => {
      const expirySeconds = result.expiresInSeconds ?? configuredExpiry;
      setStep("otp");
      setOtpRequestId(result.requestId);
      setExpiresAtMs(Date.now() + expirySeconds * 1000);
      setSecondsLeft(expirySeconds);
      setOtp(emptyOtp());
      setFeedback({
        tone: "info",
        message: `OTP sent to ${COUNTRY_CODE} ${phoneNumber}. Expires in ${formatCountdown(expirySeconds)}.`
      });
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 0);
    },
    onError: (error) => {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to send OTP right now."
      });
    }
  });

  const verifyOtpMutation = useVerifyOtpMutation({
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

      setFeedback({
        tone: "success",
        message: "Login successful. A secure session has been created."
      });
    },
    onError: (error) => {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Invalid OTP. Please try again."
      });
    }
  });

  useEffect(() => {
    if (!expiresAtMs || step !== "otp") {
      return;
    }

    const timer = window.setInterval(() => {
      const remainingSeconds = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      setSecondsLeft(remainingSeconds);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAtMs, step]);

  const resetPhoneFlow = (): void => {
    setStep("phone");
    setOtp(emptyOtp());
    setOtpRequestId(null);
    setExpiresAtMs(null);
    setSecondsLeft(0);
    setFeedback(null);
  };

  const handleSendOtp = (): void => {
    if (!isPhoneValid) {
      setFeedback({
        tone: "error",
        message: "Enter a valid 10-digit mobile number before requesting OTP."
      });
      return;
    }

    setFeedback(null);
    requestOtpMutation.mutate({ phoneNumber: toE164Phone(phoneNumber) });
  };

  const handleOtpChange = (index: number, value: string): void => {
    const digit = value.replace(/[^\d]/g, "").slice(0, 1);

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      nextOtp[index] = digit;
      return nextOtp;
    });

    if (feedback?.tone === "error") {
      setFeedback(null);
    }

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (): void => {
    if (!otpRequestId) {
      setFeedback({
        tone: "error",
        message: "Request OTP first."
      });
      return;
    }

    if (otpExpired) {
      setFeedback({
        tone: "error",
        message: "OTP has expired. Request a new code."
      });
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      setFeedback({
        tone: "error",
        message: "Enter the complete 6-digit OTP."
      });
      return;
    }

    setFeedback(null);
    verifyOtpMutation.mutate({
      phoneNumber: toE164Phone(phoneNumber),
      requestId: otpRequestId,
      otp: otpValue
    });
  };

  const handleResendOtp = (): void => {
    if (!isPhoneValid) {
      setFeedback({
        tone: "error",
        message: "Enter your 10-digit mobile number before resending OTP."
      });
      return;
    }

    setFeedback(null);
    setOtp(emptyOtp());
    requestOtpMutation.mutate({ phoneNumber: toE164Phone(phoneNumber) });
  };

  return (
    <AuthLayout
      footer={
        <Text c="#6A6C7D" fz={14} fw={500} lh="20px" ta="center">
          Secure login for authorized teachers only
        </Text>
      }
    >
      <Card p={24} radius={16} style={authCardStyle}>
        <Stack gap={24}>
          {step === "phone" && (
            <>
              <Stack align="center" gap={8}>
                <Text c="#121421" fw={700} fz={22} lh="32px" ta="center">
                  Welcome Back
                </Text>
                <Text c="#696C7D" fw={500} fz={16} lh="24px" ta="center">
                  Enter your phone number to receive a one-time password
                </Text>
              </Stack>

              <Stack gap={8}>
                <Text c="#151721" fw={700} fz={16} lh="24px">
                  Phone Number
                </Text>

                <Box className="auth-phone-field">
                  <Group gap={8} h={60} px={16} wrap="nowrap">
                    <PhoneIcon />
                    <Text c="#151721" fw={500} fz={20} lh="28px">
                      {COUNTRY_CODE}
                    </Text>
                    <Input
                      aria-label="Phone number"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      maxLength={PHONE_DIGIT_LIMIT}
                      onChange={(event) => {
                        setPhoneNumber(sanitizePhoneDigits(event.currentTarget.value));
                        if (feedback?.tone === "error") {
                          setFeedback(null);
                        }
                      }}
                      placeholder="XX XXX XXXX"
                      styles={{
                        input: {
                          height: "48px",
                          fontSize: "20px",
                          lineHeight: "28px",
                          color: "#757684",
                          background: "transparent",
                          border: "none",
                          width: "100%"
                        }
                      }}
                      value={phoneNumber}
                      variant="unstyled"
                    />
                  </Group>
                </Box>

                <Text c="#696C7D" fz={14} fw={500} lh="20px">
                  Enter your 10-digit mobile number
                </Text>
              </Stack>

              <Button
                className={getActionButtonClassName(isPhoneValid)}
                color="gray"
                disabled={!isPhoneValid || requestOtpMutation.isPending}
                fullWidth
                onClick={handleSendOtp}
                radius={14}
                size="md"
                styles={getActionButtonStyles()}
              >
                {requestOtpMutation.isPending ? "Sending..." : "Send OTP"}
              </Button>

              <Group justify="center">
                <Anchor
                  c="#1B1D2D"
                  component="button"
                  fw={700}
                  fz={16}
                  lh="24px"
                  onClick={() => navigate("/login/email")}
                  type="button"
                >
                  Login with Email
                </Anchor>
              </Group>
            </>
          )}

          {step === "otp" && (
            <>
              <Stack align="center" gap={8}>
                <Text c="#121421" fw={700} fz={22} lh="32px" ta="center">
                  Verify Code
                </Text>
                <Text c="#696C7D" fw={500} fz={16} lh="24px" ta="center">
                  Enter the 6-digit code sent to
                </Text>
                <Text c="#151721" fw={600} fz={16} lh="24px" ta="center">
                  {COUNTRY_CODE} {phoneNumber}
                </Text>
              </Stack>

              <Stack gap={16}>
                <Group gap={8} justify="center" wrap="nowrap">
                  {otp.map((digit, index) => (
                    <Input
                      key={`otp-${index}`}
                      aria-label={`OTP digit ${index + 1}`}
                      classNames={authOtpInputClassNames}
                      inputMode="numeric"
                      maxLength={1}
                      onChange={(event) => handleOtpChange(index, event.currentTarget.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      ref={(node) => {
                        otpInputRefs.current[index] = node;
                      }}
                      styles={getOtpDigitStyles()}
                      type="tel"
                      value={digit}
                    />
                  ))}
                </Group>

                <Stack align="center" gap={4}>
                  <Text c={otpExpired ? "red" : "#696C7D"} fz={14} fw={500} lh="20px" ta="center">
                    {otpExpired ? "OTP expired." : `Expires in ${formatCountdown(secondsLeft)}`}
                  </Text>
                  <Anchor
                    c="#1B1D2D"
                    component="button"
                    fw={600}
                    fz={14}
                    lh="20px"
                    onClick={handleResendOtp}
                    type="button"
                  >
                    Resend OTP
                  </Anchor>
                </Stack>
              </Stack>

              <Button
                className={getActionButtonClassName(isOtpValid)}
                color="gray"
                disabled={!isOtpValid || verifyOtpMutation.isPending}
                fullWidth
                onClick={handleVerifyOtp}
                radius={14}
                size="md"
                styles={getActionButtonStyles()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
              </Button>

              <Group justify="center">
                <Anchor
                  c="#696C7D"
                  component="button"
                  fw={500}
                  fz={14}
                  lh="20px"
                  onClick={resetPhoneFlow}
                  type="button"
                >
                  Change Phone Number
                </Anchor>
              </Group>
            </>
          )}

          {feedback && (
            <Alert
              color={
                feedback.tone === "error" ? "red" : feedback.tone === "success" ? "teal" : "blue"
              }
              radius="md"
              variant="light"
            >
              {feedback.message}
            </Alert>
          )}
        </Stack>
      </Card>
    </AuthLayout>
  );
};
