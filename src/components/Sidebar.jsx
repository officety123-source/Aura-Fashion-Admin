import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
  Image as ImageIcon,
  X, // Close icon add kiya
} from "lucide-react";

const Sidebar = ({ setSidebarOpen }) => {
  const menuItems = [
    { name: "DASHBOARD", path: "/", icon: LayoutDashboard },
    { name: "HERO SECTION", path: "/hero-manage", icon: ImageIcon },
    { name: "ADD PRODUCT", path: "/add", icon: PlusCircle },
    { name: "PRODUCT LIST", path: "/list", icon: Package },
    { name: "ORDERS", path: "/orders", icon: ShoppingCart },
  ];

  return (
    <div className="w-full h-full bg-[#EBEBEB]/95 md:bg-[#EBEBEB]/80 backdrop-blur-md border-r border-gray-200 flex flex-col py-10 px-6 shrink-0 shadow-sm relative">
      {/* --- NEW: Close Button (Only for Mobile) --- */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="md:hidden absolute top-5 right-5 p-2 bg-white rounded-full shadow-sm text-black"
      >
        <X size={20} />
      </button>

      {/* Logo Section */}
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-black tracking-[0.2em] text-black uppercase">
          AURA
        </h1>
        <p className="text-[9px] font-bold text-gray-400 tracking-[0.3em] mt-1">
          ADMIN PANEL
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            // --- NEW: Click hone par sidebar band ho jaye (mobile par) ---
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group
              ${
                isActive
                  ? "bg-black text-white shadow-lg scale-[1.02]"
                  : "text-gray-600 hover:bg-gray-200/50 hover:text-black"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-black"} transition-colors`}
                />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Info - Hidden on small mobile screens to prevent overlap */}
      <div className="mt-auto pt-10 px-4 hidden sm:block">
        <div className="p-4 bg-white/50 rounded-2xl border border-white/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Project:
          </p>
          <p className="text-[11px] font-black text-black">Aura Fashion v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
