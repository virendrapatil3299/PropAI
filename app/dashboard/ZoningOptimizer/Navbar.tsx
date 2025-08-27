// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  AlignJustify,
  User,
  Heart,
  Bell,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

// Sidebar navigation config
const navigation = [
  { name: "Home", icon: Home, href: "/" },
  { name: "My Profile", icon: User, href: "/dashboard/profile" },
  { name: "Saved Homes", icon: Heart, href: "/dashboard/saved" },
  { name: "Alerts", icon: Bell, href: "/dashboard/inbox" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "Logout", icon: LogOut, href: "/logout", special: true }, // styled red
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full border-b bg-white shadow-sm sticky top-0 left-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-blue-600 hover:opacity-90 transition"
          >
            PropAI
          </Link>

          {/* Right Menu */}
          <div className="flex space-x-6 text-sm font-medium items-center">
            <Link
              href="/dashboard/SavedPage"
              className="px-3 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Sell Property
            </Link>

            <Link
              href="/dashboard/MarketAnalysis"
              className="hover:text-blue-600 transition"
            >
              Investment
            </Link>
            <Link
              href="/dashboard/PropertyValuation"
              className="hover:text-blue-600 transition"
            >
              Valuation
            </Link>

            {/* Sidebar Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Open menu"
            >
              <AlignJustify className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="p-6 space-y-5 text-gray-700 font-medium">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-2 py-2 transition ${
                item.special
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "hover:bg-gray-100 hover:text-blue-600"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
