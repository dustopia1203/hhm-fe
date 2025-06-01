import { useNavigate } from "@tanstack/react-router";
import useProfileStore from "@stores/useProfileStore";

function Logout() {
  const navigate = useNavigate();
  const clearProfile = useProfileStore.getState().clearProfile;

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    clearProfile();

    await navigate({ to: "/login" });
  }

  return (
    <>
      <span onClick={handleLogout}>Đăng xuất</span>
    </>
  );
}

export default Logout;
