import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ActivityResponse } from "@bridgeed/shared";

import { queryKeys } from "../query-keys";
import { getActivity } from "../services/activity.service";

export const useActivityQuery = (): UseQueryResult<ActivityResponse, Error> =>
  useQuery({
    queryKey: queryKeys.activity.list(),
    queryFn: getActivity
  });
