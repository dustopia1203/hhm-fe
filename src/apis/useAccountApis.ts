import { authClient, publicClient } from "./axiosClient.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import resourceUrls from "@constants/resourceUrls.ts";

// Login API
interface LoginRequest {
  credential: string;
  password: string;
  rememberMe: boolean;
}

async function login(data: LoginRequest) {
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.LOGIN, data);

  return response.data;
}

function useLoginApi() {
  return useMutation({
    mutationFn: login,
  });
}

// Register API
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

async function register(data: RegisterRequest) {
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.REGISTER, data);

  return response.data;
}

function useRegisterApi() {
  return useMutation({
    mutationFn: register,
  });
}

// Active account by activation code API
interface ActiveAccountRequest {
  credential: string;
  activationCode: string;
}

async function activeAccount(data: ActiveAccountRequest) {
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.ACTIVE_ACCOUNT, data);

  return response.data;
}

function useActiveAccountApi() {
  return useMutation({
    mutationFn: activeAccount,
  });
}

// Get account profile API
async function getAccountProfile() {
  const response = await authClient.get(resourceUrls.ACCOUNT_RESOURCE.GET_PROFILE);

  return response.data;
}

function useGetAccountProfileApi(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["accountProfile"],
    queryFn: getAccountProfile,
    enabled: options?.enabled ?? true
  });
}

// Google Login API
async function loginGoogle(code: string) {
  const response = await publicClient.get(`${resourceUrls.ACCOUNT_RESOURCE.LOGIN_GOOGLE}?code=${code}`);
  return response.data;
}

function useGoogleLoginApi() {
  return useMutation({
    mutationFn: loginGoogle,
    onError: (error) => {
      console.error("Google login API error:", error);
    }
  });
}

// Forgot Password API
async function forgotPassword(data: Pick<LoginRequest, 'credential'>) {
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.FORGOT_PASSWORD, data);
  return response.data;
}

function useForgotPasswordApi() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

async function verifyOtp(data: ActiveAccountRequest) {
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.VERIFY_OTP, data);
  return response.data;
}

function useVerifyOtpApi() {
  return useMutation({
    mutationFn: verifyOtp,
  });
}

interface ResetPasswordRequest {
  credential: string;
  newPassword: string;
}

async function resetPassword(data: ResetPasswordRequest) {
  console.log("data", data);
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.RESET_PASSWORD, data);
  return response.data;
}

function useResetPasswordApi() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export {
  useLoginApi,
  useRegisterApi,
  useActiveAccountApi,
  useGetAccountProfileApi,
  useGoogleLoginApi,
  useForgotPasswordApi,
  useVerifyOtpApi,
  useResetPasswordApi
};
