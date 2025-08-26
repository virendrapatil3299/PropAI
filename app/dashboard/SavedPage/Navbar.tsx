"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Settings,
  Clock,
  Bookmark,
  Store,
  Menu,
  X,
} from "lucide-react";
import type { ReactNode, ReactElement } from "react";
import { useState } from "react";

interface NavbarProps {
  children?: ReactNode;
}

export default function Navbar({ children }: NavbarProps): ReactElement {
  const pathname = usePathname() ?? ""; // fix null issue
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard/saved", label: "Saved homes", icon: Bookmark },
    { href: "/dashboard/PropertyDetails", label: "Property Sell", icon: Store },
    { href: "/dashboard/home", label: "Your home", icon: Home },
    { href: "/dashboard/RenterHub", label: "Renter Hub", icon: Building2 },
    { href: "/dashboard/Settings", label: "Settings", icon: Settings },
    { href: "/dashboard/RecentlyViewed", label: "Recently Viewed", icon: Clock },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <nav className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-600">PropAI</h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex items-center gap-2 pb-1 transition-colors ${
                  isActive(href)
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="flex flex-col mt-3 space-y-3 md:hidden">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors ${
                  isActive(href)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
