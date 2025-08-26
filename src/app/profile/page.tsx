'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, LogOut, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../compnents/LanguageContext";

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
};

const dict = {
  en: {
    title: "Profile",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save Changes",
    logout: "Logout",
    orders: "View Orders",
    name: "Name",
    email: "Email",
    phone: "Phone",
    upload: "Upload Image",
  },
  ar: {
    title: "الملف الشخصي",
    edit: "تعديل",
    cancel: "إلغاء",
    save: "حفظ التغييرات",
    logout: "خروج",
    orders: "عرض الطلبات",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    upload: "رفع صورة",
  },
};

// Gradient class
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] bg-[length:200%_200%] animate-gradient-x";

export default function ProfilePage() {
  const { lang } = useLanguage();
  const t = dict[lang as "ar" | "en"];

  const [user, setUser] = useState<UserType | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', image: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return router.push('/Login');

      const parsedUser: UserType = JSON.parse(savedUser);
      if (!parsedUser._id) return router.push('/Login');

      try {
        const res = await fetch(`/api/users/${parsedUser._id}`);
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          image: data.image || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, ...formData } : null));
        setEditing(false);
      }
    } catch (err) {
      console.error('❌ فشل حفظ التعديلات', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/Login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900/10 dark:via-slate-800/10 dark:to-slate-900/10"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-8 rounded-2xl shadow-xl bg-white/10 dark:bg-slate-800/40 backdrop-blur-lg border border-white/20"
      >
        {/* العنوان + الأزرار */}
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-extrabold ${gradientClass} bg-clip-text text-transparent`}>
            {t.title}
          </h2>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all bg-yellow-500 hover:bg-yellow-600"
            >
              <Pencil className="w-4 h-4" />
              {editing ? t.cancel : t.edit}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all bg-red-500 hover:bg-red-600"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </motion.button>
          </div>
        </div>

        {/* صورة + بيانات المستخدم */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            src={formData.image || '/default-user.png'}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400/50 shadow-lg"
          />

          <div className="flex-1 space-y-4">
            <input
              type="text"
              name="name"
              disabled={!editing}
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t.name}
              className={`w-full border p-3 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                editing ? 'border-cyan-400 bg-white' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
            <input
              type="email"
              name="email"
              disabled={!editing}
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t.email}
              className={`w-full border p-3 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                editing ? 'border-cyan-400 bg-white' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />
            <input
              type="tel"
              name="phone"
              disabled={!editing}
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t.phone}
              className={`w-full border p-3 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                editing ? 'border-cyan-400 bg-white' : 'bg-gray-100 cursor-not-allowed'
              }`}
            />

            {editing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSave}
                  className={`w-full py-2 rounded-lg text-white font-semibold shadow-md transition-all ${gradientClass}`}
                >
                  {t.save}
                </motion.button>
              </motion.div>
            )}

            {/* زر عرض الطلبات */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/profile/components/OrdersPage')}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${gradientClass} mt-4`}
            >
              <Package className="w-5 h-5" />
              {t.orders}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 🌈 Gradient Animation */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}
