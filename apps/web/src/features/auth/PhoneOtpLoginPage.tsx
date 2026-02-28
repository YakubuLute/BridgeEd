import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Group,
  Input,
  Stack,
  Text
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

const emptyOtp = (): string[] => Array.from({ length: OTP_LENGTH }, () => "");

const sanitizePhoneDigits = (value: string): string =>
  value.replace(/[^\d]/g, "").slice(0, PHONE_DIGIT_LIMIT);

const toE164Phone = (value: string): string => `${COUNTRY_CODE}${value.replace(/^0/, "")}`;

const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PhoneIcon = (): JSX.Element => (
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
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
    if (phoneNumber.length !== PHONE_DIGIT_LIMIT) {
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

  const handleChangeNumber = (): void => {
    setStep("phone");
    setOtp(emptyOtp());
    setOtpRequestId(null);
    setExpiresAtMs(null);
    setSecondsLeft(0);
    setFeedback(null);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
    >
      <Box style={{ width: "100%", maxWidth: "390px" }}>
        <Stack gap={32}>
          <Stack align="center" gap={16}>
            <Center
              h={72}
              style={{
                borderRadius: "50%",
                backgroundColor: "#070A24"
              }}
              w={72}
            >
              <Text c="white" fw={500} fz={28} lh="28px">
                B
              </Text>
            </Center>

            <Text c="#0B0D1D" fw={700} fz={22} lh="32px" ta="center">
              BridgeEd
            </Text>
            <Text c="#6A6C7D" fw={500} fz={16} lh="24px" ta="center">
              Bridging Foundational Learning Gaps.
            </Text>
          </Stack>

          <Card
            p={24}
            radius={16}
            style={{
              border: "1px solid #D5D6DD",
              backgroundColor: "#F7F7F9",
              boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.12)"
            }}
          >
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

                    <Group
                      gap={8}
                      px={16}
                      py={8}
                      style={{
                        minHeight: "64px",
                        borderRadius: "14px",
                        backgroundColor: "#E8E8ED"
                      }}
                      wrap="nowrap"
                    >
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

                    <Text c="#696C7D" fz={14} fw={500} lh="20px">
                      Enter your 10-digit mobile number
                    </Text>
                  </Stack>

                  <Button
                    color="gray"
                    disabled={phoneNumber.length < PHONE_DIGIT_LIMIT || requestOtpMutation.isPending}
                    fullWidth
                    onClick={handleSendOtp}
                    radius={14}
                    size="md"
                    styles={{
                      label: {
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 700
                      },
                      root: {
                        minHeight: "56px",
                        backgroundColor: "#868791"
                      }
                    }}
                  >
                    {requestOtpMutation.isPending ? "Sending..." : "Send OTP"}
                  </Button>

                  <Group justify="center">
                    <Anchor c="#1B1D2D" component="button" fw={700} fz={16} lh="24px" type="button">
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
                          inputMode="numeric"
                          maxLength={1}
                          onChange={(event) => handleOtpChange(index, event.currentTarget.value)}
                          onKeyDown={(event) => handleOtpKeyDown(index, event)}
                          ref={(node) => {
                            otpInputRefs.current[index] = node;
                          }}
                          styles={{
                            input: {
                              width: "48px",
                              height: "56px",
                              textAlign: "center",
                              fontSize: "20px",
                              lineHeight: "28px",
                              borderRadius: "12px",
                              border: "2px solid #D5D6DD",
                              backgroundColor: "#E8E8ED",
                              color: "#151721"
                            }
                          }}
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
                    color="gray"
                    disabled={otpValue.length !== OTP_LENGTH || verifyOtpMutation.isPending || otpExpired}
                    fullWidth
                    onClick={handleVerifyOtp}
                    radius={14}
                    size="md"
                    styles={{
                      label: {
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontWeight: 700
                      },
                      root: {
                        minHeight: "56px",
                        backgroundColor: "#868791"
                      }
                    }}
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
                      onClick={handleChangeNumber}
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
            </Stack>
          </Card>

          <Text c="#6A6C7D" fz={14} fw={500} lh="20px" ta="center">
            Secure login for authorized teachers only
          </Text>
        </Stack>
      </Box>
    </main>
  );
};
