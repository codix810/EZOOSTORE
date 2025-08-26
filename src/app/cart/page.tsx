"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../compnents/LanguageContext";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, ArrowLeftCircle, CreditCard } from "lucide-react";

// ========== Types ==========
type Tshirt = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  discount?: number;
};

const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]/10 bg-[length:200%_200%] animate-gradient-x";

const dict = {
  en: {
    cartEmpty: "Your cart is empty ",
    backToShop: "Back to shopping",
    title: "Shopping Cart",
    checkout: "Checkout Now",
    remove: "Remove",
  },
  ar: {
    cartEmpty: "السلة فارغة ",
    backToShop: "العودة للتسوق",
    title: "سلة المشتريات",
    checkout: "الدفع الآن",
    remove: "حذف",
  },
};

export default function CartPage() {
  const { lang } = useLanguage();
  const t = dict[lang as "ar" | "en"] ?? dict.ar;

  const [cart, setCart] = useState<Tshirt[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart: Tshirt[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-xl text-gray-700 dark:text-gray-200"
      >
        <ShoppingCart className="w-16 h-16 mb-4 text-cyan-500" />
        {t.cartEmpty}
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 text-lg font-semibold text-cyan-600 hover:text-indigo-600 transition"
        >
          <ArrowLeftCircle className="w-5 h-5" /> {t.backToShop}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-12 mt-9 px-6 md:px-12 bg-gradient-to-br from-slate-100/10 via-slate-200/10 to-slate-300/10 dark:from-slate-900/10 dark:via-slate-800/10 dark:to-slate-900/10"
    >
      <h1
        className={`text-4xl font-extrabold mb-10 text-center ${gradientClass} bg-clip-text text-transparent`}
      >
        {t.title}
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {cart.map((item) => {
          const finalPrice =
            typeof item.discount === "number" && item.discount > 0
              ? Math.round((item.price * (100 - item.discount)) / 100)
              : item.price;

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl shadow-lg overflow-hidden bg-white/10 dark:bg-slate-800/40 backdrop-blur-lg border border-white/20"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-5">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
                  <div>
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <div className="text-sm opacity-80">
                      {typeof item.discount === "number" && item.discount > 0 ? (
                        <>
                          <span className="line-through mr-2 text-gray-400">
                            {item.price} ج.م
                          </span>
                          <span className="font-bold text-cyan-600">
                            {finalPrice} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-cyan-600">
                          {item.price} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 text-white font-semibold shadow-md hover:bg-rose-700 transition"
                >
                  <Trash2 className="w-4 h-4" /> {t.remove}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/Checkout"
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-lg hover:scale-105 transition ${gradientClass}`}
        >
          <CreditCard className="w-5 h-5" /> {t.checkout}
        </Link>
      </div>

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
