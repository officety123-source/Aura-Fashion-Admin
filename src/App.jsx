import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components & Pages
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import HeroManage from "./pages/HeroManage";
import Login from "./components/Login";

export const backendUrl =
  "https://aura-fashionbackend2-production.up.railway.app";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // --- NEW: Mobile Sidebar Toggle State ---
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <ToastContainer />

      {token === "" ? (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
          <Login setToken={setToken} />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden relative">
          {/* 1. SIDEBAR: Desktop par fix, Mobile par Overlay ban jayega */}
          <div
            className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <Sidebar setSidebarOpen={setSidebarOpen} />
          </div>

          {/* Mobile Overlay: Jab sidebar khula ho to peeche ka area dark ho jaye */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* 2. NAVBAR: Ismein hum hamburger button pass karenge */}
            <Navbar setToken={setToken} setSidebarOpen={setSidebarOpen} />

            {/* 3. MAIN CONTENT: Padding ko mobile ke liye adjust kiya */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-[1250px] mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard token={token} />} />
                  <Route
                    path="/hero-manage"
                    element={<HeroManage token={token} />}
                  />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
