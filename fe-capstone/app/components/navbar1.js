"use client"; 

export default function Navbar1() {

  return (
    <>
      {/* Navbar */}
      <div className="bg-darkgreen w-full px-3 md:px-6 py-3 flex items-center fixed top-0 left-0 z-50">
        <div className="flex w-full justify-between items-center">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src="/assets/logo1.png"
              className="img-logo2 "
              alt="BiliarD Logo"
            />
            <div className="text-white font-semibold text-2xl">BiliarD</div>
          </div>

          {/* Right Side: Sign In and Sign Up Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="/login">
              <div className="text-white text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 border border-white rounded-xl hover:bg-gray-200 hover:text-black transition">
                Sign In
              </div>
            </a>
            <a href="/register">
              <div className="bg-white text-darkgreen text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-xl hover:bg-gray-400 hover:text-white transition">
                Sign Up
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </>
  );
}
