"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { useLanguage } from "./LanguageContext";
import Link from "next/link";

const gradientClass =
  "bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#22d3ee]";

const dict = {
  en: { galleryTitle: "Our Designs", latest: "Latest Designs", designDesc: "Short description for design", new: "New", off: "OFF" },
  ar: { galleryTitle: "تصميمتنا", latest: "أحدث التصاميم", designDesc: "وصف قصير للتصميم", new: "جديد", off: "خصم" },
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("ar-EG").format(n) + " ج.م";
}

type Product = {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  discount?: number;
  category?: string;
};

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

function DesignCard({ item, lang }: { item: Product; lang: "ar" | "en" }) {
  const t = dict[lang];
  const hasDiscount = item.discount !== undefined && item.discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(item.price * (1 - (item.discount ?? 0) / 100))
    : item.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ scale: 1.05, boxShadow: "0px 12px 35px rgba(0,0,0,0.25)" }}
      className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br  dark:from-[#1e293b]/10 dark:to-[#0f172a]/10 backdrop-blur-sm cursor-pointer"
    >
      <Link href={`/OurDesigns/${item._id}`}>
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <motion.img
            src={item.imageUrl}
            alt={item.name}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
          />
          {item.category === "new" && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-green-600/90 shadow">
              {t.new}
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-rose-600/90 shadow">
              {item.discount}% {t.off}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <h3 className={`text-lg font-extrabold mb-2 ${gradientClass} bg-clip-text text-transparent`}>
          {item.name}
        </h3>
        <p className=" text-sm sm:text-base line-clamp-2">
          {item.description || t.designDesc}
        </p>
        <p className="mt-3 font-extrabold text-xl">{formatPrice(finalPrice)}</p>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: ProductsResponse) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section className="py-20 px-4 sm:px-10 lg:px-20 relative bg-[#fdfd] dark:bg-[#0f172a]/10">
      {/* 🟢 سلايدر بعرض الشاشة يعرض أحدث 6 منتجات */}
      {loaded && products.length > 0 && (
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`text-center text-4xl sm:text-5xl font-extrabold mb-12 ${gradientClass} bg-clip-text text-transparent`}
          >
            {dict[lang].latest}
          </motion.h2>

          <Swiper
            modules={[Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            effect="fade"
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            {products
              .slice(0, 6)
              .map((item) => (
                <SwiperSlide key={item._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative h-[70vh] w-full flex items-center justify-center"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
                      <h3 className="text-3xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
                        {item.name}
                      </h3>
                      <p className="mb-4 max-w-2xl text-lg sm:text-xl">
                        {item.description || dict[lang].designDesc}
                      </p>
                      <Link
                        href={`/OurDesigns/${item._id}`}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold shadow-lg hover:scale-105 transition"
                      >
                        {formatPrice(item.price)}
                      </Link>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      )}

      {/* 🔵 السلايدر العادي (مع منتجات مرتبة) */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={`text-center text-4xl sm:text-5xl font-extrabold mb-12 ${gradientClass} bg-clip-text text-transparent`}
      >
        <Link href="/OurDesigns">{dict[lang].galleryTitle}</Link>
      </motion.h2>

      {loaded && products.length > 0 && (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={25}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {products.map((item) => (
            <SwiperSlide key={item._id}>
              <DesignCard item={item} lang={lang} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
