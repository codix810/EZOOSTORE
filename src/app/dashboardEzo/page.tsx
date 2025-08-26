'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaChartLine, FaSmileWink } from 'react-icons/fa';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userStr || !token) {
    router.replace('/Login'); 
    return;
  }

  const user = JSON.parse(userStr);

  if (user.role !== 'admin') { 
    router.replace('/'); 
  } else {
    setLoading(false); 
  }
}, [router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>جاري التحقق من بيانات الدخول...</span>
      </div>
    );
  }

  return (
    <div className="p-8 flex mt-16 flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <FaChartLine className="text-red-600 text-6xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-800 flex items-center justify-center gap-2">
          أهلاً بك في لوحة التحكم
          <FaSmileWink className="text-yellow-500" />
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          مرحباً بك! استمتع بإدارة محتويات موقعك بكل سهولة واحترافية
        </p>
      </motion.div>

      <motion.img
        src="https://stories.freepiklabs.com/storage/13368/299-Business-plan_Artboard-1.svg"
        alt="Business Plan Illustration"
        className="w-64 md:w-80 mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
    </div>
  );
}
