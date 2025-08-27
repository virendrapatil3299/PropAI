"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
<<<<<<< HEAD
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
=======
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
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
    { href: "/dashboard/RenterHub", label: "Renter Hub", icon: Building2 },
    { href: "/dashboard/Settings", label: "Settings", icon: Settings },
    { href: "/dashboard/RecentlyViewed", label: "Recently Viewed", icon: Clock },
  ];

<<<<<<< HEAD
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
=======
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
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
  );
}
