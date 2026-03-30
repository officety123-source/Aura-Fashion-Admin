import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCcw, Percent, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const Add = ({ token }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editProduct;

  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const categories = [
    "Trousers",
    "Polos",
    "Shirts",
    "Denims",
    "T-Shirts",
    "Shorts",
    "Jackets",
    "Activewear",
  ];

  const topwearSizes = ["S", "M", "L", "XL", "XXL"];
  const bottomwearSizes = ["28", "30", "32", "34", "36", "38", "40"];

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setPrice(editData.price);
      setDiscount(editData.discount || 0);
      setCategory(editData.category);
      setSubCategory(editData.subCategory);
      setSizes(editData.sizes || []);
      setIsBestSeller(editData.bestseller);
      setDescription(editData.description || "");
    }
  }, [editData]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", discount || 0);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", isBestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      images[0] && formData.append("image1", images[0]);
      images[1] && formData.append("image2", images[1]);
      images[2] && formData.append("image3", images[2]);
      images[3] && formData.append("image4", images[3]);

      let response;
      if (editData) {
        formData.append("id", editData._id);
        response = await axios.post(
          backendUrl + "/api/product/update",
          formData,
          { headers: { token } },
        );
      } else {
        response = await axios.post(backendUrl + "/api/product/add", formData, {
          headers: { token },
        });
      }

      if (response?.data?.success) {
        toast.success(response.data.message);
        editData ? navigate("/list") : window.location.reload();
      } else {
        toast.error(response?.data?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-6 md:gap-8 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tight">
            {editData ? "Edit Product Info" : "Add New Product"}
          </h2>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {editData
              ? `Editing ID: ${editData._id}`
              : "Create a new listing for Aura Fashion"}
          </p>
        </div>
        {editData && (
          <button
            type="button"
            onClick={() => navigate("/add", { state: null, replace: true })}
            className="flex items-center gap-2 text-[10px] font-black text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all w-full sm:w-auto justify-center"
          >
            <RotateCcw size={14} /> CANCEL EDIT
          </button>
        )}
      </div>

      {/* Image Upload Section */}
      <div className="w-full">
        <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">
          Product Gallery
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 md:gap-4">
          {images.map((img, index) => (
            <label
              key={index}
              className="aspect-[3/4] sm:w-24 sm:h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative"
            >
              {img ? (
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="flex flex-col items-center gap-1 bg-gray-50 w-full h-full justify-center">
                  <ImageIcon className="text-gray-300" size={20} />
                  <span className="text-[8px] font-bold text-gray-300 uppercase">
                    Upload
                  </span>
                </div>
              )}
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const newImg = [...images];
                  newImg[index] = e.target.files[0];
                  setImages(newImg);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            Original Price (Rs.)
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="number"
            placeholder="5000"
            className="p-4 bg-white border border-gray-100 rounded-2xl text-sm focus:border-black outline-none shadow-sm font-bold w-full"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            Discount (%)
          </label>
          <div className="relative">
            <input
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder="20"
              className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm focus:border-black outline-none shadow-sm font-bold"
            />
            <Percent
              size={14}
              className="absolute right-4 top-5 text-gray-400"
            />
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-2xl border border-dashed border-black/10 flex flex-col justify-center sm:col-span-2 md:col-span-1">
          <p className="text-[9px] font-bold text-gray-500 uppercase text-center md:text-left">
            Selling Price Preview:
          </p>
          <p className="text-lg font-black text-black text-center md:text-left">
            Rs. {Math.round(price - price * (discount / 100)) || price}
          </p>
        </div>
      </div>

      {/* Product Name & Description */}
      <div className="w-full space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="e.g. Aura Premium Denim"
            className="p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-black shadow-sm font-bold w-full"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows="3"
            className="p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-black shadow-sm w-full"
            placeholder="Fabric details..."
          />
        </div>
      </div>

      {/* Categories & Bestseller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            Sub Category
          </label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none font-bold w-full appearance-none"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            Category Tag
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none font-bold w-full appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sm:col-span-2 md:col-span-1">
          <input
            type="checkbox"
            id="bestseller"
            checked={isBestSeller}
            onChange={() => setIsBestSeller(!isBestSeller)}
            className="w-6 h-6 accent-black cursor-pointer"
          />
          <label
            htmlFor="bestseller"
            className="text-xs font-black text-gray-700 cursor-pointer"
          >
            BEST SELLER ⭐
          </label>
        </div>
      </div>

      {/* Sizes Section */}
      <div className="w-full">
        <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">
          Select Available Sizes
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {(subCategory === "Bottomwear" ? bottomwearSizes : topwearSizes).map(
            (size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((s) => s !== size)
                      : [...prev, size],
                  )
                }
                className={`flex-1 sm:flex-none min-w-[60px] text-center py-3 border rounded-xl md:rounded-2xl cursor-pointer text-[10px] md:text-[11px] font-black transition-all shadow-sm ${
                  sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black"
                }`}
              >
                {subCategory === "Bottomwear" ? `W-${size}` : size}
              </div>
            ),
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto bg-black text-white px-16 py-4 rounded-2xl md:rounded-[20px] font-black text-xs tracking-[0.2em] shadow-xl hover:bg-zinc-800 transition-all uppercase"
      >
        {editData ? "Save Updates" : "Publish Product"}
      </button>
    </form>
  );
};

export default Add;
