import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { Role, type TeacherReportResponse, type SchoolReportResponse } from "@bridgeed/shared";
import { queryKeys } from "../query-keys";
import { getTeacherReport, getSchoolReport } from "../services/reports.service";

export const useTeacherReportQuery = (): UseQueryResult<TeacherReportResponse, Error> =>
  useQuery({
    queryKey: ["reports", "teacher"],
    queryFn: getTeacherReport
  });

export const useSchoolReportQuery = (): UseQueryResult<SchoolReportResponse, Error> =>
  useQuery({
    queryKey: ["reports", "school"],
    queryFn: getSchoolReport
  });
