"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BadgePercent, ShoppingCart } from "lucide-react";
import { useLanguage } from "../compnents/LanguageContext";

// 🎨 Palette
const gradient = "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]";
const gradientText = `${gradient} bg-clip-text text-transparent`;

// 🌐 i18n
const dict = {
  ar: { pageTitle: "تيشيرتات مميزة", heroTitle: "الأكثر رواجًا", tripleTitle: "اختيارات سريعة", gridTitle: "العروض", new: "جديد", off: "خصم", Strange:"الغريب منو ", price: "السعر", from: "من", to: "إلى", order: "اطلب الآن", details: "تفاصيل المنتج" },
  en: { pageTitle: "Featured T‑Shirts", heroTitle: "Trending Now", tripleTitle: "Quick Picks", gridTitle: "Offers", new: "New", off: "OFF", Strange:"Something Strange",  price: "Price", from: "From", to: "To", order: "Order Now", details: "Product Details" },
};

// 🧮 helpers
function formatPrice(n: number) { return new Intl.NumberFormat("ar-EG").format(n) + " ج.م"; }
function chunk<T>(arr: T[], size: number): T[][] { const out: T[][] = []; for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size)); return out; }

// 💡 Product type
interface Product {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: "new" | "strange" | "discounted" | string;
  price: number;
  discount?: number;
}

// 🧩 Product Card
function ProductCard({ p, t }: { p: Product; t: typeof dict["ar"] }) {
  const hasDiscount = p.discount && p.discount > 0;
  const finalPrice = hasDiscount ? Math.round(p.price * (1 - (p.discount ?? 0) / 100)) : p.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group  rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden
                 bg-gradient-to-br from-[#000]/15 via-[#000]/10 to-[#000]/10
                 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/OurDesigns/${p._id}`} aria-label={t.details} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          {p.category === "new" && <span className="absolute top-3 start-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-green-600/90">{t.new}</span>}
          {hasDiscount && (
            <span className="absolute top-3 end-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-rose-600/90 flex items-center gap-1">
              <BadgePercent className="w-3.5 h-3.5" /> {p.discount}% {t.off}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className={`text-lg font-bold mb-1 ${gradientText}`}>{p.name}</h3>
        <p className="text-sm text-[#6b704c] mb-3">{p.description}</p>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-sm text-zinc-500 line-through">{formatPrice(p.price)}</span>
                <span className="text-xl font-extrabold">{formatPrice(finalPrice)}</span>
              </>
            ) : (
              <span className="text-xl font-extrabold">{formatPrice(p.price)}</span>
            )}
          </div>

          <Link
            href={`/OurDesigns/${p._id}?action=order`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300 ${gradient}`}
            aria-label={`${t.order} - ${p.name}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-semibold">{t.order}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// 🌐 Main Catalog Page
export default function CatalogPage() {
  const { lang } = useLanguage();
  const t = dict[lang as "ar" | "en"] ?? dict.ar;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { success: boolean; products: Product[] }) => {
        if (data.success) setProducts(data.products);
      })
      .catch(console.error);
  }, []);

  const discounted = useMemo(() => products.filter((p) => p.discount && p.discount > 0), [products]);
  const strangeProducts = useMemo(() => products.filter((p) => p.category === "strange"), [products]);
  const newProducts = useMemo(() => products.filter((p) => p.category === "new"), [products]);

  const triplesDiscounted = useMemo(() => chunk(discounted, 3), [discounted]);
  const triplesStrange = useMemo(() => chunk(strangeProducts, 3), [strangeProducts]);
  const triplesNew = useMemo(() => chunk(newProducts, 3), [newProducts]);

  return (
    <div className="min-h-screen mt-9 py-10 px-4 md:px-8 bg-gradient-to-br from-[#0ea5e9]/20 via-[#6366f1]/10 to-[#22d3ee]/10">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className={`text-3xl md:text-4xl font-extrabold text-center mb-10 ${gradientText}`}>
        {t.pageTitle}
      </motion.h1>

      {/* خصومات */}
      {triplesDiscounted.length > 0 && (
        <section className="mb-10">
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`text-2xl md:text-3xl font-bold mb-6 ${gradientText}`}>
            {t.off}
          </motion.h2>
          {triplesDiscounted.map((group, idx) => (
            <div key={`discount-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {group.map((p) => <ProductCard key={p._id} p={p} t={t} />)}
            </div>
          ))}
        </section>
      )}

      {/* جديد */}
      {triplesNew.length > 0 && (
        <section className="mb-10">
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`text-2xl md:text-3xl font-bold mb-6 ${gradientText}`}>
            {t.new}
          </motion.h2>
          {triplesNew.map((group, idx) => (
            <div key={`new-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {group.map((p) => <ProductCard key={p._id} p={p} t={t} />)}
            </div>
          ))}
        </section>
      )}

      {/* الغريب */}
      {triplesStrange.length > 0 && (
        <section className="mb-10">
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`text-2xl md:text-3xl font-bold mb-6 ${gradientText}`}>
            {t.Strange}
          </motion.h2>
          {triplesStrange.map((group, idx) => (
            <div key={`strange-${idx}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {group.map((p) => <ProductCard key={p._id} p={p} t={t} />)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
