'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react";

interface Customer {
  name: string;
  email?: string;
  phone?: string;
  governorate?: string;
  address?: string;
}

interface Item {
  _id: string;
  productId?: string | null;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  imageUrl?: string;
  status?: string;
}

interface Order {
  _id: string;
  items: Item[];
  discount?: number;
  coupon?: string;
  shipping?: number;
  total?: number;
  status?: string;
  customer: Customer;
  createdAt: string;
}

export default function ViewOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error('❌ Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('⚠️ هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelivered = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "تم التسليم" })
      });
      const data = await res.json();
      if (data.success) setOrders(prev => prev.map(o => o._id === id ? { ...o, status: "تم التسليم" } : o));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#d4a373]" />
    </div>
  );

  return (
    <div className="p-2 max-w-9xl mx-auto mt-14 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#6b705c]">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#fef9f0] via-[#f5f5dc] to-[#d4a373] text-gray-800">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Governorate</th>
                <th className="px-4 py-2">Item Name</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Logo</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) =>
                order.items.map((item, itemIdx) => {
                  const statusColor =
                    order.status === "تم التسليم"
                      ? "bg-green-500"
                      : order.status === "ملغي"
                      ? "bg-red-500"
                      : "bg-yellow-500";

                  return (
                    <tr key={item._id} className="border-b hover:bg-[#f9f7f1] transition">
                      <td className="px-4 py-2">{idx + 1}.{itemIdx + 1}</td>
                      <td className="px-4 py-2 font-medium">{order.customer?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{order.customer?.phone || 'N/A'}</td>
                      <td className="px-4 py-2">{order.customer?.address || 'N/A'}</td>
                      <td className="px-4 py-2">{order.customer?.governorate || 'N/A'}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.size}</td>
                      <td className="px-4 py-2">{item.color}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2 text-red-600 font-semibold">${item.price}</td>

                      <td className="px-4 py-2 relative">
                        {item.imageUrl && (
                          <>
                            <img
                              src={item.imageUrl}
                              alt="Logo"
                              className="w-10 h-10 object-contain rounded-md border cursor-pointer"
                              onClick={() => setDropdownOpen(dropdownOpen === item._id ? null : item._id)}
                            />
                            {dropdownOpen === item._id && (
                              <div className="absolute mt-1 w-24 bg-white border rounded shadow-lg z-10">
                                <a
                                  href={item.imageUrl}
                                  download
                                  className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setDropdownOpen(null)}
                                >
                                  تحميل
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </td>

                      <td className="px-4 py-2 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-sm font-semibold">
                        <span className={`px-2 py-0.5 rounded text-white ${statusColor}`}>
                          {order.status || 'معلق'}
                        </span>
                      </td>
                      {itemIdx === 0 && (
                        <td className="px-4 py-2 flex gap-2" rowSpan={order.items.length}>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow"
                          >
                            Delete
                          </button>
                          {order.status !== "تم التسليم" && order.status !== "ملغي" && (
                            <button
                              onClick={() => handleDelivered(order._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm shadow"
                            >
                              Delivered
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
