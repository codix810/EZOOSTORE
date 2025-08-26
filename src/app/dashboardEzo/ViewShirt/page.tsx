"use client";

import { useEffect, useState } from "react";
import { Trash } from "lucide-react";

type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  imageUrl: string;
};

export default function ProductsManager() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
      setMessage("فشل في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف المنتج؟")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMessage("تم حذف المنتج بنجاح");
        setProducts(products.filter(p => p._id !== id));
      } else {
        setMessage(data.message || "فشل في الحذف");
      }
    } catch (err) {
      console.error(err);
      setMessage("حدث خطأ في الحذف");
    }
  };

  if (loading) return <div className="text-center mt-10">جارٍ التحميل...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {message && <div className="mb-4 text-center text-red-600">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white text-black p-4 rounded-2xl shadow-md flex flex-col items-center">
            <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-3" />
            <h3 className="font-bold text-lg text-center">{product.name}</h3>
            <p className="text-gray-600 text-sm text-center mb-2">{product.description}</p>
            <p className="text-gray-800 font-semibold text-center mb-2">
              السعر: {product.price} {product.discount ? `| خصم: ${product.discount}` : ""} | النوع: {product.category}
            </p>
            <button
              onClick={() => handleDelete(product._id)}
              className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Trash className="w-5 h-5" /> حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
