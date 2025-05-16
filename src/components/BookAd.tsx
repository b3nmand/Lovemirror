import React from "react";

export function BookAd() {
  return (
    <div
      className="rounded-xl p-4 mt-6 mb-2 flex flex-col items-center shadow-lg animate-fadeIn"
      style={{ background: "#D72638", color: "#fff" }}
      role="complementary"
      aria-label="Book Advertisement"
    >
      <h3 className="text-lg font-bold mb-2 text-center">
        The Cog Effect: Romantic Perspective 2
      </h3>
      <p className="text-sm mb-4 text-center">
        “The Cog Effect: Romantic Perspective 2” is the foundation behind LoveMirror’s core principles.<br />
        This insightful guidebook explores timeless frameworks for love, unity, and self-awareness in relationships — the same frameworks that shaped how LoveMirror measures emotional intelligence, compatibility, and personal growth.<br /><br />
        Read the book that helped build the app. Transform how you see love forever.
      </p>
      <a
        href="https://www.amazon.co.uk/Cog-Effect-Romantic-Perspective-ebook/dp/B0BM8H9D12"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all duration-200 font-semibold rounded-lg px-5 py-2 bg-white text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white shadow-md"
        style={{ minWidth: 160, textAlign: 'center' }}
      >
        Explore the Book
      </a>
    </div>
  );
} 