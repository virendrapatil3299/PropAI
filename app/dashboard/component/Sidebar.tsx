"use client"

import { Home, BarChart3, Map, Layers, DollarSign, Box, Activity, ClipboardList } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Market Analysis", icon: BarChart3, href: "/market-analysis" },
  { name: "Zoning Optimizer", icon: Map, href: "/zoning-optimizer" },
  { name: "Financial Planning", icon: DollarSign, href: "/financial-planning" },
  { name: "Scenario Planning", icon: Layers, href: "/scenario-planning" },
  { name: "Project Management", icon: ClipboardList, href: "/project-management" },
  { name: "3D Models", icon: Box, href: "/models" },
  { name: "Investment Heatmap", icon: Activity, href: "/heatmap" },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-md h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">🏠 RealEstateAI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
