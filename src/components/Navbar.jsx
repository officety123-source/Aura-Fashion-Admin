import React from "react";

const Navbar = ({ setToken, setSidebarOpen }) => {
  return (
    <nav className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10">
      <div className="flex items-center gap-4">
        {/* --- NEW: Hamburger Menu Button (Only for Mobile) --- */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-2xl p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          ☰
        </button>

        <div className="text-[10px] md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] text-black whitespace-nowrap">
          DASHBOARD
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-8">
        {/* Search Bar (Hidden on very small screens to save space) */}
        <div className="relative hidden sm:flex items-center">
          <span className="absolute left-3 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-xs w-32 md:w-64 focus:outline-none focus:border-black"
          />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:w-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <img src="https://via.placeholder.com/150" alt="Admin" />
          </div>
          {/* Admin name hidden on mobile to keep it clean */}
          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] font-bold text-black">
              ALEX SMITH - ADMIN
            </span>
          </div>
        </div>

        <button
          onClick={() => setToken("")}
          className="text-[9px] md:text-[10px] font-bold border border-black px-3 py-1.5 md:px-4 md:py-2 hover:bg-black hover:text-white transition-all uppercase whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
