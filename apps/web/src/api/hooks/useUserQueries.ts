import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { UserProfile, UpdateProfileRequest } from "@bridgeed/shared";
import { getProfile, updateProfile } from "../services/user.service";

export const useProfileQuery = (): UseQueryResult<UserProfile, Error> =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile
  });

export const useUpdateProfileMutation = (): UseMutationResult<UserProfile, Error, UpdateProfileRequest> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};
