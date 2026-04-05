import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { useState } from 'react';
import MenuForm from './Partials/MenuForm';

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

export default function MenusIndex({ masterMenus, dailyMenus, foodItems }: MenusProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (menu: Menu) => {
        if (confirm(`Apakah Anda yakin ingin menghapus resep "${menu.menu_name}"?`)) {
            destroy(route('menus.destroy', menu.id));
        }
    };

    return (
        <AuthenticatedLayout
            header="Katalog Menu"
        >
            <Head title="Manajemen Menu" />

            <div className="space-y-12 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline uppercase italic">Katalog Menu & Resep</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide text-xs">
                            Kelola resep standar dan distribusi menu harian.
                        </p>
                    </div>
                    
                    <Link 
                        href={route('menus.create')}
                        className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        Buat Resep Baru
                        <span className="material-symbols-outlined">restaurant_menu</span>
                    </Link>
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
                            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-emerald-900/5 text-emerald-800/30 italic font-black uppercase tracking-widest text-[10px]">
                                Belum ada resep terdaftar.
                            </div>
                        ) : (
                            masterMenus.map((menu) => (
                                <div key={menu.id} className="bg-white rounded-[2rem] overflow-hidden border border-emerald-900/5 shadow-sm group hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500">
                                    <div className="aspect-video bg-emerald-50 relative overflow-hidden">
                                        {menu.image_url ? (
                                            <img src={menu.image_url} alt={menu.menu_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
                                                <span className="material-symbols-outlined text-5xl opacity-20">flatware</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            <Link 
                                                href={route('menus.edit', menu.id)}
                                                className="w-10 h-10 bg-white shadow-xl rounded-full text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(menu)}
                                                className="w-10 h-10 bg-white shadow-xl rounded-full text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-emerald-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em]">
                                                {menu.target_group}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-black text-emerald-900 mb-2 truncate group-hover:text-emerald-600 transition-colors">{menu.menu_name}</h4>
                                        <p className="text-emerald-800/50 text-[10px] leading-relaxed line-clamp-2 min-h-[2.5rem] antialiased">
                                            {menu.items?.length || 0} Bahan Baku Terdaftar
                                        </p>
                                        
                                        <Link href={route('menus.show', menu.id)} className="mt-4 w-full py-4 bg-emerald-50 text-emerald-900 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-900 hover:text-white transition-all flex items-center justify-center gap-2">
                                            Detail Bahan & Gizi
                                            <span className="material-symbols-outlined text-[14px]">nutrition</span>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Daily Menus Section */}
                <section className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative shadow-2xl shadow-emerald-950/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[120px]"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl font-black font-headline tracking-tight">Distribusi Menu Terkini</h3>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">Lacak pengiriman dan perencanaan mingguan</p>
                        </div>
                        <Link href="/planner" className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                            Buka Smart Planner
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                        </Link>
                    </div>

                    <div className="relative z-10 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-white/5">
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tanggal</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sekolah</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Menu Master</th>
                                    <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {dailyMenus.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-600 italic text-[10px] font-black uppercase tracking-[0.3em]">
                                            Belum ada distribusi menu tercatat.
                                        </td>
                                    </tr>
                                ) : (
                                    dailyMenus.map((dm) => (
                                        <tr key={dm.id} className="group hover:bg-white/5 transition-all cursor-default">
                                            <td className="py-7 font-black text-xs text-emerald-400">
                                                {new Date(dm.menu_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="py-7 font-bold text-sm tracking-tight">{dm.school?.school_name}</td>
                                            <td className="py-7">
                                                <span className="text-xs font-medium text-slate-300">{dm.master_menu?.menu_name}</span>
                                            </td>
                                            <td className="py-7 text-right">
                                                <button className="w-10 h-10 bg-white/5 hover:bg-white hover:text-slate-900 rounded-xl transition-all flex items-center justify-center ml-auto">
                                                    <span className="material-symbols-outlined text-xl">print</span>
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
