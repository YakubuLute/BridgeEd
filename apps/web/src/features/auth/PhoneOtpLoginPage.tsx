import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Input,
  Loader,
  PinInput,
  Stack,
  Text,
  Title
} from "@mantine/core";

import { useRequestOtpMutation, useVerifyOtpMutation } from "../../api/hooks/useAuthMutations";

type Feedback = {
  tone: "error" | "success" | "info";
  message: string;
};

const COUNTRY_CODE = "+233";
const PHONE_DIGIT_LIMIT = 10;
const OTP_LENGTH = 6;
const SESSION_STORAGE_KEY = "bridgeed.session";
const DEFAULT_OTP_EXPIRY_SECONDS = 300;

const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const sanitizeDigits = (value: string): string =>
  value.replace(/[^\d]/g, "").slice(0, PHONE_DIGIT_LIMIT);

const toE164Phone = (value: string): string => `${COUNTRY_CODE}${value.replace(/^0/, "")}`;

const PhoneIcon = (): JSX.Element => (
  <svg
    aria-hidden="true"
    fill="none"
    height="30"
    viewBox="0 0 24 24"
    width="30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6 14.8C14.9 14.6 14 14.8 13.4 15.2L12.5 15.8C9.9 14.5 8 12.1 7 9.4L7.8 8.8C8.3 8.4 8.6 7.7 8.6 7C8.6 6.4 8.2 5.5 7.9 4.8L7.5 4C7.1 3.1 6.1 2.6 5.1 2.8L3.9 3.1C2.8 3.4 2 4.4 2 5.6C2 15.2 9.8 23 19.4 23C20.6 23 21.6 22.2 21.9 21.1L22.2 19.9C22.4 18.9 21.9 17.9 21 17.5L20.2 17.1C19.5 16.8 18.6 16.4 18 16.4C17.3 16.4 16.6 16.7 16.2 17.2L15.6 18C15.2 18.6 14.5 18.9 13.8 18.7"
      stroke="#7B7C8D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

export const PhoneOtpLoginPage = (): JSX.Element => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const configuredExpiry = useMemo(() => {
    const parsedValue = Number(import.meta.env.VITE_OTP_EXPIRY_SECONDS ?? DEFAULT_OTP_EXPIRY_SECONDS);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return DEFAULT_OTP_EXPIRY_SECONDS;
    }

    return Math.floor(parsedValue);
  }, []);

  const otpExpired = Boolean(otpRequestId) && secondsLeft <= 0;

  const requestOtpMutation = useRequestOtpMutation({
    onSuccess: (result) => {
      const expirySeconds = result.expiresInSeconds ?? configuredExpiry;
      setOtpRequestId(result.requestId);
      setSecondsLeft(expirySeconds);
      setExpiresAtMs(Date.now() + expirySeconds * 1000);
      setOtpCode("");
      setFeedback({
        tone: "info",
        message: `OTP sent to ${COUNTRY_CODE} ${phoneNumber}. It will expire in ${Math.round(
          expirySeconds / 60
        )} minute(s).`
      });
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
    if (!expiresAtMs) {
      return;
    }

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      setSecondsLeft(remaining);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAtMs]);

  const handleSendOtp = (): void => {
    if (phoneNumber.length !== PHONE_DIGIT_LIMIT) {
      setFeedback({
        tone: "error",
        message: "Enter a valid 10-digit mobile number before requesting OTP."
      });
      return;
    }

    setFeedback(null);
    requestOtpMutation.mutate({ phoneNumber: toE164Phone(phoneNumber) });
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

    if (otpCode.length !== OTP_LENGTH) {
      setFeedback({
        tone: "error",
        message: "Enter the 6-digit OTP."
      });
      return;
    }

    setFeedback(null);
    verifyOtpMutation.mutate({
      phoneNumber: toE164Phone(phoneNumber),
      requestId: otpRequestId,
      otp: otpCode
    });
  };

  const handleResendOtp = (): void => {
    if (phoneNumber.length !== PHONE_DIGIT_LIMIT) {
      setFeedback({
        tone: "error",
        message: "Enter your 10-digit mobile number before resending OTP."
      });
      return;
    }

    setFeedback(null);
    requestOtpMutation.mutate({ phoneNumber: toE164Phone(phoneNumber) });
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <Container px={0} size={500}>
        <Stack align="center" gap={48}>
          <Stack align="center" gap="sm">
            <Center
              h={112}
              style={{
                borderRadius: "50%",
                backgroundColor: "#070A24"
              }}
              w={112}
            >
              <Text c="white" fw={500} fz={58} lh={1}>
                B
              </Text>
            </Center>

            <Title c="#0B0D1D" fw={700} order={1} ta="center">
              BridgeEd
            </Title>
            <Text c="#6A6C7D" fw={500} fz={38} ta="center">
              Bridging Foundational Learning Gaps.
            </Text>
          </Stack>

          <Card
            p={{ base: "xl", sm: 44 }}
            radius={20}
            shadow="sm"
            style={{
              width: "100%",
              border: "1px solid #D5D6DD",
              backgroundColor: "#F7F7F9"
            }}
          >
            <Stack gap={30}>
              <Stack align="center" gap="xs">
                <Title c="#121421" fw={700} order={2} ta="center">
                  Welcome Back
                </Title>
                <Text c="#696C7D" fw={500} fz={24} maw={470} ta="center">
                  Enter your phone number to receive a one-time password
                </Text>
              </Stack>

              <Box>
                <Text c="#151721" fw={700} fz={24} mb={14}>
                  Phone Number
                </Text>
                <Group
                  gap="sm"
                  px="lg"
                  py="md"
                  style={{
                    minHeight: "88px",
                    borderRadius: "18px",
                    backgroundColor: "#E8E8ED"
                  }}
                  wrap="nowrap"
                >
                  <PhoneIcon />
                  <Text c="#151721" fw={500} fz={34}>
                    {COUNTRY_CODE}
                  </Text>
                  <Input
                    aria-label="Phone number"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={PHONE_DIGIT_LIMIT}
                    onChange={(event) => {
                      setPhoneNumber(sanitizeDigits(event.currentTarget.value));
                      if (feedback?.tone === "error") {
                        setFeedback(null);
                      }
                    }}
                    pattern="[0-9]*"
                    placeholder="XX XXX XXXX"
                    styles={{
                      input: {
                        height: 60,
                        fontSize: "2rem",
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
                <Text c="#696C7D" fz={18} fw={500} mt={12}>
                  Enter your 10-digit mobile number
                </Text>
              </Box>

              {feedback && (
                <Alert
                  color={
                    feedback.tone === "error"
                      ? "red"
                      : feedback.tone === "success"
                        ? "teal"
                        : "blue"
                  }
                  radius="md"
                  variant="light"
                >
                  {feedback.message}
                </Alert>
              )}

              <Button
                color="gray"
                disabled={requestOtpMutation.isPending}
                fullWidth
                onClick={handleSendOtp}
                radius={18}
                size="xl"
                styles={{
                  label: {
                    fontSize: "2rem",
                    fontWeight: 700
                  },
                  root: {
                    minHeight: "88px",
                    backgroundColor: "#868791"
                  }
                }}
              >
                {requestOtpMutation.isPending ? <Loader color="white" size="sm" /> : "Send OTP"}
              </Button>

              {otpRequestId && (
                <Stack gap="xs">
                  <Text c="#151721" fw={700} fz={22}>
                    Enter OTP
                  </Text>
                  <PinInput
                    aria-label="One-time password input"
                    inputMode="numeric"
                    length={OTP_LENGTH}
                    onChange={(value) => {
                      setOtpCode(value);
                      if (feedback?.tone === "error") {
                        setFeedback(null);
                      }
                    }}
                    oneTimeCode
                    size="lg"
                    styles={{
                      input: {
                        minHeight: "62px",
                        width: "100%",
                        fontSize: "1.6rem"
                      },
                      root: {
                        display: "grid",
                        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                        gap: "0.5rem"
                      }
                    }}
                    type="number"
                    value={otpCode}
                  />
                  <Group justify="space-between" mt={4}>
                    <Text c={otpExpired ? "red" : "#696C7D"} fz={16} fw={500}>
                      {otpExpired ? "OTP expired." : `Expires in ${formatCountdown(secondsLeft)}`}
                    </Text>
                    <Anchor c="#1B1D2D" component="button" fw={600} onClick={handleResendOtp} type="button">
                      Resend OTP
                    </Anchor>
                  </Group>
                  <Button
                    color="dark"
                    disabled={verifyOtpMutation.isPending}
                    fullWidth
                    mt="xs"
                    onClick={handleVerifyOtp}
                    radius={16}
                    size="lg"
                  >
                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                  </Button>
                </Stack>
              )}

              <Button color="dark" fw={700} size="lg" variant="subtle">
                Login with Email
              </Button>
            </Stack>
          </Card>

          <Text c="#6A6C7D" fz={22} fw={500} ta="center">
            Secure login for authorized teachers only
          </Text>
        </Stack>
      </Container>
    </main>
  );
};
