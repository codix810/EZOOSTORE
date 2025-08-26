"use client";

import { motion } from "framer-motion";
import {
  SparklesIcon,
  GlobeAltIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../compnents/LanguageContext";

// 🎨 ألوان الباليت المتفق عليها
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]";
const gradientText = `${gradientClass} bg-clip-text text-transparent`;

const dict = {
  en: {
    heroTitle: "About EZOO Store",
    heroDesc:
      "At EZOO Store, we bring you stylish youth t-shirts with creative designs and the unique ability to customize your own piece. Fresh, bold, and built for your lifestyle!",
    card1Title: "Trendy & Stylish",
    card1Desc:
      "Designed for today’s youth. Comfort, fashion, and elegance blended into every t-shirt you wear daily.",
    card2Title: "Customize Yours",
    card2Desc:
      "Make it yours — add your designs, colors, and text to craft a one-of-a-kind t-shirt.",
    card3Title: "Premium Fabrics",
    card3Desc:
      "High-quality fabrics that stay fresh and last long. Feel the quality, wear the style.",
  },
  ar: {
    heroTitle: "عن متجر EZOO",
    heroDesc:
      "في EZOO Store نقدم لك تيشرتات شبابية عصرية مع لمسة إبداعية، وإمكانية تصميم التشرت الخاص بك ليكون فريداً. أناقة وجودة تناسب أسلوب حياتك!",
    card1Title: "عصري وأنيق",
    card1Desc:
      "تصاميم حديثة تدمج بين الراحة والموضة، مثالية للاستخدام اليومي.",
    card2Title: "صمم تيشرتك",
    card2Desc:
      "أضف لمستك الخاصة — ألوانك، نصوصك، وتصاميمك ليصبح التشرت فريدًا.",
    card3Title: "خامات فاخرة",
    card3Desc:
      "أقمشة عالية الجودة تدوم طويلاً وتمنحك إحساسًا مميزًا في كل مرة.",
  },
};

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-28 px-6 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 transition-colors duration-500">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl"
      >
        <h1
          className={`text-4xl md:text-6xl font-extrabold drop-shadow-lg ${gradientText} mb-6`}
        >
          {dict[lang].heroTitle}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300">
          {dict[lang].heroDesc}
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="mt-20 grid gap-10 md:grid-cols-3 w-full max-w-6xl">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -10, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 
                     bg-white/80 dark:bg-slate-900/80 backdrop-blur-md group relative overflow-hidden"
        >
          <div
            className={`flex items-center justify-center h-14 w-14 rounded-full ${gradientClass} text-white shadow-lg mb-5 group-hover:scale-110 transition`}
          >
            <SparklesIcon className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200">
            {dict[lang].card1Title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {dict[lang].card1Desc}
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -10, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 
                     bg-white/80 dark:bg-slate-900/80 backdrop-blur-md group relative overflow-hidden"
        >
          <div
            className={`flex items-center justify-center h-14 w-14 rounded-full ${gradientClass} text-white shadow-lg mb-5 group-hover:scale-110 transition`}
          >
            <BoltIcon className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200">
            {dict[lang].card2Title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {dict[lang].card2Desc}
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -10, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 
                     bg-white/80 dark:bg-slate-900/80 backdrop-blur-md group relative overflow-hidden"
        >
          <div
            className={`flex items-center justify-center h-14 w-14 rounded-full ${gradientClass} text-white shadow-lg mb-5 group-hover:scale-110 transition`}
          >
            <GlobeAltIcon className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200">
            {dict[lang].card3Title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {dict[lang].card3Desc}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
