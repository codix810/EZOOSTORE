"use client";

import HeroPage from "./compnents/HeroPage";
import GalleryPage from "./compnents/GalleryPage";
import StrangePage from "./compnents/StrangePage";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <HeroPage />
      <GalleryPage />
      <StrangePage />
    </div>
  );
}
