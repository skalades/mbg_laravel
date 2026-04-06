import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "planner", icon: "restaurant_menu", label: "Penyusun Menu (Planner)", href: "/planner" },
  { id: "menus", icon: "library_books", label: "Pustaka Menu Induk", href: "/menus" },
  { id: "audit", icon: "camera_alt", label: "Audit & Kontrol QC", href: "/audit" },
  { id: "logistics", icon: "local_shipping", label: "Pelacak Logistik", href: "/kitchens" },
  { id: "schools", icon: "school", label: "Sekolah & Siswa", href: "/schools" },
  { id: "food-items", icon: "nutrition", label: "Katalog Bahan Gizi", href: "/food-items" },
  { id: "portions", icon: "scale", label: "Manajemen Porsi", href: "/portions" },
  { id: "kitchen-mgmt", icon: "kitchen", label: "Manajemen Dapur", href: "/kitchens", adminOnly: true },
  { id: "user-mgmt", icon: "manage_accounts", label: "Manajemen Pengguna", href: "/users", adminOnly: true },
];

export default function Sidebar() {
  const { url } = usePage();
  const user = usePage().props.auth.user as any;

  // Filter based on roles in real implementation
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'ADMIN') return false;
    return true;
  });

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col py-8 px-4 h-screen w-64 border-r-0 bg-emerald-50 z-50">
      <div className="mb-10 px-4">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/logo-nutrizi.png" 
            alt="Nutrizi Logo" 
            className="h-9 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold font-headline text-emerald-900 tracking-tight">Nutrizi</h1>
        </div>
        <p className="text-[9px] uppercase tracking-widest text-emerald-800/60 font-semibold mt-2 px-1 leading-relaxed">Developed by Nadir under SKALADES Group</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const isActive = url === item.href || url.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
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
          Buat Rencana Menu
        </button>
        <div className="pt-4 border-t border-emerald-900/10 space-y-1">
          <Link href="/profile" className="flex items-center px-2 py-2 text-sm text-emerald-800/60 hover:text-emerald-900 transition-colors">
            <span className="material-symbols-outlined mr-3 text-lg">settings</span>
            Pengaturan Profil
          </Link>
          <Link href={route('logout')} method="post" as="button" className="flex w-full items-center px-2 py-2 text-sm text-emerald-800/60 hover:text-red-600 transition-colors">
            <span className="material-symbols-outlined mr-3 text-lg">logout</span>
            Keluar Sistem
          </Link>
        </div>
      </div>
    </aside>
  );
}
