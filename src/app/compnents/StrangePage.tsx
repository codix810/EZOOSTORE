"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import Link from "next/link";

// 🎨 ألوان موحدة مع الـ Navbar
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] bg-[length:200%_200%] animate-gradient-x";

const dict = {
  en: {
    title: "Something Strange",
    desc: "Explore unusual ideas!",
    new: "New",
    off: "OFF",
  },
  ar: {
    title: "الغريب منو",
    desc: "اكتشف الأفكار الغريبة!",
    new: "جديد",
    off: "خصم",
  },
};

// فورمات السعر
function formatPrice(n: number, lang: "ar" | "en") {
  return lang === "ar"
    ? new Intl.NumberFormat("ar-EG").format(n) + " ج.م"
    : "$" + new Intl.NumberFormat("en-US").format(n);
}

type Product = {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  discount?: number;
  category?: string;
};

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export default function StrangeProducts() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const t = dict[lang];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        const data: ProductsResponse = await res.json();
        if (data.success) {
          const strangeProducts = data.products.filter(
            (p) => p.category === "strange"
          );
          setProducts(strangeProducts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative py-20 px-6 sm:px-12 lg:px-20 bg-[#fdfdfd]/10 dark:bg-[#0f172a]/10 backdrop-blur-xl rounded-3xl">
      {/* ✨ عنوان متحرك */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`text-center text-4xl sm:text-5xl font-extrabold mb-12 drop-shadow-md ${gradientClass} bg-clip-text text-transparent`}
      >
        {t.title}
      </motion.h2>

      {/* 🛒 المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((item, i) => {
          const hasDiscount = item.discount !== undefined && item.discount > 0;
          const finalPrice = hasDiscount
            ? Math.round(item.price * (1 - (item.discount ?? 0) / 100))
            : item.price;

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 50, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{
                scale: 1.07,
                rotate: 1,
                boxShadow: "0px 15px 35px rgba(0,0,0,0.25)",
              }}
              className="relative rounded-3xl overflow-hidden shadow-xl 
                         bg-gradient-to-br  
                         dark:from-[#1e293b]/10 dark:to-[#0f172a]/10 
                         backdrop-blur-md border border-white/20 cursor-pointer"
            >
              <Link href={`/OurDesigns/${item._id}`}>
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform duration-700"
                    whileHover={{ scale: 1.15, rotate: 1 }}
                  />
                  {item.category === "new" && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold  bg-green-600/90 shadow-md">
                      {t.new}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold  bg-rose-600/90 shadow-md">
                      {item.discount}% {t.off}
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-5">
                <h3
                  className={`text-xl font-bold mb-2 ${gradientClass} bg-clip-text text-transparent`}
                >
                  {item.name}
                </h3>
                <p className="  text-sm sm:text-base line-clamp-2">
                  {item.description || t.desc}
                </p>
                <p className="mt-3 font-extrabold text-lg  ">
                  {formatPrice(finalPrice, lang)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🌈 Animation Keyframes */}
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
    </section>
  );
}
