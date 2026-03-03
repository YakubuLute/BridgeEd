import { useMemo, useState } from "react";
import { Alert, Button, Card, Group, Input, Stack, Text, Title } from "@mantine/core";
import { Role } from "@bridgeed/shared";

import { useSchoolDetailsQuery } from "../../../api/hooks/useSchoolQueries";
import { isApiClientError } from "../../../api/api";
import { readSession } from "../../../utils/session";
import { DashboardLayout } from "../components/DashboardLayout";

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

export const SchoolDetailsPage = (): JSX.Element => {
  const session = readSession();
  const role = session?.user.role ?? Role.SchoolAdmin;
  const scopedSchoolId = session?.user.scope?.schoolId?.trim() ?? "";

  const [lookupSchoolId, setLookupSchoolId] = useState<string>("");
  const [requestedSchoolId, setRequestedSchoolId] = useState<string>(
    role === Role.SchoolAdmin ? scopedSchoolId : ""
  );
  const [copyFeedback, setCopyFeedback] = useState<string>("");
  const [lookupError, setLookupError] = useState<string>("");

  const schoolQuery = useSchoolDetailsQuery(requestedSchoolId);
  const isSchoolAdmin = role === Role.SchoolAdmin;

  const queryErrorMessage = useMemo(() => {
    if (!schoolQuery.error) {
      return "";
    }

    if (isApiClientError(schoolQuery.error)) {
      return schoolQuery.error.message;
    }

    return schoolQuery.error.message;
  }, [schoolQuery.error]);

  const handleLoadSchool = (): void => {
    const normalizedSchoolId = lookupSchoolId.trim();
    setCopyFeedback("");
    setLookupError("");

    if (normalizedSchoolId.length === 0) {
      setLookupError("Enter a school identifier to load details.");
      return;
    }

    setRequestedSchoolId(normalizedSchoolId);
  };

  const handleCopySchoolIdentifier = async (): Promise<void> => {
    if (!schoolQuery.data) {
      return;
    }

    try {
      await navigator.clipboard.writeText(schoolQuery.data.schoolId);
      setCopyFeedback("School identifier copied.");
    } catch {
      setCopyFeedback("Unable to copy automatically. Select and copy manually.");
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Stack gap={6} mb={24}>
            <Title c="#121421" order={1} size="h1">
              School Details
            </Title>
            <Text c="#6A6C7D" fz={14}>
              View and share school identifier for teacher registration.
            </Text>
          </Stack>

          {isSchoolAdmin && !scopedSchoolId && (
            <Alert color="red" mb={16} title="Missing school scope" variant="light">
              Your account has no school scope configured. Contact a national administrator.
            </Alert>
          )}

          {!isSchoolAdmin && (
            <Card className="mb-4" p={16} radius={12} withBorder>
              <Stack gap={10}>
                <Text c="#121421" fw={600} fz={15}>
                  Lookup School by Identifier
                </Text>
                <Group align="end" grow>
                  <Input
                    onChange={(event) => setLookupSchoolId(event.currentTarget.value)}
                    placeholder="school-demo-001"
                    value={lookupSchoolId}
                  />
                  <Button onClick={handleLoadSchool}>Load School</Button>
                </Group>
                {lookupError && (
                  <Text c="#DC2626" fz={13}>
                    {lookupError}
                  </Text>
                )}
              </Stack>
            </Card>
          )}

          {schoolQuery.isLoading && (
            <Card p={16} radius={12} withBorder>
              <Text c="#6A6C7D" fz={14}>
                Loading school details...
              </Text>
            </Card>
          )}

          {queryErrorMessage && (
            <Alert color="red" title="Unable to load school details" variant="light">
              {queryErrorMessage}
            </Alert>
          )}

          {schoolQuery.data && (
            <Card p={20} radius={12} withBorder>
              <Stack gap={14}>
                <Group justify="space-between" align="start">
                  <Stack gap={2}>
                    <Text c="#121421" fw={700} fz={18}>
                      {schoolQuery.data.name}
                    </Text>
                    <Text c="#6A6C7D" fz={14}>
                      {schoolQuery.data.district} • {schoolQuery.data.region}
                    </Text>
                  </Stack>
                  <Text c={schoolQuery.data.isActive ? "#15803D" : "#B91C1C"} fz={13} fw={600}>
                    {schoolQuery.data.isActive ? "Active" : "Inactive"}
                  </Text>
                </Group>

                <Card p={14} radius={10} withBorder>
                  <Stack gap={8}>
                    <Text c="#6A6C7D" fz={12}>
                      School Identifier
                    </Text>
                    <Group justify="space-between" align="center">
                      <Text
                        c="#121421"
                        fz={16}
                        fw={700}
                        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                      >
                        {schoolQuery.data.schoolId}
                      </Text>
                      <Button onClick={() => void handleCopySchoolIdentifier()} size="xs" variant="light">
                        Copy
                      </Button>
                    </Group>
                    {copyFeedback && (
                      <Text c="#6A6C7D" fz={12}>
                        {copyFeedback}
                      </Text>
                    )}
                  </Stack>
                </Card>

                <Text c="#6A6C7D" fz={13}>
                  Created {formatDate(schoolQuery.data.createdAt)}
                </Text>
              </Stack>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
