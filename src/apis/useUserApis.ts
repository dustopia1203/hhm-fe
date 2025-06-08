import { prepareParams, serializeParams } from "@utils/searchUtils.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { authClient } from "@apis/axiosClient.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

// Search users API
interface UserSearchRequest {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  ids?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  accountType?: 'SYSTEM' | 'GOOGLE' | 'FACEBOOK';
}

async function searchUsers(request: UserSearchRequest) {
  const params = prepareParams(request);

  const response = await authClient.get(resourceUrls.USER_RESOURCE.SEARCH, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchUsersApi(request: UserSearchRequest) {
  return useQuery({
    queryKey: ["users/search", request],
    queryFn: () => searchUsers(request)
  });
}

// Get user by ID API
async function getUserById(id: string) {
  const response = await authClient.get(resourceUrls.USER_RESOURCE.GET_BY_ID.replace("{id}", id));
  return response.data;
}

function useGetUserByIdApi(id: string) {
  return useQuery({
    queryKey: ["users/get", id],
    queryFn: () => getUserById(id),
    enabled: !!id && id !== '',
  });
}

// Activate users API
interface IdsRequest {
  ids: string[];
}

async function activateUsers(request: IdsRequest) {
  const response = await authClient.put(resourceUrls.USER_RESOURCE.ACTIVE, request);
  return response.data;
}

function useActivateUsersApi() {
  return useMutation({
    mutationFn: activateUsers
  });
}

// Inactivate users API
async function inactivateUsers(request: IdsRequest) {
  const response = await authClient.put(resourceUrls.USER_RESOURCE.INACTIVE, request);
  return response.data;
}

function useInactivateUsersApi() {
  return useMutation({
    mutationFn: inactivateUsers
  });
}

// Delete users
async function deleteUsers(request: IdsRequest) {
  const response = await authClient.delete(resourceUrls.USER_RESOURCE.DELETE, {
    data: request
  });
  return response.data;
}

function useDeleteUsersApi() {
  return useMutation({
    mutationFn: deleteUsers
  });
}

// Get user roles
async function getUserRoles(id: string) {
  const response = await authClient.get(resourceUrls.USER_RESOURCE.GET_ROLES.replace("{id}", id));
  return response.data;
}

function useGetUserRolesApi(id: string) {
  return useQuery({
    queryKey: ["users/roles", id],
    queryFn: () => getUserRoles(id),
    enabled: !!id && id !== '',
  });
}

// Set user role
async function setUserRole(userId: string, data: IdsRequest) {
  const response = await authClient.put(resourceUrls.USER_RESOURCE.SET_ROLE.replace("{id}", userId), data);
  return response.data;
}

function useSetUserRoleApi() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IdsRequest }) => setUserRole(id, data)
  });
}

export {
  useSearchUsersApi,
  useGetUserByIdApi,
  useActivateUsersApi,
  useInactivateUsersApi,
  useDeleteUsersApi,
  useGetUserRolesApi,
  useSetUserRoleApi
}
