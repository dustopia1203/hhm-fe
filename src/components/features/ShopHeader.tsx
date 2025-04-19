import { useState } from "react";
import useProfileStore from "@stores/useProfileStore.ts";
import { Link } from "@tanstack/react-router";
import { FaBell } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import Logout from "@components/features/Logout.tsx";

function ShopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profile = useProfileStore(state => state.profile)
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  };

  return (
    <header className="shadow-md bg-gray-800 top-0 left-0 w-full z-50">
      <div className="relative container mx-auto flex items-center justify-between py-4 px-48 text-gray-400 text-sm">
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="HHMShop Logo" className="h-8 w-8"/>
          <Link to="/" className="text-lg font-bold text-white">HHMShop</Link>
        </div>

        <div className="relative flex items-center space-x-4">
          <FaBell className="text-gray-300 cursor-pointer" size={20}/>
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Avatar */}
            {profile ?
              (profile.avatarUrl ?
                (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full cursor-pointer object-cover"
                  />
                ) : (
                  <RxAvatar size={24} className="cursor-pointer text-gray-300"/>
                )
              ) : null
            }

            {/* Menu when hover */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Đơn mua</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Tài khoản</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer"><Logout/></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShopHeader;
