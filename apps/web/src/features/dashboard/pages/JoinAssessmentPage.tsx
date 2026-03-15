import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Title, 
  Text, 
  Stack, 
  Group, 
  Paper, 
  Button, 
  TextInput, 
  Center, 
  Box,
  Alert
} from "@mantine/core";

// --- Icons ---
const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const JoinAssessmentPage = (): JSX.Element => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (code.length !== 6) {
      setError("Please enter a valid 6-character code.");
      return;
    }
    navigate(`/join/${code.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center p-6">
      <Paper p={40} radius="24px" className="w-full max-w-md border border-[#e2e8f0] shadow-xl bg-white">
        <Stack gap="xl" align="center">
          <Box className="w-16 h-16 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-orange-100">
            <IconZap />
          </Box>
          
          <Stack gap={8} align="center">
            <Title order={1} className="text-3xl font-black text-[#1e293b] tracking-tight">
              Join Assessment
            </Title>
            <Text c="#64748b" fw={600} ta="center">
              Enter the 6-character code provided by your teacher to start the session.
            </Text>
          </Stack>

          <TextInput
            placeholder="E.g. READ42"
            size="xl"
            radius="md"
            className="w-full"
            styles={{ input: { textAlign: 'center', fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', height: '64px' } }}
            value={code}
            onChange={(e) => {
              setCode(e.currentTarget.value.toUpperCase());
              setError(null);
            }}
            maxLength={6}
          />

          {error && (
            <Alert color="red" radius="md" className="w-full">
              {error}
            </Alert>
          )}

          <Button
            bg="#ea580c"
            size="xl"
            radius="md"
            fullWidth
            className="hover:bg-[#c2410c] font-black h-16"
            onClick={handleJoin}
            disabled={code.length !== 6}
          >
            Start Assessment
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};
