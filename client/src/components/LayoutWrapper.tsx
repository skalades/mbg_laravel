"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      
      {/* Top Header */}
      <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-40 bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,52,43,0.06)]">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-sm" 
              placeholder="Search data or schools..." 
              type="text" 
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="relative p-2 text-on-surface-variant hover:text-emerald-900 transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          <button className="p-2 text-on-surface-variant hover:text-emerald-900 transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <div className="text-right">
              <p className="text-sm font-bold font-headline text-primary leading-none">Admin Nutrizi</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Super User</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-900 border-2 border-primary-fixed">
              AG
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 pt-24 pb-12 px-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
