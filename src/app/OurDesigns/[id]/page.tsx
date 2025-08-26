"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../compnents/LanguageContext";
import { Loader2, ShoppingCart, CheckCircle, Tag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Tshirt = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category?: string;
  discount?: number;
};

const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] bg-[length:200%_200%] animate-gradient-x";

const dict = {
  en: {
    addToCart: "Add to Cart",
    viewInCart: "View in Cart",
    new: "New",
    off: "OFF",
    price: "Price",
    loading: "Loading...",
    notFound: "Product not found 😢",
  },
  ar: {
    addToCart: "إضافة إلى السلة",
    viewInCart: "شاهد المنتج في السلة",
    new: "جديد",
    off: "خصم",
    price: "السعر",
    loading: "جاري التحميل...",
    notFound: "المنتج غير موجود 😢",
  },
};

export default function TshirtDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const t = dict[lang as "ar" | "en"];

  const [tshirt, setTshirt] = useState<Tshirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchTshirt() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setTshirt(data.product);
        } else {
          setTshirt(null);
        }
      } catch (err) {
        console.error(err);
        setTshirt(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTshirt();
  }, [id]);

  const handleAddToCart = () => {
    if (!tshirt) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item: Tshirt) => item._id === tshirt._id);

    if (!exists) {
      cart.push(tshirt);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setAdded(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!tshirt) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-rose-600">
        {t.notFound}
      </div>
    );
  }

  const finalPrice = tshirt.discount
    ? Math.round(tshirt.price * (1 - tshirt.discount / 100))
    : tshirt.price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl w-full bg-white/10 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* صورة المنتج */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={tshirt.imageUrl}
              alt={tshirt.name}
              className="object-cover w-full h-full"
            />
            {tshirt.category === "new" && (
              <span className="absolute top-3 left-3 px-4 py-1 rounded-full text-sm font-bold text-white bg-green-600/90 shadow-md flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> {t.new}
              </span>
            )}
            {tshirt.discount && (
              <span className="absolute top-3 right-3 px-4 py-1 rounded-full text-sm font-bold text-white bg-rose-600/90 shadow-md flex items-center gap-1">
                <Tag className="w-4 h-4" /> {tshirt.discount}% {t.off}
              </span>
            )}
          </motion.div>

          {/* تفاصيل المنتج */}
          <div>
            <h1
              className={`text-4xl font-extrabold mb-4 ${gradientClass} bg-clip-text text-transparent`}
            >
              {tshirt.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {tshirt.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              {tshirt.discount ? (
                <>
                  <span className="text-lg font-semibold line-through text-gray-400">
                    {tshirt.price} ج.م
                  </span>
                  <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    {finalPrice} ج.م
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  {finalPrice} ج.م
                </span>
              )}
            </div>

            {!added ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold rounded-xl shadow-md text-white ${gradientClass} transition`}
              >
                <ShoppingCart className="w-5 h-5" /> {t.addToCart}
              </motion.button>
            ) : (
              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold rounded-xl shadow-md text-white bg-green-600 hover:bg-green-700 transition"
              >
                <CheckCircle className="w-5 h-5" /> {t.viewInCart}
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* 🌈 Animation keyframes للعنوان والزرار */}
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
