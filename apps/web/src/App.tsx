import { Badge, Card, Container, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "./api/health";

const App = (): JSX.Element => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["api-health"],
    queryFn: fetchHealth,
    staleTime: 15_000
  });

  return (
    <main className="px-4 py-6 sm:px-6">
      <Container size="sm" px={0}>
        <Stack gap="lg">
          <Title order={1}>BridgeEd</Title>

          <Card shadow="sm" radius="md" withBorder>
            <Stack gap="xs">
              <Text fw={600}>API Status</Text>

              {isLoading && <Badge color="gray">Checking...</Badge>}
              {isError && <Badge color="red">Unavailable</Badge>}
              {data && (
                <Stack gap={4}>
                  <Badge color="green">{data.status}</Badge>
                  <Text size="sm" c="dimmed">
                    {data.name}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </main>
  );
};

export default App;
