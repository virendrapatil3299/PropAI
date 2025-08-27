<<<<<<< HEAD
"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 px-6 py-8">{children}</main>
    </div>
  );
=======
// app/dashboard/layout.tsx
import Navbar from "./Navbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Navbar>{children}</Navbar>; // 👈 Now pages render in bottom section
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
}
