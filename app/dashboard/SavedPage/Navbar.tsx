"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  Store,
  Building2,
  Settings,
  Clock,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname() ?? "";

  const navItems = [
    { href: "/dashboard/Home", label: "Your home", icon: Home },
    { href: "/dashboard/saved", label: "Saved homes", icon: Bookmark },
    { href: "/dashboard/PropertyDetails", label: "Property Sell", icon: Store },
    { href: "/dashboard/RenterHub", label: "Renter Hub", icon: Building2 },
    { href: "/dashboard/Settings", label: "Settings", icon: Settings },
    { href: "/dashboard/RecentlyViewed", label: "Recently Viewed", icon: Clock },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard/Home") {
      return pathname === "/dashboard" || pathname === "/dashboard/Home";
    }
    return pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-lg font-bold text-blue-600">PropAI</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="w-6 h-6 text-gray-700" />
          </SheetTrigger>
          <SheetContent side="right" className="p-6">
            {/* Accessibility fix: Add hidden title */}
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col space-y-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(href)
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
