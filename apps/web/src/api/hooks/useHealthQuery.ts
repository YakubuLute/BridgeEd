import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { HealthResponse } from "@bridgeed/shared";

import { queryKeys } from "../query-keys";
import { getHealth } from "../services/health.service";

type HealthQueryOptions = Omit<
  UseQueryOptions<HealthResponse, Error, HealthResponse, ReturnType<typeof queryKeys.system.health>>,
  "queryKey" | "queryFn"
>;

export const useHealthQuery = (
  options?: HealthQueryOptions
): UseQueryResult<HealthResponse, Error> =>
  useQuery({
    queryKey: queryKeys.system.health(),
    queryFn: getHealth,
    staleTime: 15_000,
    ...options
  });
