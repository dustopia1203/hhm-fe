import { authClient, publicClient } from "./axiosClient.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import resourceUrls from "@constants/resourceUrls.ts";

// Login API
interface LoginRequest {
  credential: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: bigint;
    refreshTokenExpiresIn: bigint;
    accessTokenExpiredAt: string;
    refreshTokenExpiredAt: string;
  }
}

async function login(data: LoginRequest): Promise<LoginResponse> {
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

interface RegisterResponse {
  data: boolean;
}

async function register(data: RegisterRequest): Promise<RegisterResponse> {
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

interface ActiveAccountResponse {
  data: boolean;
}

async function activeAccount(data: ActiveAccountRequest): Promise<ActiveAccountResponse> {
  const response = await publicClient.post(resourceUrls.ACCOUNT_RESOURCE.ACTIVE_ACCOUNT, data);

  return response.data;
}

function useActiveAccountApi() {
  return useMutation({
    mutationFn: activeAccount,
  });
}

// Get account profile API
interface AccountProfileResponse {
  data: {
    username: string;
    grantedPrivileges: [string];
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    dateOfBirth: number;
    avatarUrl: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    address: string;
  }
}

async function getAccountProfile(): Promise<AccountProfileResponse> {
  const response = await authClient.get(resourceUrls.ACCOUNT_RESOURCE.GET_PROFILE);

  return response.data;
}

function useGetAccountProfileApi(options?: { enabled?: boolean   }) {
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
