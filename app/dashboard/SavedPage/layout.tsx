// app/dashboard/layout.tsx
import Navbar from "./Navbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Navbar>{children}</Navbar>; // 👈 Now pages render in bottom section
}
