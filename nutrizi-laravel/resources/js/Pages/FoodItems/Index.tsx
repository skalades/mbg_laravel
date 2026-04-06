import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import FoodItemForm from './Partials/FoodItemForm';
import { cn } from '@/lib/utils';
import { 
    Search, 
    Plus, 
    X, 
    Edit, 
    Trash2, 
    Utensils, 
    BarChart3, 
    BookOpen, 
    Filter,
    Loader2
} from 'lucide-react';

interface FoodItem {
    id: number;
    name: string;
    category: string;
    base_unit: string;
    base_quantity: number;
    urt_unit: string;
    urt_weight: number;
    energy_kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    yield_factor: number;
    image_url: string;
}

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
}

const Pagination = ({ links }: PaginationProps) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-12">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm",
                        link.active 
                            ? "bg-emerald-900 text-white border-emerald-900 shadow-emerald-900/20 scale-105" 
                            : !link.url 
                                ? "text-emerald-900/10 border-transparent cursor-not-allowed"
                                : "bg-white text-emerald-900/40 border-emerald-900/5 hover:border-emerald-900/20 hover:text-emerald-900"
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

interface Props {
    foodItems: {
        data: FoodItem[];
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        category?: string;
    };
    categories: string[];
}

export default function Index({ foodItems, filters, categories }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<FoodItem | undefined>(undefined);
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    // Debounced Search Logic
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                setIsSearching(true);
                router.get(route('food-items.index'), 
                    { search, category: filters.category }, 
                    { 
                        preserveState: true, 
                        replace: true,
                        onFinish: () => setIsSearching(false)
                    }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCategoryChange = (category?: string) => {
        router.get(route('food-items.index'), 
            { search, category: category }, 
            { preserveState: true, replace: true }
        );
    };

    const deleteItem = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
            router.delete(route('food-items.destroy', id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout header="Katalog Bahan & Gizi">
            <Head title="Katalog Gizi" />

            <div className="max-w-[1600px] mx-auto space-y-10 pb-32">
                {/* Search & Action Bar */}
                <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-emerald-900/5 shadow-sm">
                    <div className="flex-1 w-full relative group">
                        <Search className={cn(
                            "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                            isSearching ? "text-emerald-500 animate-pulse" : "text-emerald-950/20 group-focus-within:text-emerald-900"
                        )} />
                        <TextInput
                            className="w-full pl-14 pr-12 h-14 bg-slate-50 border-none rounded-[1.5rem] font-bold text-emerald-950 placeholder:text-emerald-900/20 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner"
                            placeholder="Cari bahan makanan atau gizi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-300 hover:text-rose-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => { setSelectedItem(undefined); setIsModalOpen(true); }}
                        className="w-full lg:w-auto h-14 bg-emerald-900 text-white px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-emerald-900/20 active:scale-95 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        Daftarkan Bahan
                    </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar scrollbar-none">
                    <button
                        onClick={() => handleCategoryChange(undefined)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap",
                            !filters.category 
                                ? "bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/20 scale-105" 
                                : "bg-white text-emerald-900/40 border-emerald-900/5 hover:border-emerald-900/20"
                        )}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap",
                                filters.category === cat
                                    ? "bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/20 scale-105" 
                                    : "bg-white text-emerald-900/40 border-emerald-900/5 hover:border-emerald-900/20"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Katalog', value: foodItems.total, icon: Utensils, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                        { label: 'Grup Distribusi', value: categories.length, icon: Filter, bg: 'bg-indigo-50', text: 'text-indigo-600' },
                        { label: 'Akurasi Gizi', value: '100%', icon: BarChart3, bg: 'bg-amber-50', text: 'text-amber-600' },
                        { label: 'Index Page', value: `${foodItems.current_page}/${foodItems.last_page}`, icon: BookOpen, bg: 'bg-rose-50', text: 'text-rose-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-emerald-900/5 flex items-center gap-5 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", stat.bg, stat.text)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-emerald-950/20 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-xl font-black text-emerald-950">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Layout */}
                <div className="bg-white rounded-[3.5rem] border border-emerald-900/5 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-emerald-900/5 bg-slate-50/50">
                                    <th className="pl-10 pr-6 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">IDENTITAS BAHAN</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">KATEGORI</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">UNIT (URT)</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] text-center">ENERGI</th>
                                    <th className="px-4 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] text-center">PROT</th>
                                    <th className="px-4 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] text-center">LMAK</th>
                                    <th className="px-4 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] text-center">KARB</th>
                                    <th className="pr-10 pl-6 py-6 text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] text-right">MANAGE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-900/5">
                                {foodItems.data.length > 0 ? (
                                    foodItems.data.map((item) => (
                                        <tr key={item.id} className="group hover:bg-emerald-50/30 transition-all">
                                            <td className="pl-10 pr-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-emerald-900/5 flex items-center justify-center text-emerald-900/20 group-hover:text-emerald-900 transition-colors shadow-sm">
                                                        <Utensils className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-emerald-950 text-base leading-none mb-1">{item.name}</p>
                                                        <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest flex items-center gap-2">
                                                            ID-#{item.id} <span className="w-1 h-1 rounded-full bg-emerald-100" /> PER {item.base_quantity}{item.base_unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-emerald-950 text-[9px] font-black uppercase tracking-widest border border-emerald-900/5 group-hover:bg-emerald-900 group-hover:text-white transition-all">
                                                    {item.category || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                {item.urt_unit ? (
                                                    <div className="text-[10px] font-black text-emerald-900 flex flex-col">
                                                        <span className="uppercase tracking-widest text-emerald-900/40 text-[8px]">1 {item.urt_unit}</span>
                                                        <span className="text-emerald-900">≈ {item.urt_weight}g</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-emerald-900/10">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-lg font-black text-emerald-950 leading-none">{Math.round(item.energy_kcal)}</span>
                                                    <span className="text-[8px] font-black text-emerald-900/20 uppercase tracking-widest mt-1">KKAL</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 text-center font-black text-emerald-600 text-sm">{item.protein_g}g</td>
                                            <td className="px-4 py-6 text-center font-black text-amber-600 text-sm">{item.fat_g}g</td>
                                            <td className="px-4 py-6 text-center font-black text-blue-600 text-sm">{item.carbs_g}g</td>
                                            <td className="pr-10 pl-6 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button 
                                                        onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                                                        className="w-11 h-11 rounded-2xl bg-white text-emerald-600 border border-emerald-900/5 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all shadow-sm active:scale-90"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteItem(item.id)}
                                                        className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-300 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-emerald-900/10 mb-6">
                                                    <Utensils className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Katalog Kosong</h3>
                                                <p className="text-emerald-900/30 text-xs font-black uppercase tracking-widest mt-2">Tidak ditemukan bahan makanan sesuai kriteria.</p>
                                                <button onClick={() => { setSearch(''); handleCategoryChange(undefined); }} className="mt-8 px-8 py-4 bg-emerald-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                                                    Reset Filter Katalog
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={foodItems.links} />
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-12 relative bg-white overflow-y-auto max-h-[95vh] custom-scrollbar">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-950/20">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black font-headline text-emerald-950 leading-tight uppercase tracking-tight">
                                    {selectedItem ? 'Sinkronisasi Bahan' : 'Daftar Bahan Baru'}
                                </h2>
                                <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mt-1">
                                    {selectedItem ? 'Memperbarui parameter gizi unit' : 'Menyusun database gizi operasional'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <FoodItemForm 
                        foodItem={selectedItem}
                        categories={categories}
                        onSuccess={() => setIsModalOpen(false)}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
