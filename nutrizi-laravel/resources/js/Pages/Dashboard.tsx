import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { useState } from 'react';

interface DashboardProps extends PageProps {
    stats: {
        total_schools: number;
        total_menus: number;
        active_beneficiaries: number;
        compliance_rate: number;
    };
    recentActivity: any[];
    upcomingSchedule: any;
    allergyAlerts: any[];
    kitchenName: string | null;
}

export default function Dashboard({ stats, recentActivity, upcomingSchedule, allergyAlerts, kitchenName }: DashboardProps) {
    const [period, setPeriod] = useState("daily");

    return (
        <AuthenticatedLayout
            header="Pusat Komando"
        >
            <Head title="Dashboard" />

            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header with Period Filter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Selamat Datang</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            {kitchenName 
                                ? `Dashboard Operasional: ${kitchenName}` 
                                : "Pantau operasional gizi dan logistik secara real-time."}
                        </p>
                    </div>
                    
                    <div className="bg-emerald-50 p-1.5 rounded-2xl flex border border-emerald-900/5 shadow-inner">
                        {[
                            { id: "daily", label: "Hari Ini" },
                            { id: "weekly", label: "Mingguan" },
                            { id: "monthly", label: "Bulanan" }
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    period === p.id 
                                        ? "bg-emerald-900 text-white shadow-lg" 
                                        : "text-emerald-800/50 hover:text-emerald-900"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Dashboard Left Column */}
                    <div className="col-span-12 lg:col-span-9 space-y-8">
                        
                        {/* Summary Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-[2rem] transition-all hover:translate-y-[-4px] shadow-sm border border-emerald-900/5 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">Global</span>
                                </div>
                                <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest">Total Penerima Manfaat</p>
                                <p className="text-3xl font-black font-headline text-emerald-900 mt-2">{stats.active_beneficiaries.toLocaleString()}</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-[2rem] transition-all hover:translate-y-[-4px] shadow-sm border border-emerald-900/5 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">Aktif</span>
                                </div>
                                <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest">Sekolah Mitra</p>
                                <p className="text-3xl font-black font-headline text-emerald-900 mt-2">{stats.total_schools}</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-[2rem] transition-all hover:translate-y-[-4px] shadow-sm border border-emerald-900/5 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-purple-50 text-purple-900 rounded-2xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-purple-100">Periode Ini</span>
                                </div>
                                <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest">Menu Sudah Terbit</p>
                                <p className="text-3xl font-black font-headline text-emerald-900 mt-2">{stats.total_menus}</p>
                            </div>
                            
                            <div className="bg-emerald-900 p-6 rounded-[2rem] shadow-xl shadow-emerald-900/10 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="p-3 bg-white/10 text-white rounded-2xl group-hover:rotate-12 transition-transform">
                                        <span className="material-symbols-outlined">verified_user</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white/80 border border-white/20 px-3 py-1.5 rounded-full uppercase tracking-widest">Lulus QC</span>
                                </div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest relative z-10">Skor Kepatuhan</p>
                                <p className="text-3xl font-black font-headline text-white mt-2 relative z-10">{stats.compliance_rate}%</p>
                            </div>
                        </section>

                        {/* Hero CTA Section */}
                        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 flex items-center min-h-[350px] group shadow-2xl shadow-slate-900/20">
                            <div className="relative z-10 max-w-lg">
                                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-6 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Smart Planner Aktif
                                </div>
                                <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 font-headline tracking-tight">Optimalkan Nutrisi Hari Ini.</h2>
                                <p className="text-slate-400 mb-10 text-lg leading-relaxed">Mulai siklus menu baru dengan deteksi alergi otomatis dan analisis biaya yang akurat.</p>
                                <Link href="/planner" className="inline-flex bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-sm hover:translate-y-[-4px] transition-all items-center gap-4 shadow-xl shadow-emerald-900/30 active:scale-95">
                                    Mulai Susun Menu
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105 opacity-60">
                                <img 
                                    className="w-full h-full object-cover mix-blend-overlay" 
                                    alt="Healthy meal" 
                                    src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
                            </div>
                        </section>

                        {/* Activity Feed Section */}
                        <section className="bg-white p-10 rounded-[3rem] border border-emerald-900/5 shadow-sm">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black font-headline text-emerald-900">Aktivitas Terbaru</h3>
                                <button className="text-xs font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-full transition-all">Lihat Semua Riwayat</button>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.length === 0 ? (
                                    <p className="text-center py-20 text-emerald-800/30 font-medium italic">Belum ada aktivitas tercatat untuk periode ini.</p>
                                ) : (
                                    recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100">
                                            <div className={cn(
                                                "p-3 rounded-xl flex items-center justify-center shrink-0",
                                                activity.color === 'emerald' ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"
                                            )}>
                                                <span className="material-symbols-outlined">{activity.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-emerald-900 text-sm">{activity.title}</h4>
                                                    <span className="text-[10px] font-medium text-emerald-800/30 uppercase tracking-widest">{activity.time}</span>
                                                </div>
                                                <p className="text-xs text-emerald-800/50 mt-1 leading-relaxed">{activity.description}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Dashboard Right Column (Secondary Sidebar) */}
                    <div className="col-span-12 lg:col-span-3 space-y-8">
                        {/* Schedule Widget */}
                        <section className="bg-emerald-800 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
                            
                            <div className="flex items-center gap-2 mb-8 text-emerald-200 relative z-10">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <h3 className="font-black text-[10px] tracking-[0.2em] uppercase">Jadwal Mendatang</h3>
                            </div>

                            <div className="py-10 text-center space-y-4 relative z-10">
                                <span className="material-symbols-outlined text-4xl opacity-20">event_busy</span>
                                <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Belum ada jadwal hari ini</p>
                            </div>
                            
                            <Link href="/planner" className="w-full mt-8 py-4 bg-white/5 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all relative z-10 active:scale-95 flex items-center justify-center">
                                Lihat Kalender Penuh
                            </Link>
                        </section>

                        {/* Integration Status Card */}
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 font-headline">Integritas Sistem</p>
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-emerald-400">api</span> Laravel Core
                                </span>
                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]"></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-emerald-200">bolt</span> Inertia.js
                                </span>
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Optimized</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
