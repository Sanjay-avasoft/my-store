"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";

export default function Navbar() {
  const totalItems = useCart((s) => s.totalItems);
  const toggleCart = useCart((s) => s.toggleCart);

  return (
    <nav className="bg-white shadow sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          My Store
        </Link>
        <div className="flex items-center gap-6">
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Admin
        </Link>
        <button onClick={toggleCart} className="relative cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          {totalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems()}
            </span>
          )}
        </button>
        </div>
      </div>
    </nav>
  );
}
