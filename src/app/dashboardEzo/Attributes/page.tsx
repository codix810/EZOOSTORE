"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Upload, Trash, Edit, Send } from "lucide-react";

type AttributeType = "color" | "size" | "logo";

interface Attribute {
  _id: string;
  type: AttributeType;
  value?: string;
  logoUrl?: string;
}

export default function AdminAttributes() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [type, setType] = useState<AttributeType>("color");
  const [value, setValue] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // جلب البيانات
  const fetchAttributes = async () => {
    const res = await fetch("/api/attributes");
    const data = await res.json();
    if (data.success) setAttributes(data.attributes);
  };

  useEffect(() => { fetchAttributes(); }, []);

  // إضافة عنصر جديد
  const handleAdd = async () => {
interface AttributeForm {
  type: AttributeType;
  value?: string;
  file?: string | ArrayBuffer | null;
}

const formData: AttributeForm = { type, value };

    if (type === "logo" && logoFile) {
      const reader = new FileReader();
      reader.readAsDataURL(logoFile);
      await new Promise((res) => (reader.onloadend = res));
      formData.file = reader.result;
    }

    const res = await fetch("/api/attributes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: "success", text: "تمت الإضافة بنجاح" });
      setValue(""); setLogoFile(null);
      fetchAttributes();
    } else {
      setMessage({ type: "error", text: data.error || "فشل الإضافة" });
    }
  };

  // حذف عنصر
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/attributes/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchAttributes();
  };

  // تعديل عنصر
  const handleEdit = async (attr: Attribute) => {
    const newValue = prompt("ادخل القيمة الجديدة:", attr.value || "");
    if (!newValue) return;
    await fetch(`/api/attributes/${attr._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: newValue }),
    });
    fetchAttributes();
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center text-black">
      
      <motion.div className="w-full max-w-3xl p-8 rounded-3xl shadow-xl text-black">
        <h2 className="text-2xl font-bold mb-4">إدارة الخصائص</h2>

        {/* اختيار النوع */}
        <div className="mb-4 flex gap-4">
          {["color", "size", "logo"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as AttributeType)}
              className={`px-4 py-2 rounded-xl font-bold ${
                type === t ? "bg-[#d4a373] text-white" : "bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* قيمة أو رفع لوجو */}
        
        {type !== "logo" ? (
          <input
            type="text"
            placeholder="ادخل القيمة"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 mb-4"
          />
        ) : (
          <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed cursor-pointer mb-4">
            <Upload className="w-6 h-6 mb-2" />
            <span>{logoFile ? logoFile.name : "اضغط لاختيار لوجو"}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
            />
          </label>
        )}

        <button
          onClick={handleAdd}
          className="px-6 py-3 rounded-xl bg-[#d4a373] text-white font-bold mb-6"
        >
          <Send className="w-5 h-5 inline mr-2" /> أضف
        </button>

        {/* رسالة */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 rounded-xl mb-4 text-center ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* جدول العناصر */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-gray-900">
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-2">النوع</th>
                <th className="border p-2">القيمة / اللوجو</th>
                <th className="border p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr._id} className="border">
                  <td className="border p-2">{attr.type}</td>
                  <td className="border p-2">
                    {attr.type === "logo" ? (
                      <img src={attr.logoUrl} alt="logo" className="w-16 h-16 object-contain mx-auto" />
                    ) : (
                      attr.value
                    )}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button onClick={() => handleEdit(attr)} className="p-1 bg-yellow-400 rounded">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(attr._id)} className="p-1 bg-red-500 rounded">
                      <Trash className="w-5 h-5 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
