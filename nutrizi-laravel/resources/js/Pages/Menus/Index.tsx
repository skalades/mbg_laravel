import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

interface Menu {
    id: number;
    menu_name: string;
    description: string;
    image_url?: string;
}

interface DailyMenu {
    id: number;
    date: string;
    school: {
        school_name: string;
    };
}

interface MenusProps extends PageProps {
    masterMenus: Menu[];
    dailyMenus: DailyMenu[];
}

export default function MenusIndex({ masterMenus, dailyMenus }: MenusProps) {
    return (
        <AuthenticatedLayout
            header="Katalog Menu"
        >
            <Head title="Manajemen Menu" />

            <div className="space-y-12 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Katalog Menu & Resep</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            Kelola resep standar dan distribusi menu harian.
                        </p>
                    </div>
                    
                    <button className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:translate-y-[-2px] transition-all flex items-center gap-3">
                        Buat Resep Baru
                        <span className="material-symbols-outlined">restaurant_menu</span>
                    </button>
                </div>

                {/* Master Menus Grid */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-emerald-900/10 flex-1"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800/40">Resep Standar (Master)</h3>
                        <div className="h-px bg-emerald-900/10 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {masterMenus.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-emerald-800/30 italic">Belum ada resep terdaftar.</div>
                        ) : (
                            masterMenus.map((menu) => (
                                <div key={menu.id} className="bg-white rounded-[2rem] overflow-hidden border border-emerald-900/5 shadow-sm group hover:shadow-xl hover:translate-y-[-4px] transition-all">
                                    <div className="aspect-video bg-emerald-50 relative overflow-hidden">
                                        {menu.image_url ? (
                                            <img src={menu.image_url} alt={menu.menu_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-emerald-100">
                                                <span className="material-symbols-outlined text-4xl">flatware</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent"></div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-black text-emerald-900 mb-2 truncate">{menu.menu_name}</h4>
                                        <p className="text-emerald-800/50 text-[10px] leading-relaxed line-clamp-2 min-h-[2.5rem]">{menu.description || 'Tidak ada deskripsi.'}</p>
                                        <Link href={`/menus/${menu.id}`} className="mt-4 w-full py-3 bg-emerald-50 text-emerald-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900 hover:text-white transition-all flex items-center justify-center gap-2">
                                            Detail Resep
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Daily Menus Section */}
                <section className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <h3 className="text-2xl font-black font-headline">Distribusi Menu Terkini</h3>
                        <Link href="/planner" className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                            Buka Smart Planner
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>
                    </div>

                    <div className="relative z-10 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-white/5">
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Tanggal</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Sekolah</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {dailyMenus.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500 italic text-xs">Belum ada distribusi menu tercatat.</td>
                                    </tr>
                                ) : (
                                    dailyMenus.map((dm) => (
                                        <tr key={dm.id} className="group transition-colors">
                                            <td className="py-6 font-bold text-sm text-slate-300">{new Date(dm.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="py-6 font-bold text-sm">{dm.school.school_name}</td>
                                            <td className="py-6">
                                                <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                    Terpublikasi
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <button className="text-slate-500 hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">print</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
