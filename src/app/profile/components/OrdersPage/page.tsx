'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../compnents/LanguageContext";

type ItemType = {
  _id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  discountedPrice: number;
  imageUrl: string;
};

type CustomerType = {
  name: string;
  email?: string;
  phone?: string;
  governorate?: string;
  address?: string;
};

type OrderType = {
  _id: string;
  status?: string;
  total: number;
  items: ItemType[];
  customer: CustomerType;
  createdAt?: string;
};
interface OrderItem {
  _id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
}

const dict = {
  en: {
    title: "My Orders",
    empty: "No orders yet",
    size: "Size",
    color: "Color",
    price: "Price",
    status: "Status",
    delivered: "Delivered",
    processing: "Processing",
    Cancelled:"Cancelled",
    pending: "Pending",
    customer: "Customer",
    address: "Address",
    quantity: "Quantity",
    cancel: "Cancel Order",
    return: "Return",
    total: "Total"
  },
  ar: {
    title: "طلباتي",
    empty: "لا يوجد طلبات بعد",
    size: "المقاس",
    color: "اللون",
    price: "السعر",
    status: "الحالة",
    delivered: "تم التسليم",
    processing: "قيد المعالجة",
    Cancelled:"ملغي",
    pending: "معلق",
    customer: "العميل",
    address: "العنوان",
    quantity: "الكمية",
    cancel: "الغاء الطلب",
    return: "طلب الإرجاع",
    total: "الإجمالي"
  },
};

const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee] bg-[length:200%_200%] animate-gradient-x";

export default function OrdersPage() {
  const { lang } = useLanguage();
  const t = dict[lang];
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<{ _id: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return router.push("/login");
    setUser(JSON.parse(savedUser));
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user/${user._id}`);
        const data = await res.json();
        if (!data.success) throw new Error("فشل جلب الطلبات");

const ordersWithIds: OrderType[] = (data.orders || []).map((order: OrderType) => ({
  _id: order._id,
  total: order.total || 0,
  items: (order.items || []).map((item: OrderItem) => ({
    _id: item._id,
    name: item.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.price,
    discountedPrice: item.discountedPrice,
    imageUrl: item.imageUrl,
  })),


          customer: {
            name: order.customer.name,
            email: order.customer.email,
            phone: order.customer.phone,
            address: order.customer.address,
            governorate: order.customer.governorate,
          },
          status: order.status,
          createdAt: order.createdAt,
        }));

        setOrders(ordersWithIds);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: lang === "ar" ? "ملغي" : "Cancelled" })
      });
      const data = await res.json();
      if (data.order) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status: lang === "ar" ? "ملغي" : "Cancelled" } : o));
      }
    } catch (err) {
      console.error("❌ فشل إلغاء الطلب", err);
    }
  };

  const handleReturn = async (id: string) => {
    if (!user?._id || !id) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: lang === "ar" ? "قيد الإرجاع" : "Return Requested" })
      });
      const data = await res.json();
      if (data.order) {
        const res2 = await fetch(`/api/orders/user/${user._id}`);
        const data2 = await res2.json();
        setOrders(data2.orders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto mt-14"
    >
      <h2 className={`text-3xl font-extrabold mb-6 text-center ${gradientClass} bg-clip-text text-transparent`}>
        {t.title}
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-6 text-lg">{t.empty}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1">
          {orders.map((order, index) => {
            const statusLabel =
              order.status === "تم التسليم" || order.status === "Delivered"
                ? t.delivered
                : order.status === "قيد المعالجة" || order.status === "Processing"
                ? t.processing
                : order.status === "ملغي" || order.status === "Cancelled"
                ? t.Cancelled
                : order.status === "قيد الإرجاع" || order.status === "Return Requested"
                ? t.return
                : t.pending;

            const statusColor =
              statusLabel === t.delivered
                ? "bg-green-500"
                : statusLabel === t.processing
                ? "bg-yellow-500"
                : statusLabel === t.Cancelled
                ? "bg-red-500"
                : statusLabel === t.return
                ? "bg-blue-500"
                : "bg-gray-400";

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="shadow-lg rounded-2xl p-5 bg-gradient-to-br text-white from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{t.customer}: <span className="font-normal">{order.customer.name}</span></p>
                    <p className="font-semibold">{t.address}: <span className="font-normal">{order.customer.address}</span></p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-black">
                  {order.items.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain rounded-lg border" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p>{t.size}: {item.size}</p>
                        <p>{t.color}: {item.color}</p>
                        <p>{t.quantity}: {item.quantity}</p>
                        <p className="text-green-600">{t.price}: {item.discountedPrice} {lang === "ar" ? "ج.م" : "EGP"}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="font-semibold mt-3">{t.total}: {order.total} {lang === "ar" ? "ج.م" : "EGP"}</p>

                <p className="font-semibold mt-2">
                  {t.status}: <span className={`ml-2 px-2 py-0.5 rounded text-white text-sm ${statusColor}`}>{statusLabel}</span>
                </p>

                <p className="text-gray-400 text-sm text-right mt-2">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US") : ""}
                </p>

                <div className="flex gap-3 mt-4">
                  {!(["ملغي", "Cancelled", "تم التسليم", "Delivered", "قيد الإرجاع", "Return Requested"].includes(order.status || "")) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className={`px-4 py-2 rounded-xl text-white font-bold transition ${gradientClass}`}
                    >
                      {t.cancel}
                    </button>
                  )}

                  {(order.status === "تم التسليم" || order.status === "Delivered") && (
                    <button
                      onClick={() => handleReturn(order._id)}
                      className="px-4 py-2 rounded-xl bg-[#6366f1] text-white font-bold hover:bg-[#4f46e5] transition"
                    >
                      {t.return}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
