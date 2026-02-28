import type { ReactNode } from "react";
import { Box, Center, Stack, Text } from "@mantine/core";

type AuthLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  showTagline?: boolean;
};

export const AuthLayout = ({ children, footer, showTagline = true }: AuthLayoutProps): JSX.Element => (
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
          {showTagline && (
            <Text c="#6A6C7D" fw={500} fz={16} lh="24px" ta="center">
              Bridging Foundational Learning Gaps.
            </Text>
          )}
        </Stack>

        {children}
        {footer}
      </Stack>
    </Box>
  </main>
);
