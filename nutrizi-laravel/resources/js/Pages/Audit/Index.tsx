import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

export default function AuditIndex({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            header="Audit & Kontrol Kualitas"
        >
            <Head title="Audit & QC" />

            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Audit & Quality Control</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            Pastikan standar keamanan pangan dan kepatuhan gizi terjaga.
                        </p>
                    </div>
                    
                    <button className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:translate-y-[-2px] transition-all flex items-center gap-3">
                        Mulai Audit Baru
                        <span className="material-symbols-outlined">assignment_turned_in</span>
                    </button>
                </div>

                {/* Audit Performance Card */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-emerald-950/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-emerald-500/15 transition-colors duration-700"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                Standar MBG Terpenuhi
                            </div>
                            <h3 className="text-5xl font-black font-headline leading-tight">Integritas Gizi Tanpa Kompromi.</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                Pantau suhu masakan, pengemasan, hingga waktu distribusi secara real-time untuk menjamin kualitas terbaik bagi siswa.
                            </p>
                        </div>
                        
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/5" />
                                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="502.4" strokeDashoffset="10" className="text-emerald-500 shadow-lg" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black font-headline">98%</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Compliance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-900/5 shadow-sm space-y-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">thermostat</span>
                        </div>
                        <h4 className="text-xl font-black text-emerald-900 font-headline">Monitoring Suhu</h4>
                        <p className="text-emerald-800/50 text-sm leading-relaxed">
                            Integrasi Food Thermometer digital untuk pencatatan suhu internal masakan dan suhu unit distribusi secara otomatis.
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                           <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                           Dalam Pengembangan
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-900/5 shadow-sm space-y-6">
                        <div className="w-16 h-16 bg-purple-50 text-purple-900 rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">photo_camera</span>
                        </div>
                        <h4 className="text-xl font-black text-emerald-900 font-headline">Bukti Visual QC</h4>
                        <p className="text-emerald-800/50 text-sm leading-relaxed">
                            Pengambilan foto menu siap distribusi dengan kompresi cerdas untuk dokumentasi kepatuhan porsi dan penyajian.
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600">
                           <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                           Dalam Pengembangan
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
