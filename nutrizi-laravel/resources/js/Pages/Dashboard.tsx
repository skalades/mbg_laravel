import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { useState } from 'react';
import { 
    Users, 
    School, 
    ClipboardList, 
    ShieldCheck, 
    TrendingUp, 
    Calendar, 
    ArrowRight, 
    Zap, 
    Activity,
    ChefHat,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

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
        <AuthenticatedLayout header="Pusat Komando Operasional">
            <Head title="Dashboard" />

            <div className="max-w-[1600px] mx-auto space-y-10 pb-32 animate-in fade-in duration-1000">
                {/* Header with Period Filter */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-8 rounded-[3rem] border border-emerald-900/5 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-950/20">
                            <Activity className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-emerald-950 font-headline uppercase">Dashboard Real-time</h2>
                            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
                                {kitchenName 
                                    ? `Monitoring Operasional: ${kitchenName}` 
                                    : "Analisis logistik & kepatuhan gizi terpusat."}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 p-1.5 rounded-2xl flex border border-emerald-900/5 shadow-inner w-full lg:w-auto">
                        {[
                            { id: "daily", label: "Hari Ini" },
                            { id: "weekly", label: "Mingguan" },
                            { id: "monthly", label: "Bulanan" }
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={cn(
                                    "flex-1 lg:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    period === p.id 
                                        ? "bg-emerald-900 text-white shadow-xl shadow-emerald-900/20 scale-105" 
                                        : "text-emerald-900/40 hover:text-emerald-950 hover:bg-white"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Dashboard Left Column */}
                    <div className="col-span-12 lg:col-span-9 space-y-10">
                        
                        {/* Summary Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { 
                                    label: 'Penerima Manfaat', 
                                    val: stats.active_beneficiaries.toLocaleString(), 
                                    icon: Users, 
                                    color: 'emerald',
                                    badge: 'Live'
                                },
                                { 
                                    label: 'Unit Sekolah', 
                                    val: stats.total_schools, 
                                    icon: School, 
                                    color: 'blue',
                                    badge: 'Aktif'
                                },
                                { 
                                    label: 'Menu Terbit', 
                                    val: stats.total_menus, 
                                    icon: ClipboardList, 
                                    color: 'purple',
                                    badge: 'Siklus'
                                },
                                { 
                                    label: 'Skor Kepatuhan', 
                                    val: `${stats.compliance_rate}%`, 
                                    icon: ShieldCheck, 
                                    color: 'premium',
                                    badge: 'Gizi'
                                }
                            ].map((stat, i) => (
                                <div key={i} className={cn(
                                    "p-8 rounded-[2.5rem] transition-all hover:-translate-y-2 group shadow-sm border",
                                    stat.color === 'premium' 
                                        ? "bg-emerald-900 border-emerald-900 shadow-emerald-900/20" 
                                        : "bg-white border-emerald-900/5"
                                )}>
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                                            stat.color === 'premium' ? "bg-white/10 text-white" : `bg-${stat.color}-50 text-${stat.color}-900`
                                        )}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className={cn(
                                            "text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border",
                                            stat.color === 'premium' ? "text-white/60 border-white/10" : `text-${stat.color}-600 bg-${stat.color}-50 border-${stat.color}-100`
                                        )}>
                                            {stat.badge}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-[9px] font-black uppercase tracking-widest mb-1",
                                        stat.color === 'premium' ? "text-white/40" : "text-emerald-900/30"
                                    )}>{stat.label}</p>
                                    <p className={cn(
                                        "text-4xl font-black font-headline tracking-tighter",
                                        stat.color === 'premium' ? "text-white" : "text-emerald-950"
                                    )}>{stat.val}</p>
                                </div>
                            ))}
                        </section>

                        {/* Hero CTA Section */}
                        <section className="relative overflow-hidden rounded-[4rem] bg-slate-950 p-16 flex items-center min-h-[450px] group shadow-2xl shadow-slate-900/40">
                            <div className="relative z-20 max-w-xl">
                                <div className="inline-flex items-center gap-3 bg-white/5 text-emerald-400 text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-[0.3em] mb-10 border border-white/5 backdrop-blur-md">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                    AI-Driven Batch Planner
                                </div>
                                <h2 className="text-6xl font-black text-white leading-[1.05] mb-8 font-headline tracking-tight">Presisi Nutrisi Untuk Generasi.</h2>
                                <p className="text-slate-400 mb-12 text-xl leading-relaxed font-medium">Susun siklus menu batch untuk seluruh unit sekolah dengan standarisasi gizi terautomasi.</p>
                                <Link href="/planner" className="inline-flex bg-emerald-700 text-white px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 hover:translate-y-[-4px] transition-all items-center gap-5 shadow-2xl shadow-emerald-900/40 active:scale-95 group/btn">
                                    Mulai Batch Planning
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
                                </Link>
                            </div>
                            <div className="absolute inset-0 transition-transform duration-[3000ms] group-hover:scale-110 opacity-70">
                                <img 
                                    className="w-full h-full object-cover mix-blend-overlay" 
                                    alt="Healthy meal" 
                                    src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                            </div>
                        </section>

                        {/* Activity Feed Section */}
                        <section className="bg-white p-12 rounded-[3.5rem] border border-emerald-900/5 shadow-sm">
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex items-center gap-4">
                                    <TrendingUp className="w-6 h-6 text-emerald-900/20" />
                                    <h3 className="text-3xl font-black font-headline text-emerald-900 uppercase tracking-tight">Timeline Aktivitas</h3>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 hover:text-emerald-950 hover:bg-emerald-50 px-6 py-3 rounded-2xl transition-all border border-transparent hover:border-emerald-900/5">
                                    Download Laporan Log
                                </button>
                            </div>
                            <div className="space-y-6">
                                {recentActivity.length === 0 ? (
                                    <div className="py-24 text-center space-y-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto">
                                            <Activity className="w-8 h-8" />
                                        </div>
                                        <p className="text-emerald-900/20 text-xs font-black uppercase tracking-widest italic">Belum ada transmisi data masuk.</p>
                                    </div>
                                ) : (
                                    recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-emerald-900/5 group">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                                                activity.color === 'emerald' ? "bg-emerald-950 text-emerald-100" : "bg-white text-blue-900 border border-blue-50"
                                            )}>
                                                {/* Fallback to simple icon if Lucide icon name not dynamically matched */}
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="font-black text-emerald-950 text-lg">{activity.title}</h4>
                                                    <span className="text-[9px] font-black text-emerald-900/20 uppercase tracking-[0.2em]">{activity.time}</span>
                                                </div>
                                                <p className="text-sm text-emerald-950/40 font-medium leading-relaxed">{activity.description}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Dashboard Right Column (Secondary Sidebar) */}
                    <div className="col-span-12 lg:col-span-3 space-y-10">
                        {/* Schedule Widget */}
                        <section className="bg-emerald-900 text-white p-10 rounded-[3.5rem] shadow-2xl shadow-emerald-900/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                            
                            <div className="flex items-center gap-3 mb-10 text-emerald-400 relative z-10">
                                <Calendar className="w-5 h-5" />
                                <h3 className="font-black text-[10px] tracking-[0.3em] uppercase">Logistik Hari Ini</h3>
                            </div>

                            <div className="py-16 text-center space-y-6 relative z-10">
                                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-white/10 group-hover:text-emerald-400 transition-colors">
                                    <ClipboardList className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-black font-headline">Zero Tasks</p>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest px-4">Seluruh distribusi menu batch telah disinkronisasi.</p>
                                </div>
                            </div>
                            
                            <Link href="/planner" className="w-full mt-10 py-5 bg-white text-emerald-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all relative z-10 active:scale-95 flex items-center justify-center gap-3 shadow-xl">
                                Buka Master Planner
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </section>

                        {/* Integration Status Card */}
                        <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-900/20 space-y-8 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mb-12 blur-2xl" />
                            
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Node Diagnostics</p>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-4">
                                            <Zap className="w-4 h-4 text-emerald-400" /> Laravel Engine
                                        </span>
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
                                    </div>
                                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-4">
                                            <Activity className="w-4 h-4 text-emerald-200" /> Inertia Tunnel
                                        </span>
                                        <span className="text-[8px] font-black text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20 uppercase tracking-widest">Stable</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-4">
                                            <ChefHat className="w-4 h-4 text-amber-400" /> Gizi Matrix
                                        </span>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3 mb-2 text-rose-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Sistem Alert</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Seluruh sinkronisasi gizi (kcal/macros) kini menggunakan parameter dinamis database.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
