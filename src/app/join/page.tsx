"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useLanguage } from "../compnents/LanguageContext";

// 🎨 Palette المتفق عليها
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]";
const gradientText = `${gradientClass} bg-clip-text text-transparent`;
const gradientBtn = `${gradientClass} text-white`;

const dict = {
  en: {
    title: "Contact Us",
    desc: "Have questions or need support? Send us a message and we’ll get back to you quickly.",
    name: "Your Name",
    email: "Your Email",
    message: "Your Message",
    send: "Send Message",
    phone: "Phone",
    address: "Address",
    success: "✅ Your message has been sent successfully!",
  },
  ar: {
    title: "تواصل معنا",
    desc: "لو عندك أي استفسار أو محتاج مساعدة، ابعتلنا رسالة وهنتواصل معاك في أقرب وقت.",
    name: "اسمك",
    email: "بريدك الإلكتروني",
    message: "رسالتك",
    send: "إرسال",
    phone: "رقم الهاتف",
    address: "العنوان",
    success: "✅ تم إرسال رسالتك بنجاح!",
  },
};

export default function ContactUs() {
  const { lang } = useLanguage();
  const t = dict[lang];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.success);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl w-full bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 backdrop-blur-lg"
      >
        {/* Left Info */}
        <div className="p-10 flex flex-col justify-center bg-gradient-to-br from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white relative">
          <motion.h2
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
          >
            {t.title}
          </motion.h2>
          <p className="mb-8 text-lg opacity-90 leading-relaxed">{t.desc}</p>

          <div className="space-y-5 text-base">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Phone className="w-6 h-6" />
              <span>+20 115 312 1543</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Mail className="w-6 h-6" />
              <span>support@ezoo.com</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <MapPin className="w-6 h-6" />
              <span>أسيوط، مصر</span>
            </motion.div>
          </div>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="p-10 flex flex-col justify-center space-y-6"
        >
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200">
              {t.name}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0ea5e9] outline-none bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200">
              {t.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#6366f1] outline-none bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200">
              {t.message}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#22d3ee] outline-none bg-slate-50 dark:bg-slate-800 resize-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/30 transition ${gradientBtn}`}
          >
            <Send className="w-5 h-5" />
            {t.send}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
