import useProfileStore from "@stores/useProfileStore.ts";
import { redirect } from "@tanstack/react-router";

function validatePrivileges(requiredPrivileges: string[], userPrivileges: string[]): boolean {
  if (requiredPrivileges.length === 0) return true;

  return requiredPrivileges.some(requiredPrivilege =>
    userPrivileges.some((userPrivilege: string) => {
      if (!requiredPrivilege.includes(":") || !userPrivilege.includes(":")) return false;

      const [requiredResource, requiredAction] = requiredPrivilege.split(":");
      const [userResource, userAction] = userPrivilege.split(":");

      return (userPrivilege === requiredPrivilege)
        || (userResource === "ALL" && userAction === requiredAction)
        || (userResource === requiredResource && userAction === "MANAGE")
        || (userResource === "ALL" && userAction === "MANAGE");
    })
  )
}

function auth(requiredPrivileges: string[]) {
  const profile = useProfileStore.getState().profile;
  const userPrivileges = profile?.grantedPrivileges || [];

  const isAccepted = validatePrivileges(requiredPrivileges, userPrivileges);

  if (!profile || !isAccepted) {
    throw redirect({ to: "/login" });
  }

  return;
}

export default auth;
