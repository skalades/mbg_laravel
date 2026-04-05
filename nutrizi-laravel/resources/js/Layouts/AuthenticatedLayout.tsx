import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Nutrizi Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Navigation / Header */}
                <header className="h-20 border-b border-emerald-900/5 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold font-headline text-emerald-900 leading-tight">
                            {header || 'Dashboard Overview'}
                        </h2>
                        {user.kitchen && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800/50 uppercase tracking-widest mt-0.5">
                                <span className="material-symbols-outlined text-xs">location_on</span>
                                {user.kitchen.kitchen_name}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status/Notifications (Placeholder) */}
                        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-900/5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-wider">Sistem Aktif</span>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-4 pl-6 border-l border-emerald-900/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-emerald-900 leading-none">{user.full_name || user.username}</p>
                                <p className="text-[10px] font-medium text-emerald-800/50 mt-1 uppercase tracking-tighter italic">
                                    {user.title || user.role}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold border-2 border-white shadow-sm ring-1 ring-emerald-900/5">
                                {(user.full_name?.[0] || user.username[0]).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 pb-20">
                    <div className="mx-auto max-w-7xl animate-in fade-in duration-700">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-auto py-6 px-8 border-t border-emerald-900/5 text-center">
                    <p className="text-[10px] font-medium text-emerald-800/40 uppercase tracking-widest">
                        © 2026 Nutrizi Management System — SKALADES Agentic Core
                    </p>
                </footer>
            </div>
        </div>
    );
}
