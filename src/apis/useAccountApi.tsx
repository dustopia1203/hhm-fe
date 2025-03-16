import { publicClient } from "./axiosClient.ts";
import { useMutation } from "@tanstack/react-query";

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
  const response = await publicClient.post("/api/account/authenticate", data);

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
  const response = await publicClient.post("/api/account/register", data);

  return response.data;
}

function useRegisterApi() {
  return useMutation({
    mutationFn: register,
  });
}

export { useLoginApi, useRegisterApi };
