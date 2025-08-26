"use client";

import { useLanguage } from "./LanguageContext";
import Link from "next/link";
import { FaPalette } from "react-icons/fa";
import { motion } from "framer-motion";

const dict = {
  en: { heroTitle: "Your Design", heroDesc: "Latest youth T-shirt designs", discoverBtn: "Design Now" },
  ar: { heroTitle: "تصميمك", heroDesc: "أحدث تصميمات التشرتات الشبابية", discoverBtn: "صمم الآن" },
};

// 🎨 Gradient شبابي
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]/10 bg-[length:200%_200%] animate-gradient-x";

export default function HeroPage() {
  const { lang } = useLanguage();

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden
      bg-[#fdfa]/10 dark:bg-[#0f172a]/10" 
      // ☝️ Light mode: Beige ناعم | Dark mode: كحلي غامق أنيق
    >
      {/* ✨ خلفية تيشيرتات */}
      <div className="absolute inset-0 -z-10 flex flex-wrap justify-center items-center opacity-10">
        {[...Array(1)].map((_, i) => (
          <motion.img
            key={i}
            src={`/EZOO.png`}
            alt="Tshirt Design"
            className="w-32 h-32 object-contain m-6"
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 1, scale: 10, rotate: i % 2 === 0 ? 10 : -10 }}
            transition={{
              duration: 5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* ✨ المحتوى */}
      <div className="flex flex-col justify-center items-center text-center px-4 max-w-4xl z-10">
        
        {/* 🌟 العنوان */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 
            ${gradientClass} bg-clip-text text-transparent`}
        >
          {dict[lang].heroTitle}
        </motion.h1>

        {/* 🌟 الوصف */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-10"
        >
          {dict[lang].heroDesc}
        </motion.p>

        {/* 🌟 زرار CTA */}
        <motion.div>
          <Link href="/YourDesigns">
            <button className="flex items-center gap-3 px-10 py-4 md:text-2xl font-bold rounded-full shadow-lg text-white 
                               bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#6366f1]
                               hover:shadow-2xl transition-all duration-500">
              <FaPalette className="text-yellow-300 animate-spin-slow" />
              {dict[lang].discoverBtn}
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
