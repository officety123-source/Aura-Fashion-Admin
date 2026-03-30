import React, { useState, useEffect } from "react";
import { Edit, Trash2, Star, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.post(
          backendUrl + "/api/product/remove",
          { id },
          { headers: { token } },
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchList();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
          Product Inventory
        </h2>
        <span className="text-[10px] bg-black text-white px-3 py-1 rounded-full font-bold">
          Total: {list.length}
        </span>
      </div>

      {/* --- 1. DESKTOP VIEW (Hidden on Mobile) --- */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Product Info</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price & Offer</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {list.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-50 hover:bg-gray-50/50 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image[0]}
                        className="w-12 h-14 object-cover rounded-lg border border-gray-100"
                        alt=""
                      />
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-bold text-gray-800 truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-gray-400 line-clamp-1 italic">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {item.subCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-black">
                      Rs. {item.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.bestseller && (
                      <Star
                        size={14}
                        className="text-amber-500 inline"
                        fill="currentColor"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Edit
                        onClick={() =>
                          navigate("/add", { state: { editProduct: item } })
                        }
                        size={16}
                        className="cursor-pointer hover:text-black"
                      />
                      <Trash2
                        onClick={() => removeProduct(item._id)}
                        size={16}
                        className="cursor-pointer hover:text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 2. MOBILE VIEW (Card Layout - Hidden on Desktop) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {list.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center"
          >
            <img
              src={item.image[0]}
              className="w-20 h-24 object-cover rounded-xl border border-gray-50"
              alt=""
            />

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                  {item.category}
                </span>
                <div className="flex gap-3">
                  <Edit
                    onClick={() =>
                      navigate("/add", { state: { editProduct: item } })
                    }
                    size={16}
                    className="text-gray-400"
                  />
                  <Trash2
                    onClick={() => removeProduct(item._id)}
                    size={16}
                    className="text-red-400"
                  />
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {item.name}
              </h3>
              <p className="text-black font-black text-sm mt-1">
                Rs. {item.price}
              </p>

              <div className="flex items-center gap-2 mt-1">
                {item.bestseller && (
                  <span className="text-[8px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase border border-amber-100">
                    Bestseller
                  </span>
                )}
                <span className="text-[8px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">
                  {item.subCategory}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
