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

export {
  useLoginApi,
  useRegisterApi,
  useActiveAccountApi,
  useGetAccountProfileApi
};
