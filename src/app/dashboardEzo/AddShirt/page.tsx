// AddShirt/page.tsx
"use client";

import { useState } from "react";
import { Upload, Send } from "lucide-react";

type ProductBody = {
  name: string;
  description: string;
  price: number;
  category: "new" | "discount" | "strange";
  imageUrl: string;
  discount?: number;
};

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const [category, setCategory] = useState<"new" | "discount" | "strange" | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async () => {
    if (!name || !description || !price || !imageFile || !category) {
      setMessage({ type: "error", text: "اكمل كل البيانات!" });
      return;
    }

    try {
      // رفع الصورة على Cloudinary
      const formDataCloud = new FormData();
      formDataCloud.append("file", imageFile);
      formDataCloud.append("upload_preset", "unsigned_dashboard");
      formDataCloud.append("folder", "products");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dfbadbos5/image/upload",
        { method: "POST", body: formDataCloud }
      );

      const cloudData: { secure_url?: string } = await cloudRes.json();

      if (!cloudRes.ok || !cloudData.secure_url)
        throw new Error(`Upload failed: ${JSON.stringify(cloudData)}`);

      const bodyData: ProductBody = {
        name,
        description,
        price,
        category: category as "new" | "discount" | "strange",
        imageUrl: cloudData.secure_url,
      };

      if (category === "discount" && discount && discount > 0) {
        bodyData.discount = discount;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data: { success: boolean; error?: string } = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "تم إضافة المنتج بنجاح!" });
        setName("");
        setDescription("");
        setPrice(0);
        setDiscount(0);
        setCategory("");
        setImageFile(null);
      } else {
        setMessage({ type: "error", text: data.error || "فشل الإضافة" });
      }
    } catch (err: unknown) {
      console.error("Upload/Error:", err);
      const errorMsg =
        err instanceof Error ? err.message : JSON.stringify(err);
      setMessage({ type: "error", text: `حدث خطأ: ${errorMsg}` });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 font-bolder text-black bg-gray-50 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4">أضف منتج جديد</h2>

      <input
        type="text"
        placeholder="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mb-2 rounded-xl"
      />
      <textarea
        placeholder="وصف المنتج"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-2 rounded-xl"
      />
      <input
        type="number"
        placeholder="السعر"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full p-3 mb-2 rounded-xl"
      />

      <div className="flex gap-2 mb-2 font-bold">
        <button
          type="button"
          className={`px-4 py-2 rounded-xl ${
            category === "new" ? "bg-[#d4a373] text-white" : "bg-gray-400"
          }`}
          onClick={() => setCategory("new")}
        >
          جديد
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl ${
            category === "discount" ? "bg-[#d4a373] text-white" : "bg-gray-400"
          }`}
          onClick={() => setCategory("discount")}
        >
          خصم
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl ${
            category === "strange" ? "bg-[#d4a373] text-white" : "bg-gray-400"
          }`}
          onClick={() => setCategory("strange")}
        >
          الغريب منو
        </button>
      </div>

      {category === "discount" && (
        <input
          type="number"
          placeholder="قيمة الخصم"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-full p-3 mb-2 rounded-xl"
        />
      )}

      <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed cursor-pointer mb-4">
        <Upload className="w-6 h-6 mb-2" />
        <span>{imageFile ? imageFile.name : "اضغط لاختيار صورة"}</span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
        />
      </label>

      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-xl bg-[#d4a373] text-white flex items-center gap-2"
      >
        <Send className="w-5 h-5" /> أضف المنتج
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
