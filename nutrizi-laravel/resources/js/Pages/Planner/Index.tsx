import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

export default function PlannerIndex({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            header="Perencanaan Menu"
        >
            <Head title="Smart Planner" />

            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Smart Planner</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            Susun siklus menu dengan dukungan AI dan analisis gizi otomatis.
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <button className="bg-white text-emerald-900 border border-emerald-900/10 px-6 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-sm hover:bg-emerald-50 transition-all flex items-center gap-3">
                            Unduh Laporan
                            <span className="material-symbols-outlined">download</span>
                        </button>
                        <button className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:translate-y-[-2px] transition-all flex items-center gap-3">
                            Siklus Baru
                            <span className="material-symbols-outlined">add_task</span>
                        </button>
                    </div>
                </div>

                {/* Empty State / Coming Soon */}
                <div className="bg-white p-20 rounded-[3rem] border border-emerald-900/5 shadow-sm text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 space-y-8">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                        </div>
                        
                        <div className="max-w-md mx-auto space-y-4">
                            <h3 className="text-2xl font-black text-emerald-900 font-headline">Modul Perencanaan Sedang Dioptimalkan</h3>
                            <p className="text-emerald-800/50 leading-relaxed">
                                Kami sedang mengintegrasikan mesin optimasi nutrisi untuk memastikan setiap menu memenuhi standar gizi MBG dengan biaya yang efisien.
                            </p>
                        </div>

                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-emerald-900/20 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <span className="material-symbols-outlined text-emerald-400 mb-6">analytics</span>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-2">Analisis Makro</h4>
                        <p className="text-slate-400 text-xs">Pantau distribusi Karbohidrat, Protein, dan Lemak secara real-time saat Anda menyusun menu.</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <span className="material-symbols-outlined text-blue-400 mb-6">payments</span>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-2">Cost Tracking</h4>
                        <p className="text-slate-400 text-xs">Estimasi biaya per porsi dihitung otomatis berdasarkan harga pasar terkini.</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <span className="material-symbols-outlined text-purple-400 mb-6">warning</span>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-2">Allergy Watch</h4>
                        <p className="text-slate-400 text-xs">Peringatan otomatis jika menu mengandung bahan pemicu alergi bagi siswa tertentu.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
