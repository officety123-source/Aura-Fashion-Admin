import React, { useState, useEffect } from "react";
import { Save, Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const HeroManage = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    btnText: "SHOP NOW",
  });
  const [sliderImages, setSliderImages] = useState([]);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/hero/get");
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setHeroData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          btnText: data.btnText || "SHOP NOW",
        });
        const existing = (data.images || []).map((url) => ({
          url,
          isExisting: true,
          file: null,
        }));
        setSliderImages(existing);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));
    setSliderImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSliderImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSaveHandler = async () => {
    if (sliderImages.length === 0)
      return toast.error("Please add at least one image");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", heroData.title);
      formData.append("subtitle", heroData.subtitle);
      formData.append("btnText", heroData.btnText);

      const currentExistingUrls = [];
      sliderImages.forEach((img) => {
        if (img.isExisting) {
          currentExistingUrls.push(img.url);
        } else if (img.file) {
          formData.append("images", img.file);
        }
      });

      formData.append("existingImages", JSON.stringify(currentExistingUrls));

      const response = await axios.post(
        backendUrl + "/api/hero/update",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success("Hero Updated!");
        fetchHeroData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
            Slider Manager
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Update your homepage hero section
          </p>
        </div>
        <button
          onClick={onSaveHandler}
          disabled={loading}
          className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 disabled:bg-gray-400 transition-all shadow-lg active:scale-95"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          Publish Slider
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Settings Side */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 order-2 lg:order-1">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                Main Heading
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) =>
                  setHeroData({ ...heroData, title: e.target.value })
                }
                placeholder="Ex: Summer Collection 2026"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-black transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                Subtext / Description
              </label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) =>
                  setHeroData({ ...heroData, subtitle: e.target.value })
                }
                placeholder="Ex: Discover the latest trends in luxury fashion."
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:bg-white border border-transparent focus:border-black transition-all font-bold text-sm"
                rows="2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
              Slide Images ({sliderImages.length})
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {sliderImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 group shadow-sm"
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt="slide"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-white p-2 rounded-lg text-red-500 shadow-xl transform scale-90 hover:scale-110 transition-transform"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <label className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-all group">
                <Plus
                  size={20}
                  className="text-gray-300 group-hover:text-black transition-colors"
                />
                <span className="text-[8px] font-black text-gray-300 group-hover:text-black uppercase mt-1">
                  Add
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Live Preview Side (Mobile par top par dikhega) */}
        <div className="order-1 lg:order-2 space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest flex items-center gap-2">
            <ImageIcon size={12} /> Live Preview
          </label>
          <div className="bg-zinc-900 rounded-[32px] md:rounded-[40px] aspect-video relative overflow-hidden flex items-center justify-center text-center p-6 md:p-10 border-[6px] md:border-[10px] border-white shadow-2xl">
            {sliderImages.length > 0 ? (
              <img
                src={sliderImages[0].url}
                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-500"
                alt="preview"
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-700 font-black text-xs uppercase tracking-widest">
                No Image Selected
              </div>
            )}

            <div className="relative z-10 px-4">
              <h1 className="text-white text-xl md:text-4xl font-black uppercase tracking-tighter drop-shadow-lg">
                {heroData.title || "YOUR TITLE HERE"}
              </h1>
              <div className="w-10 h-1 bg-white mx-auto my-3 md:my-4"></div>
              <p className="text-white/70 text-[8px] md:text-xs uppercase tracking-[0.3em] font-bold">
                {heroData.subtitle || "Your catchy subtitle goes here"}
              </p>
              <button className="mt-6 px-6 py-2 border border-white/30 text-white text-[8px] font-black uppercase tracking-widest rounded-full pointer-events-none">
                {heroData.btnText}
              </button>
            </div>
          </div>
          <p className="text-center text-[9px] text-gray-400 font-medium italic">
            Note: Preview reflects the first image of the slider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroManage;
