import React, { useState, useEffect } from "react";
import {
  Package,
  CircleDollarSign,
  TrendingUp,
  Star,
  Search,
  ArrowUpRight,
  LayoutGrid,
} from "lucide-react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Dashboard = ({ token }) => {
  const [list, setList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const productRes = await axios.get(backendUrl + "/api/product/list");
      if (productRes.data.success) {
        setList(productRes.data.products);
      }

      const orderRes = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      if (orderRes.data.success) {
        setOrders(orderRes.data.orders);
      }
    } catch (error) {
      console.error("Dashboard Data Error:", error);
      toast.error("Backend connection failed!");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Calculations
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
  const bestsellerCount = list.filter((item) => item.bestseller).length;

  const stats = [
    {
      id: 1,
      title: "Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+12.5%",
    },
    {
      id: 2,
      title: "Total Orders",
      value: orders.length,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "Live",
    },
    {
      id: 3,
      title: "Inventory",
      value: list.length,
      icon: LayoutGrid,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Items",
    },
    {
      id: 4,
      title: "Bestsellers",
      value: bestsellerCount,
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Top Picks",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const name = order.address?.firstName?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) || order._id.includes(searchTerm)
    );
  });

  return (
    <div className="flex flex-col gap-8 pb-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
            Executive Overview
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Real-time System Synchronization
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-2xl shadow-lg">
          <TrendingUp size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Growth Active
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}
              >
                <item.icon size={22} />
              </div>
              <span className="text-[9px] font-black bg-gray-50 text-gray-400 px-2 py-1 rounded-lg uppercase">
                {item.trend}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {item.title}
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {item.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table Section */}
      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-black rounded-full"></div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">
              Latest Shipments
            </h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-black transition-all outline-none shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Order Reference</th>
                <th className="px-6 py-5">Customer Entity</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Value</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
              {filteredOrders.slice(0, 8).map((order, index) => (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <span className="font-black text-[11px] bg-gray-100 px-2 py-1 rounded text-gray-500 group-hover:bg-black group-hover:text-white transition-colors uppercase">
                      #{order._id.slice(-6)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900">
                        {order.address?.firstName} {order.address?.lastName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {order.address?.city}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border shadow-sm ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-gray-900">
                    Rs. {order.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-black hover:text-white rounded-xl transition-all inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                      View <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <Package size={40} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
                No active records found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
