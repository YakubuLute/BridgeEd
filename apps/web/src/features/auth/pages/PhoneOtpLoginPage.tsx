import { useState } from "react";
import { Button, TextInput, Stack, Text, Group, Box, PinInput, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useRequestOtpMutation, useVerifyOtpMutation } from "../../../api/hooks/useAuthMutations";
import { SESSION_STORAGE_KEY, sanitizePhoneDigits, toE164Phone } from "../auth.constants";
import { getPostLoginPath } from "../../../utils/role-routing";

export const PhoneOtpLoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestId, setRequestId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestOtpMutation = useRequestOtpMutation({
    onSuccess: (result) => {
      setRequestId(result.requestId);
      setStep("otp");
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
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
      navigate(getPostLoginPath(result.user), { replace: true });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Invalid verification code");
    }
  });

  const handleSendOtp = () => {
    setError(null);
    const sanitized = sanitizePhoneDigits(phoneNumber);
    if (sanitized.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    requestOtpMutation.mutate({ phoneNumber: toE164Phone(sanitized) });
  };

  const handleVerifyOtp = (value?: string) => {
    setError(null);
    const code = value ?? otp;
    if (code.length < 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    const sanitized = sanitizePhoneDigits(phoneNumber);
    verifyOtpMutation.mutate({
      phoneNumber: toE164Phone(sanitized),
      requestId,
      otp: code
    });
  };

  return (
    <AuthLayout
      subtitle={
        step === "phone"
          ? "Enter your phone number to sign in"
          : "Enter the 6-digit code sent to your phone"
      }
      title={step === "phone" ? "Welcome back" : "Verify Code"}
    >
      <Stack gap="xl">
        {error && (
          <Alert color="red" variant="light" radius="md">
            {error}
          </Alert>
        )}

        {step === "phone" ? (
          <>
            <TextInput
              label="Phone Number"
              placeholder="024 000 0000"
              size="lg"
              radius="md"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(sanitizePhoneDigits(e.target.value))}
              styles={{
                input: {
                  border: "2px solid #E2E8F0",
                  height: "60px",
                  fontSize: "18px",
                  fontWeight: 600
                },
                label: {
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }
              }}
              error={!!error}
            />
            <Button
              fullWidth
              size="xl"
              radius="md"
              bg="#ea580c"
              className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100"
              loading={requestOtpMutation.isPending}
              onClick={handleSendOtp}
            >
              Send OTP Code
            </Button>
          </>
        ) : (
          <>
            <Box className="flex justify-center">
              <PinInput
                size="xl"
                length={6}
                placeholder=""
                radius="md"
                type="number"
                value={otp}
                onChange={setOtp}
                onComplete={handleVerifyOtp}
                styles={{
                  input: {
                    border: "2px solid #E2E8F0",
                    height: "64px",
                    width: "56px",
                    fontSize: "24px",
                    fontWeight: 800
                  }
                }}
                autoFocus
              />
            </Box>
            <Button
              fullWidth
              size="xl"
              radius="md"
              bg="#ea580c"
              className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100"
              loading={verifyOtpMutation.isPending}
              onClick={() => handleVerifyOtp()}
            >
              Verify & Sign In
            </Button>
            <Group justify="center">
              <Text c="#64748b" fz="sm" fw={600}>
                Didn&apos;t receive a code?
              </Text>
              <Button
                variant="transparent"
                p={0}
                h="auto"
                fw={700}
                color="orange"
                onClick={() => setStep("phone")}
                disabled={requestOtpMutation.isPending}
              >
                Resend
              </Button>
            </Group>
          </>
        )}

        <Stack gap="sm" mt="xl">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
            <Text c="#94a3b8" fz="xs" fw={700} tt="uppercase">
              Or continue with
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
            onClick={() => navigate("/login/email")}
          >
            Email & Password
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
