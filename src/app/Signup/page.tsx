'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../app/compnents/LanguageContext';

// 🎨 Gradient موحد
const gradientClass = "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]";
const gradientText = `${gradientClass} bg-clip-text text-transparent`;
const gradientBtn = `${gradientClass} text-white`;

// 🌍 الترجمات
const dict = {
  en: {
    title: "Create Account",
    name: "Full Name",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    signup: "Sign Up",
    haveAccount: "Already have an account?",
    login: "Login",
    loading: "Registering...",
    error: "An error occurred while signing up",
  },
  ar: {
    title: "إنشاء حساب",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    signup: "إنشاء الحساب",
    haveAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    loading: "جاري التسجيل...",
    error: "حدث خطأ أثناء إنشاء الحساب",
  },
} as const;

type LangKey = keyof typeof dict;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fixedRole = 'user';

  const { lang } = useLanguage();
  const safeLang: LangKey = (lang === 'ar' || lang === 'en') ? lang : 'ar';
  const t = dict[safeLang];
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', crypto.randomUUID());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const deviceId = localStorage.getItem('deviceId');

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, role: fixedRole }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok && data.user) {
      setSuccess(true);
      setMessage(data.message);

      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          createdAt: data.user.createdAt,
          deviceId,
        })
      );

      setTimeout(() => {
        const redirectUrl = localStorage.getItem('redirect') || '/';
        window.location.href = redirectUrl;
      }, 600);
    } else {
      setSuccess(false);
      setMessage(data.message || t.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0ea5e9]/20 via-[#6366f1]/10 to-[#22d3ee]/10 px-4"
      dir={safeLang === 'ar' ? 'rtl' : 'ltr'}
    >
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
          <div className="text-center py-6">{t.loading}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10    outline-none ring-2 ring-[#6366f1]"
            />
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-white/30 bg-white/10    outline-none ring-2 ring-[#6366f1]"
            />
            <input
              type="tel"
              placeholder={t.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              {t.signup}
            </button>
          </form>
        )}

        <p className="mt-6 text-center ">
          {t.haveAccount}{' '}
          <Link href="/Login" className={`${gradientText} font-bold`}>
            {t.login}
          </Link>
        </p>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
