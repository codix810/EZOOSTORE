"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  LanguageIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useLanguage } from "../compnents/LanguageContext";

// 🎨 Gradient شبابي
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] bg-[length:200%_200%] animate-gradient-x";
const gradientText = `${gradientClass} bg-clip-text text-transparent`;
const gradientBtn = `bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white hover:shadow-lg hover:scale-105 transition-all duration-300`;

const dict = {
  en: {
    nav: [
      { name: "OurDesigns", href: "/OurDesigns" },
      { name: "YourDesigns", href: "/YourDesigns" },
      { name: "About", href: "/About" },
    ],
    join: "Join Us",
  },
  ar: {
    nav: [
      { name: "تصميماتنا", href: "/OurDesigns" },
      { name: "تصميماتك", href: "/YourDesigns" },
      { name: "من نحن", href: "/About" },
    ],
    join: "انضمّ إلينا",
  },
};

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const handleResize = () => setIsWide(window.innerWidth >= 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("lang", lang);
  }, [lang, mounted]);

  const navigation = dict[lang].nav;

  if (!mounted) return null;

  return (
    <Disclosure
      as="nav"
      className="fixed w-full z-50 top-0 border-b border-white/10 shadow-sm 
                 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 transition-all duration-300"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* Logo */}
              <Link
                href="/"
                className={`text-3xl sm:text-4xl font-extrabold tracking-wide ${gradientText}`}
              >
                EZOO
              </Link>

              {isWide ? (
                <>
                  {/* Center nav */}
                  <div className="flex gap-8 items-center">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`relative text-lg font-medium transition duration-300 
                            ${isActive ? gradientText : "text-gray-700 dark:text-gray-200"}
                            hover:opacity-80`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-3">
                    {/* Cart */}
                    <Link
                      href="/cart"
                      className="relative inline-flex items-center justify-center p-2 rounded-full 
                                 bg-white/40 dark:bg-zinc-800/40 border border-white/20 shadow-sm transition hover:scale-110"
                      aria-label="Cart"
                    >
                      <ShoppingCartIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                    </Link>

                    {/* Profile */}
                    <Link
                      href="/profile"
                      className="inline-flex items-center justify-center p-2 rounded-full 
                                 bg-white/40 dark:bg-zinc-800/40 border border-white/20 shadow-sm transition hover:scale-110"
                      aria-label="Profile"
                    >
                      <UserIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                    </Link>

                    {/* Language */}
                    <button
                      onClick={() => setLang((p) => (p === "en" ? "ar" : "en"))}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 shadow-sm transition hover:scale-105"
                      aria-label="Toggle language"
                    >
                      <LanguageIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                      {lang === "en" ? "AR" : "EN"}
                    </button>

                    {/* Theme */}
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 shadow-sm transition hover:scale-110"
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? (
                        <SunIcon className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <MoonIcon className="h-5 w-5 text-blue-500" />
                      )}
                    </button>

                    {/* Join */}
                    <Link
                      href="/join"
                      className={`px-5 py-2 rounded-full font-semibold shadow-md ${gradientBtn}`}
                    >
                      {dict[lang].join}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/cart" className="p-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20">
                    <ShoppingCartIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                  </Link>
                  <Link href="/profile" className="p-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20">
                    <UserIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                  </Link>
                  <button
                    onClick={() => setLang((p) => (p === "en" ? "ar" : "en"))}
                    className="p-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20"
                  >
                    <LanguageIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                  </button>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20"
                  >
                    {theme === "dark" ? (
                      <SunIcon className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <MoonIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </button>

                  {/* Hamburger */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 transition hover:scale-110">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile panel */}
          {!isWide && (
            <Disclosure.Panel className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-white/10">
              <div className="px-3 py-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-base font-medium transition ${
                        isActive
                          ? gradientText
                          : "text-gray-900 dark:text-white hover:opacity-80"
                      }`}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                })}

                <Disclosure.Button
                  as={Link}
                  href="/join"
                  className={`mt-3 block text-center rounded-full px-4 py-2 font-semibold ${gradientBtn}`}
                >
                  {dict[lang].join}
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}
