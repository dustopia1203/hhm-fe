// Get available roles API
import { authClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";

async function getAvailableRoles() {
  const response = await authClient.get(resourceUrls.ROLE_RESOURCE.GET_AVAILABLE_ROLES);

  return response.data;
}

function useGetAvailableRoles() {
  return useQuery({
    queryKey: ["roles/available"],
    queryFn: getAvailableRoles,
    enabled: false
  })
}

export {
  useGetAvailableRoles
}
