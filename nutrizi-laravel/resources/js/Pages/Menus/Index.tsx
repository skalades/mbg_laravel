import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { 
    Plus, 
    ChefHat, 
    Utensils, 
    Trash2, 
    Edit, 
    Search, 
    Calendar, 
    Printer, 
    ArrowRight, 
    FileText,
    History,
    LayoutGrid
} from 'lucide-react';

interface FoodItem {
    id: number;
    name: string;
    category: string;
}

interface MenuItem {
    food_item_id: number;
    portion_name: string;
    weight_small: number;
    weight_large: number;
}

interface Menu {
    id: number;
    menu_name: string;
    description?: string;
    image_url?: string;
    target_group: string;
    items: MenuItem[];
}

interface DailyMenu {
    id: number;
    menu_date: string;
    school: {
        school_name: string;
    };
    master_menu: {
        menu_name: string;
    };
}

interface MenusProps extends PageProps {
    masterMenus: Menu[];
    dailyMenus: DailyMenu[];
    foodItems: FoodItem[];
}

export default function MenusIndex({ masterMenus, dailyMenus }: MenusProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (menu: Menu) => {
        if (confirm(`Apakah Anda yakin ingin menghapus resep "${menu.menu_name}"?`)) {
            destroy(route('menus.destroy', menu.id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout header="Katalog & Resep Gizi">
            <Head title="Manajemen Menu" />

            <div className="max-w-[1600px] mx-auto space-y-12 pb-32 animate-in fade-in duration-1000">
                {/* Header Action Bar */}
                <div className="flex flex-col lg:flex-row items-center gap-8 bg-white p-8 rounded-[3rem] border border-emerald-900/5 shadow-sm">
                    <div className="flex items-center gap-5 min-w-[300px]">
                        <div className="w-16 h-16 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-950/20">
                            <ChefHat className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-emerald-950 font-headline uppercase tracking-tight leading-none">Master Menu</h2>
                            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Standarisasi Resep & Nutrisi</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20 group-focus-within:text-emerald-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari resep menu (Ayam, Nasi, Sayur...)"
                            className="w-full pl-14 pr-12 h-14 bg-slate-50 border-none rounded-[1.5rem] font-bold text-emerald-950 placeholder:text-emerald-900/20 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner"
                        />
                    </div>
                    
                    <Link 
                        href={route('menus.create')}
                        className="w-full lg:w-auto h-14 bg-emerald-900 text-white px-10 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-emerald-900/20 active:scale-95 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        Buat Resep
                    </Link>
                </div>

                {/* Master Menus Grid */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3 text-emerald-900/20">
                            <LayoutGrid className="w-5 h-5" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Database Resep Standar</h3>
                        </div>
                        <div className="h-px bg-emerald-900/5 flex-1 mx-8 hidden lg:block"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {masterMenus.length === 0 ? (
                            <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-emerald-900/5 text-emerald-900/10 font-black uppercase tracking-[0.2em]">
                                <ChefHat className="w-20 h-20 mx-auto mb-6 opacity-5" />
                                Belum ada resep yang terdaftar di sistem.
                            </div>
                        ) : (
                            masterMenus.map((menu) => (
                                <div key={menu.id} className="bg-white rounded-[3rem] overflow-hidden border border-emerald-900/5 shadow-sm group hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-2 transition-all duration-700">
                                    <div className="aspect-[4/3] bg-emerald-50 relative overflow-hidden">
                                        {menu.image_url ? (
                                            <img src={menu.image_url} alt={menu.menu_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-emerald-900/10 bg-gradient-to-br from-slate-50 to-emerald-50">
                                                <Utensils className="w-12 h-12 opacity-10" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-6 right-6 flex gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                            <Link 
                                                href={route('menus.edit', menu.id)}
                                                className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all shadow-2xl shadow-black/20"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(menu)}
                                                className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-2xl shadow-black/20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-emerald-950 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                {menu.target_group}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div>
                                            <h4 className="text-xl font-black text-emerald-950 mb-2 truncate group-hover:text-emerald-700 transition-colors leading-tight">{menu.menu_name}</h4>
                                            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <FileText className="w-3 h-3" />
                                                {menu.items?.length || 0} Bahan Baku Terdaftar
                                            </p>
                                        </div>
                                        
                                        <Link 
                                            href={route('menus.show', menu.id)} 
                                            className="w-full py-5 bg-slate-50 text-emerald-900 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-900 hover:text-white transition-all flex items-center justify-center gap-3"
                                        >
                                            Kalkulasi Gizi
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Daily Distribution History Section */}
                <section className="bg-slate-950 rounded-[4rem] p-16 text-white overflow-hidden relative shadow-2xl shadow-emerald-950/20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[120px] animate-pulse"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-emerald-400 border border-white/5">
                                <History className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black font-headline tracking-tight uppercase leading-none">Log Distribusi</h3>
                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] mt-3">Monitoring Sinkronisasi Menu Unit</p>
                            </div>
                        </div>

                        <Link 
                            href="/planner" 
                            className="bg-emerald-800 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-emerald-950 transition-all flex items-center gap-4 shadow-xl"
                        >
                            <Calendar className="w-5 h-5" />
                            Buka Smart Planner
                        </Link>
                    </div>

                    <div className="relative z-10 overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-white/5">
                                    <th className="pb-10 pl-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timeline</th>
                                    <th className="pb-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Unit Sekolah</th>
                                    <th className="pb-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Master Recipe</th>
                                    <th className="pb-10 pr-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {dailyMenus.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center">
                                            <div className="text-slate-700 space-y-4">
                                                <Calendar className="w-12 h-12 mx-auto opacity-20" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Belum ada data distribusi tersinkronisasi.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    dailyMenus.map((dm) => (
                                        <tr key={dm.id} className="group hover:bg-white/5 transition-all">
                                            <td className="py-9 pl-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-emerald-400">
                                                        {new Date(dm.menu_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                                    </span>
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                                                        {new Date(dm.menu_date).getFullYear()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-9 pr-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                                        {dm.school?.school_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-9">
                                                <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">
                                                    {dm.master_menu?.menu_name}
                                                </span>
                                            </td>
                                            <td className="py-9 pr-4 text-right">
                                                <button className="w-12 h-12 bg-white/5 border border-white/5 hover:bg-white hover:text-black rounded-2xl transition-all flex items-center justify-center ml-auto shadow-sm active:scale-90">
                                                    <Printer className="w-5 h-5" />
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
