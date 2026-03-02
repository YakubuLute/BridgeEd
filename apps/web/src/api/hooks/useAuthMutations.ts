import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions, UseMutationResult } from "@tanstack/react-query";

import { queryKeys } from "../query-keys";
import {
  loginWithEmail,
  requestOtp,
  requestPasswordReset,
  readEmailLoginErrorDetails,
  verifyOtp,
  type EmailLoginInput,
  type EmailLoginResult,
  type ForgotPasswordInput,
  type ForgotPasswordResult,
  type RequestOtpInput,
  type RequestOtpResult,
  type VerifyOtpInput,
  type VerifyOtpResult
} from "../services/auth.service";

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>;

export const useRequestOtpMutation = (
  options?: MutationOptions<RequestOtpResult, RequestOtpInput>
): UseMutationResult<RequestOtpResult, Error, RequestOtpInput> =>
  useMutation({
    mutationKey: queryKeys.auth.requestOtp(),
    mutationFn: requestOtp,
    ...options
  });

export const useVerifyOtpMutation = (
  options?: MutationOptions<VerifyOtpResult, VerifyOtpInput>
): UseMutationResult<VerifyOtpResult, Error, VerifyOtpInput> =>
  useMutation({
    mutationKey: queryKeys.auth.verifyOtp(),
    mutationFn: verifyOtp,
    ...options
  });

export const useEmailLoginMutation = (
  options?: MutationOptions<EmailLoginResult, EmailLoginInput>
): UseMutationResult<EmailLoginResult, Error, EmailLoginInput> =>
  useMutation({
    mutationKey: queryKeys.auth.emailLogin(),
    mutationFn: loginWithEmail,
    ...options
  });

export const useForgotPasswordMutation = (
  options?: MutationOptions<ForgotPasswordResult, ForgotPasswordInput>
): UseMutationResult<ForgotPasswordResult, Error, ForgotPasswordInput> =>
  useMutation({
    mutationKey: queryKeys.auth.forgotPassword(),
    mutationFn: requestPasswordReset,
    ...options
  });

export { readEmailLoginErrorDetails };
