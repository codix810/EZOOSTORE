import { ReactNode } from "react";
import Navbar from "../app/compnents/Navbar";
import Footer from "../app/compnents/Footer";

import ThemeProviderClient from "../app/compnents/ThemeProviderClient";
import { LanguageProvider } from "../app/compnents/LanguageContext";

import './globals.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/400.css';
import '@fontsource/inter/400.css';

export const metadata = {
  title: "EZOO Store",
  description: `
    تسوق أحدث التيشرتات الشبابية من EZOO Store: جودة عالية، تصميم عصري، 
    توصيل سريع لحد باب المنزل، وميزة تصميم تشرتك بنفسك. 
    Shop the latest trendy and stylish t-shirts for youth, premium quality, fast home delivery, and customize your own t-shirt!
  `,
  keywords: `
    EZOO Store, تيشرتات شباب, ملابس شباب, تيشيرت, تيشرت رجالي, تيشرت نسائي, 
    تصميم تشرتك, Customize T-Shirt, تيشرت شبابي, ملابس أونلاين, Streetwear, 
    Summer T-Shirts, Youth Fashion, Casual T-Shirts, Trending Shirts, تيشرت صيفي, تيشرت موضة, 
    Buy T-Shirts Online, Online Clothing Store, توصيل لحد باب المنزل, تصميم تشرتك بنفسك
  `,
    icons: {
    icon: "https://ezoo-stor.vercel.app/EZOO.png",
  },
  author: "EZOO Store",
  viewport: "width=device-width, initial-scale=1",
  canonical: "https://ezoo-stor.vercel.app/",

  openGraph: {
    title: "EZOO Store - تيشرتات شبابية وعصرية",
    description: "جودة عالية، تصميم عصري، توصيل سريع لحد باب المنزل، وتصميم تشرتك بنفسك!",
      url: "https://ezoo-stor.vercel.app/EZOO.png", 
    siteName: "EZOO Store",
    images: [
      {
        url: "/EZOO.png", // لازم يكون عندك صورة OG
        width: 1200,
        height: 630,
        alt: "EZOO Store - تيشرتات شبابية",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@EZOOStore",
    title: "EZOO Store - تيشرتات شبابية وعصرية",
    description: "جودة عالية، تصميم عصري، توصيل سريع لحد باب المنزل، وتصميم تشرتك بنفسك!",
  image: "https://ezoo-stor.vercel.app/EZOO.png",
  },

  // Schema.org JSON-LD لتحسين SEO
  schema: {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "EZOO Store",
    url: "https://ezoo-stor.vercel.app/",
  logo: "https://ezoo-stor.vercel.app/EZOO.png",
    sameAs: [
      "https://www.facebook.com/EZOOStore",
      "https://www.instagram.com/EZOOStore",
      "https://twitter.com/EZOOStore"
    ],
    description: "متجر EZOO Store لبيع تيشرتات شبابي، تصميم عصري، توصيل سريع لحد باب المنزل، وتصميم تشرتك بنفسك.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "https://ezoo-stor.vercel.app/join",
      telephone: "+20-1153121543"
    }
  }
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen transition-colors duration-300">
        <ThemeProviderClient>
          <LanguageProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
