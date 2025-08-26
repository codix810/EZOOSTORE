"use client";

import { useEffect, useState } from "react";
import { Send, Printer, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../compnents/LanguageContext";
import { motion } from "framer-motion";

// ================== Types ==================
type Tshirt = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  discount?: number;
};

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Attribute {
  _id: string;
  type: "size" | "color";
  value: string;
}

interface Form {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  governorate: string;
  address: string;
  coupon?: string;
}

type Msg = { type: "error" | "success"; text: string } | null;

const SHIPPING_COST = 20;
const VALID_COUPONS: Record<
  string,
  { discount?: number; freeShipping?: boolean; freeItem?: boolean }
> = {
  EZOO10: { discount: 10 },
  EZOO20: { discount: 20 },
  FREESHIP: { freeShipping: true },
};

// Gradient class
const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9]/10 via-[#6366f1] to-[#22d3ee] bg-[length:200%_200%] animate-gradient-x";

const dict = {
  en: {
    title: "Checkout",
    yourInfo: "Your Info",
    name: "Name",
    email: "Email",
    phone: "Phone",
    governorate: "Governorate",
    address: "Address",
    price: "Price",
    shipping: "Delivery",
    total: "Total",
    confirm: "Confirm & Pay",
    completeAll: "❌ Please complete all fields!",
    freeDelivery: "Free Delivery!",
    printInvoice: "Print Invoice",
    trackOrder: "Track Order",
    emptyCart: "No products in the cart",
    couponPlaceholder: "Enter discount code",
    applyCoupon: "Apply Coupon",
    successCoupon: "🎉 Coupon applied successfully",
    failCoupon: "❌ Invalid coupon",
  },
  ar: {
    title: "الدفع",
    yourInfo: "بياناتك",
    name: "الاسم",
    email: "الإيميل",
    phone: "رقم الهاتف",
    governorate: "المحافظة",
    address: "العنوان",
    price: "السعر",
    shipping: "التوصيل",
    total: "الإجمالي",
    confirm: "تأكيد والدفع",
    completeAll: "❌ اكمل كل البيانات!",
    freeDelivery: "التوصيل مجاني!",
    printInvoice: "طباعة الفاتورة",
    trackOrder: "تتبع الطلب",
    emptyCart: "لا يوجد منتجات في السلة",
    couponPlaceholder: "أدخل كوبون الخصم",
    applyCoupon: "تطبيق الكوبون",
    successCoupon: "🎉 مبروك! تم تطبيق الخصم",
    failCoupon: "❌ لا يوجد خصم",
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = dict[lang as "ar" | "en"] ?? dict.ar;

  const [cart, setCart] = useState<Tshirt[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sizes, setSizes] = useState<Attribute[]>([]);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [forms, setForms] = useState<Record<string, Form>>({});
  const [message, setMessage] = useState<Record<string, Msg>>({});
  const [orderPlaced] = useState(false);

  const priceWithDiscount = (item: Tshirt) =>
    item.discount ? Math.round((item.price * (100 - item.discount)) / 100) : item.price;

  // جهز الفورم لكل منتج
  const ensureFormFor = (items: Tshirt[], u: User | null) => {
    setForms((prev) => {
      const next = { ...prev };
      items.forEach((it) => {
        if (!next[it._id]) {
          next[it._id] = {
            selectedSize: "",
            selectedColor: "",
            quantity: 1,
            name: u?.name || "",
            email: u?.email || "",
            phone: u?.phone || "",
            governorate: "",
            address: "",
            coupon: "",
          };
        }
      });
      return next;
    });
  };

  useEffect(() => {
    const storedCart: Tshirt[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    const savedUser = localStorage.getItem("user");
    const u = savedUser ? JSON.parse(savedUser) : null;
    setUser(u);

    ensureFormFor(storedCart, u);

    fetch("/api/attributes")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setSizes(data.attributes.filter((a: Attribute) => a.type === "size"));
          setColors(data.attributes.filter((a: Attribute) => a.type === "color"));
        }
      });
  }, []);

  const mainForm = forms[cart[0]?._id];
  const couponCode = mainForm?.coupon?.toUpperCase().trim() || "";
  const coupon = VALID_COUPONS[couponCode];
  const totalQty = cart.reduce((acc, item) => acc + (forms[item._id]?.quantity || 1), 0);
  const baseSubtotal = cart.reduce(
    (acc, item) => acc + priceWithDiscount(item) * (forms[item._id]?.quantity || 1),
    0
  );
  const discountedSubtotal =
    coupon?.discount ? Math.round(baseSubtotal * (1 - coupon.discount / 100)) : baseSubtotal;
  const shippingPrice = coupon?.freeShipping || totalQty >= 4 ? 0 : SHIPPING_COST;
  const grandTotal = discountedSubtotal + shippingPrice;

  // ================== UI ==================
  if (cart.length === 0 && !orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-xl text-gray-700 dark:text-gray-200"
      >
        <Truck className="w-16 h-16 mb-4 text-cyan-500" />
        {t.emptyCart}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen mt-9 py-12 px-6 md:px-12 bg-gradient-to-br from-slate-100/10 via-slate-200/10 to-slate-300/10 dark:from-slate-900/10 dark:via-slate-800/10 dark:to-slate-900/10"
    >
      <h1
        className={`text-4xl font-extrabold mb-10 text-center ${gradientClass} bg-clip-text text-transparent`}
      >
        {t.title}
      </h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* LEFT: Items */}
        <div className="space-y-4">
          {cart.map((item) => {
            const f = forms[item._id];
            if (!f) return null;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-4 p-2 rounded-2xl shadow-lg bg-white dark:bg-slate-800 backdrop-blur-lg border border-white/20"
              >
                <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1 space-y-2">
                  <h2 className="font-bold text-lg  text-cyan-600 ">{item.name}</h2>
                  <p className="font-bold text-cyan-600">
                    {t.price}:{" "}
                    <span className="font-bold text-cyan-600">{priceWithDiscount(item)} ج.م</span>
                  </p>

                  {/* اختيارات */}
          <div className="flex flex-col sm:flex-row gap-2">
  <select
    className="border rounded px-2 py-1 text-cyan-600 flex-1"
    value={f.selectedSize}
    onChange={(e) =>
      setForms((prev) => ({
        ...prev,
        [item._id]: { ...f, selectedSize: e.target.value },
      }))
    }
  >
    <option value="">—Size—</option>
    {sizes.map((s) => (
      <option key={s._id} value={s.value}>
        {s.value}
      </option>
    ))}
  </select>

  <select
    className="border rounded px-2 py-1 text-cyan-600 flex-1"
    value={f.selectedColor}
    onChange={(e) =>
      setForms((prev) => ({
        ...prev,
        [item._id]: { ...f, selectedColor: e.target.value },
      }))
    }
  >
    <option value="">—Color—</option>
    {colors.map((c) => (
      <option
        key={c._id}
        value={c.value}
        className={`border rounded px-2 py-1 w-20 bg-gradient-to-br from-slate-900 dark:via-slate-800 dark:to-slate-950 text-${c.value}`}
      >
        {c.value}
      </option>
    ))}
  </select>

  <input
    type="number"
    min={1}
    className="border rounded px-2 py-1 w-15 text-cyan-600 flex-1"
    value={f.quantity}
    onChange={(e) =>
      setForms((prev) => ({
        ...prev,
        [item._id]: {
          ...f,
          quantity: Math.max(1, Number(e.target.value) || 1),
        },
      }))
    }
  />
</div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT: Customer Form & Summary */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-2 rounded-2xl shadow-lg bg-white dark:bg-slate-800 backdrop-blur-lg border border-white/20 space-y-4"
        >
          <h3 className="font-bold text-lg  text-cyan-600">{t.yourInfo}</h3>

          {mainForm && (
            <>
              {(["name", "email", "phone", "governorate"] as const).map((field) => (
                <input
                  key={field}
                  placeholder={t[field]}
                  className="w-full border rounded px-3 py-2  text-cyan-600"
                  value={(mainForm as any)[field] || ""}
                  onChange={(e) =>
                    setForms((prev) => {
                      const next = { ...prev };
                      for (const id of Object.keys(next)) {
                        next[id] = { ...next[id], [field]: e.target.value };
                      }
                      return next;
                    })
                  }
                />
              ))}
              <textarea
                placeholder={t.address}
                className="w-full border rounded px-3 py-2  text-cyan-600"
                value={mainForm.address}
                onChange={(e) =>
                  setForms((prev) => {
                    const next = { ...prev };
                    for (const id of Object.keys(next)) {
                      next[id] = { ...next[id], address: e.target.value };
                    }
                    return next;
                  })
                }
              />
            </>
          )}

          {/* Coupon */}
          <div className="flex gap-2 mt-3  text-cyan-600">
            <input
              type="text"
              placeholder={t.couponPlaceholder}
              className="flex-1 border rounded px-3 py-2  text-cyan-600"
              value={mainForm?.coupon || ""}
              onChange={(e) =>
                setForms((prev) => {
                  const next = { ...prev };
                  for (const id of Object.keys(next)) {
                    next[id] = { ...next[id], coupon: e.target.value.toUpperCase() };
                  }
                  return next;
                })
              }
            />
            <button
              className={`px-4 rounded-lg text-white ${gradientClass} shadow-md hover:scale-105 transition`}
              onClick={() => {
                const code = mainForm?.coupon || "";
                if (VALID_COUPONS[code]) {
                  setMessage({ coupon: { type: "success", text: t.successCoupon } });
                } else {
                  setMessage({ coupon: { type: "error", text: t.failCoupon } });
                }
              }}
            >
              {t.applyCoupon}
            </button>
          </div>

          {message.coupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center font-semibold ${
                message.coupon.type === "success"
                  ? "text-green-600 animate-bounce"
                  : "text-red-600"
              }`}
            >
              {message.coupon.text}
            </motion.div>
          )}

          {/* Summary */}
          <div className="mt-4 p-4 rounded-xl text-white bg-slate-100/40 dark:bg-slate-900/40 shadow-inner space-y-2">
            <div className="flex justify-between">
              <span>{t.price}</span>
              <span>{baseSubtotal} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>{t.shipping}</span>
              <span>
                {totalQty >= 4 || coupon?.freeShipping ? t.freeDelivery : SHIPPING_COST + " ج.م"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>{t.total}</span>
              <span>{grandTotal} ج.م</span>
            </div>
          </div>

          {!orderPlaced ? (
            <button
              className={`w-full py-3 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2 ${gradientClass}`}
            >
              <Send className="w-5 h-5" /> {t.confirm}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button className="w-full bg-blue-500 py-3 rounded-xl text-white font-bold shadow-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
                <Printer className="w-5 h-5" /> {t.printInvoice}
              </button>
              <button className="w-full bg-green-600 py-3 rounded-xl text-white font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                <Truck className="w-5 h-5" /> {t.trackOrder}
              </button>
            </div>
          )}
        </motion.div>
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
