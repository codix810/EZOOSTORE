'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaPlusCircle,
  FaSignOutAlt,
  FaNewspaper,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (isLoggedIn !== 'true') {
      router.push('/Login');
    } else {
      setUsername(storedUsername || 'Admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/Login');
  };

  const linkClass =
    'flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 hover:bg-red-100';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar علوية */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-50 via-pink-50 to-orange-50 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* زر الهامبرجر للموبايل */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-700"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* اسم المستخدم */}
          <h1 className="text-lg font-bold text-gray-800">{username}</h1>

          {/* روابط الديسكتوب */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/dashboardEzo" className={`${linkClass} text-black`}>
              <FaNewspaper /> Dashboard
            </Link>
            <Link href="/dashboardEzo/ViewOrders" className={`${linkClass} text-black`}>
              <FaNewspaper /> view Orders
            </Link>
            <Link href="/dashboardEzo/AddShirt" className={`${linkClass} text-red-700`}>
              <FaNewspaper /> Add Shirt
            </Link>
              <Link href="/dashboardEzo/ViewShirt" className={`${linkClass} text-red-700`}>
              <FaNewspaper />ViewShirt
            </Link>
            <Link href="/dashboardEzo/Attributes" className={`${linkClass} text-red-500`}>
              <FaPlusCircle /> Add Attributes
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        {menuOpen && (
          <div className="lg:hidden flex flex-col bg-gradient-to-b from-red-50 via-pink-50 to-orange-50 shadow-inner px-4 pb-4 gap-2">
            <Link href="/dashboardEzo" className={`${linkClass} text-black`}>
              <FaNewspaper /> Dashboard
            </Link>
            <Link href="/dashboardEzo/ViewOrders" className={`${linkClass} text-black`}>
              <FaNewspaper /> view Orders
            </Link>
            <Link href="/dashboardEzo/AddShirt" className={`${linkClass} text-red-700`}>
              <FaNewspaper /> Add Shirt
            </Link>
              <Link href="/dashboardEzo/ViewShirt" className={`${linkClass} text-red-700`}>
              <FaNewspaper />ViewShirt
            </Link>
            <Link href="/dashboardEzo/Attributes" className={`${linkClass} text-red-500`}>
              <FaPlusCircle /> Add Attributes
            </Link>
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* المحتوى تحت الناف */}
      <main className="flex-1 mt-20 p-6">{children}</main>
    </div>
  );
}
