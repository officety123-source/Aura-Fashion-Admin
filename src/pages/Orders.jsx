import React, { useState, useEffect } from "react";
import { Package, CheckCircle, Clock, Phone, MapPin } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Status Updated");
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
          Incoming Orders
        </h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Track and manage customer shipments
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-[24px] p-5 md:p-8 shadow-sm hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr] gap-6 items-start"
            >
              {/* 1. Icon & ID (Hidden on very small screens to save space) */}
              <div className="hidden sm:flex bg-gray-50 p-4 rounded-2xl items-center justify-center aspect-square">
                <Package size={32} className="text-black" />
              </div>

              {/* 2. Order Details */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {new Date(order.date).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="space-y-1 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                  {order.items.map((item, i) => (
                    <p
                      key={i}
                      className="text-sm font-bold text-gray-800 flex items-center justify-between"
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded uppercase font-black shrink-0">
                        {item.size}
                      </span>
                    </p>
                  ))}
                </div>

                <div className="mt-2 space-y-1.5">
                  <p className="text-xs font-black text-gray-900 flex items-center gap-2 uppercase">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <div className="text-[11px] text-gray-500 space-y-1">
                    <p className="flex items-start gap-1.5 leading-tight">
                      <MapPin size={12} className="shrink-0 mt-0.5" />
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state}
                    </p>
                    <p className="flex items-center gap-1.5 font-bold text-black">
                      <Phone size={12} className="shrink-0" />{" "}
                      {order.address.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Payment & Amount */}
              <div className="flex flex-row md:flex-col items-center md:items-center justify-between md:justify-center p-4 bg-gray-50/30 md:bg-transparent rounded-2xl h-full border border-dashed border-gray-100 md:border-none">
                <div className="flex flex-col md:items-center">
                  <p className="text-lg font-black text-black leading-none">
                    Rs. {order.amount.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-400 uppercase font-bold mt-1">
                    Total Amount
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-0 md:mt-3">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${order.payment ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-[10px] font-black uppercase text-gray-700">
                    {order.paymentMethod} {order.payment ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>

              {/* 4. Status Controller */}
              <div className="flex flex-col gap-3 justify-center h-full pt-4 md:pt-0 border-t md:border-none border-gray-100">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Update Status
                </label>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="w-full p-4 md:p-3 bg-white md:bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-black outline-none focus:border-black transition-all cursor-pointer appearance-none shadow-sm md:shadow-none"
                >
                  {statusOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-center md:justify-start gap-1.5">
                  {order.status === "Delivered" ? (
                    <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase">
                      <CheckCircle size={14} /> Order Complete
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase">
                      <Clock size={14} /> Status: {order.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <Package size={48} className="text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              No orders found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
