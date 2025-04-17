import { useNavigate } from "@tanstack/react-router";
import useProfileStore from "@stores/useProfileStore.ts";
import React from "react";

function validatePrivileges(requiredPrivileges: string[], userPrivileges: string[]): boolean {
  if (requiredPrivileges.length === 0) return true;

  return requiredPrivileges.some(requiredPrivilege =>
    userPrivileges.some((userPrivilege: string) => {
      if (!requiredPrivilege.includes("_") || !userPrivilege.includes("_")) return false;

      const [requiredResource, requiredAction] = requiredPrivilege.split("_");
      const [userResource, userAction] = userPrivilege.split("_");

      return (userPrivilege === requiredPrivilege)
        || (userResource === "ALL" && userAction === requiredAction)
        || (userResource === requiredResource && userAction === "MANAGE")
        || (userResource === "ALL" && userAction === "MANAGE");
    })
  )
}

function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredPrivileges: string[]
) {
  return (props: T) => {
    const navigate = useNavigate();
    const profile = useProfileStore(state => state.profile);
    const userPrivileges = profile?.grantedPrivileges || [];

    const isAccepted = validatePrivileges(requiredPrivileges, userPrivileges);

    if (!profile || !isAccepted) {
      navigate({ to: "/login" });
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
