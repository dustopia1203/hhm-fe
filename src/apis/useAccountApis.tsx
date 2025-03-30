import { publicClient } from "./axiosClient.ts";
import { useMutation } from "@tanstack/react-query";
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

// Register API
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

export { useLoginApi, useRegisterApi, useActiveAccountApi };
