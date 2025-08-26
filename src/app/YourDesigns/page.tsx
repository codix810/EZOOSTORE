"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Send, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../compnents/LanguageContext";

type Step = 1 | 2 | 3 | 4 | 5;
interface User { _id: string; name: string; email: string; phone: string; role: string; }
interface Attribute { _id: string; type: "size" | "color" | "logo"; value?: string; logoUrl?: string; }

const dict = {
  en: {
    steps: ["Choose Size", "Choose Color", "Choose Logo", "Your Info", "Summary"],
    size: "Choose Size", color: "Choose Color", logo: "Choose Logo",
    uploadLogo: "Upload your logo", uploadBackLogo: "Upload back logo",
    info: "Your Info", summary: "Your Order Summary",
    name: "Name", email: "Email", phone: "Phone", governorate: "Governorate", address: "Address",
    price: "Price", next: "Next", back: "Back", Login: "Login", confirm: "Confirm Order",
    mustLogin: "⚠️ You must login first to order", completeAll: "❌ Please complete all fields!",
    success: "✅ Order submitted successfully!", fail: "❌ Something went wrong!",
    uploadFail: "⚠️ Problem uploading logo or connecting to server."
  },
  ar: {
    steps: ["اختار المقاس", "اختار اللون", "اختار اللوجو", "بياناتك", "ملخص الطلب"],
    size: "اختار المقاس", color: "اختار اللون", logo: "اختار اللوجو",
    uploadLogo: "ضيف لوجو الوش", uploadBackLogo: "ضيف لوجو الضهر",
    info: "بياناتك", summary: "ملخص طلبك",
    name: "الاسم", email: "الإيميل", phone: "رقم الهاتف", governorate: "المحافظة", address: "العنوان بالتفاصيل",
    price: "السعر", next: "التالي", back: "رجوع", Login: "سجل دخول", confirm: "تأكيد الطلب",
    mustLogin: "⚠️ لازم تسجل دخول الأول عشان تعمل طلب.", completeAll: "❌ اكمل كل البيانات!",
    success: "✅ تم إرسال الطلب بنجاح!", fail: "❌ حصل خطأ، حاول تاني.", uploadFail: "⚠️ مشكلة في رفع الصورة أو الاتصال بالسيرفر."
  }
};

export default function TshirtWizard() {
  const [step, setStep] = useState<Step>(1);
  const [uploadedLogoFile, setUploadedLogoFile] = useState<File | null>(null);
  const [uploadedBackLogoFile, setUploadedBackLogoFile] = useState<File | null>(null);
  const { lang } = useLanguage();
  const t = dict[lang];
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", governorate: "", address: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || prev.name,
        email: parsed.email || prev.email,
        phone: parsed.phone || prev.phone,
      }));
    }
    setLoadingUser(false);
  }, []);

  const [sizes, setSizes] = useState<Attribute[]>([]);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [logos, setLogos] = useState<Attribute[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedBackLogo, setSelectedBackLogo] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState(false);
  const [uploadedBackLogo, setUploadedBackLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAttributes = async () => {
    const res = await fetch("/api/attributes");
    const data = await res.json();
    if (data.success) {
      setSizes(data.attributes.filter((a: Attribute) => a.type === "size"));
      setColors(data.attributes.filter((a: Attribute) => a.type === "color"));
      setLogos(data.attributes.filter((a: Attribute) => a.type === "logo"));
    }
    setLoading(false);
  };

  useEffect(() => { fetchAttributes(); }, []);

  const shippingCost = 20;
  const price = (uploadedLogo || uploadedBackLogo ? 250 : 200) + shippingCost;

  const handleNext = () => setStep(prev => (prev < 5 ? (prev + 1) as Step : prev));
  const handlePrev = () => setStep(prev => (prev > 1 ? (prev - 1) as Step : prev));

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (!user) {
      setMessage({ type: "error", text: t.mustLogin });
      setSubmitting(false);
      return router.push("/Login");
    }

    if (!selectedSize || !selectedColor || !formData.name || !formData.email || !formData.phone || !formData.governorate || !formData.address) {
      setMessage({ type: "error", text: t.completeAll });
      setSubmitting(false);
      return;
    }

    try {
      let logoUrl = "", backLogoUrl = "";

      if (uploadedLogo && uploadedLogoFile) {
        const formDataCloud = new FormData();
        formDataCloud.append("file", uploadedLogoFile);
        formDataCloud.append("upload_preset", "unsigned_dashboard");
        formDataCloud.append("folder", "tshirt-logos");
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dfbadbos5/image/upload", { method: "POST", body: formDataCloud });
        const cloudData = await cloudRes.json();
        if (!cloudRes.ok || !cloudData.secure_url) throw new Error("Upload failed");
        logoUrl = cloudData.secure_url;
      } else if (selectedLogo) {
        logoUrl = selectedLogo;
      }

      if (uploadedBackLogo && uploadedBackLogoFile) {
        const formDataCloud = new FormData();
        formDataCloud.append("file", uploadedBackLogoFile);
        formDataCloud.append("upload_preset", "unsigned_dashboard");
        formDataCloud.append("folder", "tshirt-logos");
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dfbadbos5/image/upload", { method: "POST", body: formDataCloud });
        const cloudData = await cloudRes.json();
        if (!cloudRes.ok || !cloudData.secure_url) throw new Error("Upload failed");
        backLogoUrl = cloudData.secure_url;
      } else if (selectedBackLogo) {
        backLogoUrl = selectedBackLogo;
      }

      const items = [
        {
          productId: null,
          name: "Custom T-Shirt",
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
          price: uploadedLogo || uploadedBackLogo ? 250 : 200,
          discountedPrice: uploadedLogo || uploadedBackLogo ? 250 : 200,
          imageUrl: logoUrl,
          backImageUrl: backLogoUrl,
        }
      ];

      const orderData = {
        items,
        shipping: shippingCost,
        total: items.reduce((acc, i) => acc + i.discountedPrice, 0) + shippingCost,
        coupon: "",
        customer: formData,
        userId: user._id,
        date: new Date().toISOString(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: t.success });
        setOrderConfirmed(true);
      } else {
        setMessage({ type: "error", text: t.fail });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: t.uploadFail });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#6366f1]" /></div>;
  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg font-bold mb-4">{t.mustLogin}</p>
      <button onClick={() => router.push("/Login")} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white">{t.Login}</button>
    </div>
  );

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl w-full rounded-3xl shadow-xl p-8 bg-white dark:bg-zinc-900">
        <div className="flex justify-between mb-6">
          {[1,2,3,4,5].map(s => <div key={s} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${step >= s ? "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white" : "bg-gray-400 text-black"}`}>{s}</div>)}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">{t.size}</h2>
            <Swiper slidesPerView={3} spaceBetween={15}>
              {sizes.map(s => (
                <SwiperSlide key={s._id}>
                  <motion.div whileTap={{ scale:0.9 }} className={`p-6 rounded-2xl shadow-md  cursor-pointer text-center font-bold ${selectedSize === s.value ? "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white" : "bg-gradient-to-br  dark:from-slate-900 dark:via-slate-800 dark:to-slate-950"}`} onClick={() => setSelectedSize(s.value || "")}>{s.value}</motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">{t.color}</h2>
            <Swiper slidesPerView={3} spaceBetween={15}>
              {colors.map(c => (
                <SwiperSlide key={c._id}>
                  <motion.div whileTap={{ scale:0.9 }} className={`p-6 h-24 rounded-2xl shadow-md text-${[c.value]} bg-${[c.value]} cursor-pointer flex items-center justify-center font-bold ${selectedColor === c.value ? "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] te ": ""}`} onClick={() => setSelectedColor(c.value || "")}>
                    {c.value}
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">{t.logo}</h2>
            <Swiper slidesPerView={2} spaceBetween={15}>
              {/* Front Logo */}
              <SwiperSlide>
                <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed cursor-pointer bg-gradient-to-r from-[#0ea5e9]/20 via-[#6366f1]/20 to-[#22d3ee]/20">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>{uploadedLogoFile ? uploadedLogoFile.name : t.uploadLogo}</span>
                  <input type="file" className="hidden" onChange={e => { if(e.target.files?.[0]) { setUploadedLogoFile(e.target.files[0]); setUploadedLogo(true); setSelectedLogo(e.target.files[0].name); } }} />
                </label>
              </SwiperSlide>

              {/* Back Logo */}
              <SwiperSlide>
                <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed cursor-pointer bg-gradient-to-r from-[#22d3ee]/20 via-[#6366f1]/20 to-[#0ea5e9]/20">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>{uploadedBackLogoFile ? uploadedBackLogoFile.name : t.uploadBackLogo}</span>
                  <input type="file" className="hidden" onChange={e => { if(e.target.files?.[0]) { setUploadedBackLogoFile(e.target.files[0]); setUploadedBackLogo(true); setSelectedBackLogo(e.target.files[0].name); } }} />
                </label>
              </SwiperSlide>

              {logos.map(l => (
                <SwiperSlide key={l._id}>
                  <motion.div whileTap={{ scale:0.9 }} className={`p-4 rounded-2xl shadow-md cursor-pointer ${selectedLogo === l.logoUrl ? "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]" : "bg-gray-400"}`} onClick={() => { setSelectedLogo(l.logoUrl || ""); setUploadedLogo(false); }}>
                    <img src={l.logoUrl} alt="logo" className="w-full h-32 object-contain" />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}

         {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gray-900/10 text-white">{t.info}</h2>
            <div className="space-y-4 font-bold">
              <input type="text" placeholder={t.name} value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} className="w-full mt-2 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-gray-900/10 text-white" />
              <input type="email" placeholder={t.email} value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} className="w-full mt-2 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-gray-900/10 text-white" />
              <input type="tel" placeholder={t.phone} value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} className="w-full mt-2 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-gray-900/10 text-white" />
              <input type="text" placeholder={t.governorate} value={formData.governorate} onChange={e => setFormData({...formData, governorate:e.target.value})} className="w-full mt-2 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-gray-900/10 text-white" />
              <textarea placeholder={t.address} value={formData.address} onChange={e => setFormData({...formData, address:e.target.value})} className="w-full mt-2 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-gray-900/10 text-white" />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gray-900/10 text-white">{t.summary}</h2>
            <ul className="space-y-2 font-bold text-white">
              <li>{t.size}: {selectedSize}</li>
              <li>{t.color}: {selectedColor}</li>
              <li className="flex items-center gap-2">
                {t.logo} (Front): 
                {selectedLogo && (
                  <img src={selectedLogo} alt="logo" className="w-16 h-16 object-contain rounded-lg border" />
                )}
              </li>
              <li className="flex items-center gap-2">
                {t.logo} (Back): 
                {selectedBackLogo && (
                  <img src={selectedBackLogo} alt="back-logo" className="w-16 h-16 object-contain rounded-lg border" />
                )}
              </li>
              <li>{t.name}: {formData.name}</li>
              <li>{t.email}: {formData.email}</li>
              <li>{t.phone}: {formData.phone}</li>
              <li>{t.governorate}: {formData.governorate}</li>
              <li>{t.address}: {formData.address}</li>
              <li> سعر المنتج: {uploadedLogo || uploadedBackLogo ? 250 : 200} جنيه</li>
              <li> سعر الشحن: {shippingCost} جنيه</li>
              <li className="text-xl font-bold text-green-700">الإجمالي: {price} جنيه</li>
            </ul>
          </>
        )}

        {/* أزرار التنقل */}
        <div className="flex justify-between mt-6">
          {step > 1 && !orderConfirmed && (
            <button onClick={handlePrev} className="px-4 py-2 rounded-xl bg-gray-400 text-white">
              {t.back}
            </button>
          )}

          {step < 5 && !orderConfirmed && (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedSize) ||
                (step === 2 && !selectedColor) ||
                (step === 3 && !selectedLogo && !uploadedLogo) ||
                (step === 4 &&
                  (!formData.name ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.governorate ||
                    !formData.address))
              }
              className="ml-auto px-6 py-2 rounded-xl bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white font-bold"
            >
              {t.next}
            </button>
          )}

          {step === 5 && !orderConfirmed && (
            <button
              onClick={handleSubmit}
              disabled={orderConfirmed || submitting}
              className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${
                orderConfirmed || submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] text-white"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" /> جاري الإرسال
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> {t.confirm}
                </>
              )}
            </button>
          )}

          {step === 5 && orderConfirmed && (
            <div className="flex gap-3 ml-auto">
              <button onClick={() => window.print()} className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold">
                طباعة الفاتورة
              </button>
              <button onClick={() => router.push('/profile/components/OrdersPage')} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold">
                متابعة الطلب
              </button>
            </div>
          )}
        </div>

        {/* رسالة الحالة */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 p-4 rounded-xl text-center font-bold ${message.type==="success"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}
          >
            {message.text}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

