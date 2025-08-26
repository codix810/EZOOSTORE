"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const dict = {
  en: {
    aboutTitle: "EZOO",
    aboutDesc: "EZOO offers the latest trendy youth T-shirts with creative and stylish designs.",
    quickLinks: "Quick Links",
    services: "Our Services",
    followUs: "Follow Us",
    links: {
      home: "Home",
      about: "About Us",
      Sinin: "Sinin",
      products: "Products",
      contact: "Contact",
    },
    servicesList: ["Web Design", "App Development", "Digital Marketing", "Tech Consulting"],
    rights: "All rights reserved.",
  },
  ar: {
    aboutTitle: "EZOO",
    aboutDesc: "EZOO تقدم أحدث التشرتات الشبابية العصرية بأفكار وتصاميم مميزة.",
    quickLinks: "روابط سريعة",
    Sinin: "سجل دخول",
    followUs: "تابعنا",
    links: {
      home: "الرئيسية",
      about: "من نحن",
      Sinin: "سجل دخول",
      products: "منتجات",
      contact: "تواصل معنا",
    },
    servicesList: ["تصميم مواقع", "تطوير تطبيقات", "تسويق إلكتروني", "استشارات تقنية"],
    rights: "جميع الحقوق محفوظة.",
  },
};

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-[#d4a373] mb-4">
            {dict[lang].aboutTitle}
          </h2>
          <p className="text-sm leading-relaxed">
            {dict[lang].aboutDesc}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {dict[lang].quickLinks}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#d4a373]">{dict[lang].links.home}</Link></li>
            <li><Link href="/About" className="hover:text-[#d4a373]">{dict[lang].links.about}</Link></li>
            <li><Link href="/Login" className="hover:text-[#d4a373]">{dict[lang].links.Sinin}</Link></li>
            <li><Link href="/OurDesigns" className="hover:text-[#d4a373]">{dict[lang].links.products}</Link></li>
            <li><Link href="/join" className="hover:text-[#d4a373]">{dict[lang].links.contact}</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {dict[lang].services}
          </h3>
          <ul className="space-y-2 text-sm">
            {dict[lang].servicesList.map((service, idx) => (
              <li key={idx} className="hover:text-[#d4a373]">{service}</li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {dict[lang].followUs}
          </h3>
          <div className="flex space-x-4 rtl:space-x-reverse text-2xl">
            <Link href="#" className="hover:text-blue-500"><Facebook /></Link>
            <Link href="#" className="hover:text-pink-500"><Instagram /></Link>
            <Link href="#" className="hover:text-sky-400"><Twitter /></Link>
            <Link href="#" className="hover:text-blue-400"><Linkedin /></Link>
            <Link href="#" className="hover:text-red-500"><Youtube /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} EZOO. {dict[lang].rights}
      </div>
    </footer>
  );
}
