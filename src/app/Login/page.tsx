'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../app/compnents/LanguageContext';
import { useState, useEffect, FormEvent } from 'react';

// 🎨 Gradient موحد
const gradientClass = "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]";
const gradientText = `${gradientClass} bg-clip-text text-transparent`;
const gradientBtn = `${gradientClass} text-white`;

// 🗂️ الترجمات
const dict = {
  en: {
    title: "Login",
    email: "Email",
    password: "Password",
    login: "Login",
    haveAccount: "Don't have an account?",
    register: "Create Account",
    loading: "Loading...",
    error: "An error occurred while logging in",
  },
  ar: {
    title: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    haveAccount: "ليس لديك حساب؟",
    register: "إنشاء حساب",
    loading: "جاري التحميل...",
    error: "حدث خطأ أثناء تسجيل الدخول",
  },
} as const;

type LangKey = keyof typeof dict;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { lang } = useLanguage();
  const safeLang: LangKey = (lang === 'ar' || lang === 'en') ? lang : 'ar';
  const t = dict[safeLang];
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', crypto.randomUUID());
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const deviceId = localStorage.getItem('deviceId');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, deviceId }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setMessage(data.message);

      const userData = {
        _id: data.user._id.toString(),
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        image: data.user.image || null,
        role: data.user.role || 'user',
        deviceId,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');

      router.replace(data.user.role === "admin" ? "/dashboardEzo" : "/");
    } else {
      setSuccess(false);
      setMessage(data.message || t.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0ea5e9]/20 via-[#6366f1]/10 to-[#22d3ee]/10 px-4" dir={safeLang === "ar" ? "rtl" : "ltr"}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-2xl animate-fade-in bg-white/10 backdrop-blur-md border border-white/20">
        <h2 className={`text-2xl font-bold text-center mb-6 ${gradientText}`}>{t.title}</h2>

        {message && (
          <div
            className={`p-4 rounded-md mb-6 text-center transition-all duration-300 ${
              success
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="flex space-x-2">
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce"></span>
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10    outline-none ring-2 ring-[#6366f1]"
            />
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10    outline-none ring-2 ring-[#6366f1]"
            />
            <button
              type="submit"
              className={`w-full py-2 rounded font-semibold transition-all duration-300 ${gradientBtn} hover:brightness-110`}
            >
              {t.login}
            </button>
          </form>
        )}

        <p className="mt-6 text-center ">
          {t.haveAccount}{' '}
          <Link href="/Signup" className={`${gradientText} font-bold`}>
            {t.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
