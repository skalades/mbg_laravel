import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import FoodItemForm from './Partials/FoodItemForm';
import NutrientVisualizer from './Partials/NutrientVisualizer';
import { cn } from '@/lib/utils';

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
        <div className="flex flex-wrap justify-center gap-1 mt-8">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                        link.active 
                            ? "bg-emerald-900 text-white border-emerald-900 shadow-md transform scale-105" 
                            : !link.url 
                                ? "text-emerald-900/20 border-transparent cursor-not-allowed"
                                : "bg-white text-emerald-900/60 border-emerald-900/5 hover:border-emerald-900/20"
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

import { Link } from '@inertiajs/react';

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
            router.delete(route('food-items.destroy', id));
        }
    };

    const openEditModal = (item: FoodItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setSelectedItem(undefined);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header="Katalog Bahan & Gizi"
        >
            <Head title="Katalog Bahan Gizi" />

            <div className="space-y-8 pb-20">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 rounded-3xl border border-emerald-900/5 backdrop-blur-sm shadow-sm ring-1 ring-emerald-900/5">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <span className={cn("material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800/40 group-focus-within:text-emerald-900 transition-colors", isSearching && "animate-spin text-emerald-900")}>
                                {isSearching ? 'progress_activity' : 'search'}
                            </span>
                            <TextInput
                                className="w-full pl-12 pr-12 h-12 bg-white/60 border-emerald-900/5 hover:border-emerald-900/20 focus:border-emerald-900/30 rounded-2xl transition-all"
                                placeholder="Cari bahan (misal: Ayam, Beras, Bayam...)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button 
                                    onClick={() => setSearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-800/40 hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">cancel</span>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={openCreateModal}
                            className="bg-emerald-900 text-white px-6 h-12 rounded-2xl font-bold flex items-center gap-2 hover:scale-[0.98] transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-xl">add_circle</span>
                            Tambah Bahan Baru
                        </button>
                    </div>
                </div>

                {/* Categories Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => handleCategoryChange(undefined)}
                        className={cn(
                            "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap",
                            !filters.category 
                                ? "bg-emerald-900 text-white border-emerald-900 shadow-md transform scale-105" 
                                : "bg-white text-emerald-900/60 border-emerald-900/5 hover:border-emerald-900/20"
                        )}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap",
                                filters.category === cat
                                    ? "bg-emerald-900 text-white border-emerald-900 shadow-md transform scale-105" 
                                    : "bg-white text-emerald-900/60 border-emerald-900/5 hover:border-emerald-900/20"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sub-header Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Bahan', value: foodItems.total, icon: 'inventory_2', color: 'bg-emerald-50 text-emerald-600' },
                        { label: 'Kategori', value: categories.length, icon: 'category', color: 'bg-blue-50 text-blue-600' },
                        { label: 'Indeks Gizi', value: '100%', icon: 'analytics', color: 'bg-amber-50 text-amber-600' },
                        { label: 'Halaman', value: `${foodItems.current_page} / ${foodItems.last_page}`, icon: 'auto_stories', color: 'bg-purple-50 text-purple-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-emerald-900/5 flex items-center gap-4 group hover:shadow-md transition-all">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest">{stat.label}</span>
                                <span className="text-sm font-bold text-emerald-900">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Catalog Table */}
                <div className="bg-white/60 rounded-[2.5rem] border border-emerald-900/5 overflow-hidden backdrop-blur-md shadow-xl shadow-emerald-900/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-emerald-900/5 bg-emerald-50/30">
                                    <th className="px-6 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em] w-1/4">Nama Bahan</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">Kategori</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">URT</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">Kcal</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">Prot (g)</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">Lemk (g)</th>
                                    <th className="px-4 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em]">Karb (g)</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-900/5">
                                {foodItems.data.length > 0 ? (
                                    foodItems.data.map((item) => (
                                        <tr key={item.id} className="group hover:bg-emerald-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-xl text-emerald-900/20">restaurant</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors leading-tight">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-emerald-800/30 uppercase tracking-widest mt-0.5">
                                                            ID: #{item.id} • PER {item.base_quantity} {item.base_unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                                    {item.category || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {item.urt_unit ? (
                                                    <div className="text-[10px] font-bold text-emerald-900">
                                                        1 {item.urt_unit} <span className="text-emerald-800/40 ml-1">≈ {item.urt_weight}g</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-emerald-800/20">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-emerald-900 text-sm">{Math.round(item.energy_kcal)}</td>
                                            <td className="px-4 py-4 font-bold text-emerald-600 text-sm">{item.protein_g}</td>
                                            <td className="px-4 py-4 font-bold text-amber-600 text-sm">{item.fat_g}</td>
                                            <td className="px-4 py-4 font-bold text-blue-600 text-sm">{item.carbs_g}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(item)}
                                                        className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteItem(item.id)}
                                                        className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-900/20 mb-4">
                                                    <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-emerald-900">Bahan Tidak Ditemukan</h3>
                                                <p className="text-emerald-800/40 max-w-sm mt-1 text-sm">Coba cari kata kunci lain atau bersihkan kategori filter.</p>
                                                <SecondaryButton onClick={() => { setSearch(''); handleCategoryChange(undefined); }} className="mt-6">
                                                    Reset Pencarian
                                                </SecondaryButton>
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
                <div className="p-10 relative">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold font-headline text-emerald-900 leading-tight">
                                {selectedItem ? 'Edit Bahan' : 'Tambah Bahan Baru'}
                            </h2>
                            <p className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.3em]">
                                {selectedItem ? 'Memperbarui data gizi katalog' : 'Menambahkan entri baru ke katalog gizi'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800/60 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center group"
                        >
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-500">close</span>
                        </button>
                    </div>

                    <FoodItemForm 
                        foodItem={selectedItem}
                        onSuccess={() => setIsModalOpen(false)}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
