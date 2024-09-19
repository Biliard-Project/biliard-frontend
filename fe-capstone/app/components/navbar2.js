"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Sidebar from "./sidebar"; 

export default function Navbar2() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-darkgreen w-full px-6 py-2 flex items-center">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="/assets/sidebar.png"
              className="img-sidebar cursor-pointer"
              onClick={toggleSidebar}
              alt="Sidebar Icon"
            />
            <div className="text-white font-semibold text-2xl">BiliarD</div>
          </div>

          {/* Profile */}
          <div className="relative">
            <img
              src="/assets/profile.png"
              className="img-profile cursor-pointer"
              onClick={toggleDropdown}
              alt="Profile Icon"
            />

            {/* log out */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}
