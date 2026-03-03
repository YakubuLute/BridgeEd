import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { SchoolRecord } from "@bridgeed/shared";

import { queryKeys } from "../query-keys";
import { getSchoolById } from "../services/schools.service";

export const useSchoolDetailsQuery = (schoolId: string): UseQueryResult<SchoolRecord, Error> =>
  useQuery({
    queryKey: queryKeys.schools.detail(schoolId),
    queryFn: () => getSchoolById(schoolId),
    enabled: schoolId.trim().length > 0
  });
