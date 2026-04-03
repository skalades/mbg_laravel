"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/" },
  { icon: "restaurant_menu", label: "Meal Planner", href: "/planner" },
  { icon: "library_books", label: "Master Menu Library", href: "/master-menus" },
  { icon: "camera_alt", label: "Audit & QC", href: "/audit" },
  { icon: "local_shipping", label: "Logistics Tracker", href: "/logistics" },
  { icon: "school", label: "Sekolah & Siswa", href: "/schools" },
  { icon: "nutrition", label: "Master Bahan Gizi", href: "/food-items" },
  { icon: "scale", label: "Manajemen Porsi", href: "/portions" },
];



export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col py-8 px-4 h-screen w-64 border-r-0 bg-emerald-50 z-50">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold font-headline text-emerald-900 tracking-tight">Nutrizi</h1>
        <p className="text-[10px] uppercase tracking-widest text-emerald-800/60 font-semibold mt-1">Botanical Conservatory</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-emerald-900 font-bold border-r-4 border-emerald-900 bg-emerald-100/50" 
                  : "text-emerald-800/60 hover:text-emerald-900 hover:bg-emerald-100/30"
              )}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-4">
        <button className="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-lg hover:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Meal Plan
        </button>
        <div className="pt-4 border-t border-emerald-900/10 space-y-1">
          <Link href="/settings" className="flex items-center px-2 py-2 text-sm text-emerald-800/60 hover:text-emerald-900 transition-colors">
            <span className="material-symbols-outlined mr-3 text-lg">settings</span>
            Settings
          </Link>
          <Link href="/support" className="flex items-center px-2 py-2 text-sm text-emerald-800/60 hover:text-emerald-900 transition-colors">
            <span className="material-symbols-outlined mr-3 text-lg">help_outline</span>
            Support
          </Link>
          <div className="pt-2">
              <button 
                onClick={() => {/* logout function */}}
                className="w-full text-left flex items-center px-2 py-2 text-sm text-rose-600/60 hover:text-rose-700 transition-colors"
              >
              <span className="material-symbols-outlined mr-3 text-lg">logout</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
