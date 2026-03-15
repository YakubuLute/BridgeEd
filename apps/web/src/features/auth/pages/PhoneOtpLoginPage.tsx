import { useState } from "react";
import { Button, TextInput, Stack, Text, Group, Box, PinInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";

export const PhoneOtpLoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/teacher");
    }, 1000);
  };

  return (
    <AuthLayout
      title={step === "phone" ? "Welcome back" : "Verify Code"}
      subtitle={
        step === "phone"
          ? "Enter your phone number to sign in"
          : "Enter the 6-digit code sent to your phone"
      }
    >
      <Stack gap="xl">
        {step === "phone" ? (
          <>
            <TextInput
              label="Phone Number"
              placeholder="024 000 0000"
              size="lg"
              radius="md"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
            />
            <Button
              fullWidth
              size="xl"
              radius="md"
              bg="#ea580c"
              className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100"
              loading={loading}
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
                styles={{
                  input: {
                    border: "2px solid #E2E8F0",
                    height: "64px",
                    width: "56px",
                    fontSize: "24px",
                    fontWeight: 800
                  }
                }}
              />
            </Box>
            <Button
              fullWidth
              size="xl"
              radius="md"
              bg="#ea580c"
              className="hover:bg-[#c2410c] h-16 font-bold shadow-lg shadow-orange-100"
              loading={loading}
              onClick={handleVerifyOtp}
            >
              Verify & Sign In
            </Button>
            <Group justify="center">
              <Text fz="sm" fw={600} c="#64748b">
                Didn&apos;t receive a code?
              </Text>
              <Button
                variant="transparent"
                p={0}
                h="auto"
                fw={700}
                color="orange"
                onClick={() => setStep("phone")}
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
