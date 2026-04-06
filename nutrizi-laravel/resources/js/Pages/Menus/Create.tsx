import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect, useMemo } from 'react';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { cn } from '@/lib/utils';

interface FoodItem {
    id: number;
    name: string;
    category: string;
    energy_kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    base_quantity: number;
}

interface MenuItem {
    food_item_id: number;
    portion_name: string;
    weight_small: number;
    weight_large: number;
    food_item?: FoodItem;
}

interface PortionConfig {
    id: number;
    portion_name: string;
    meal_energy: number;
    meal_protein: number;
    meal_fat: number;
    meal_carbs: number;
    multiplier: number;
}

type Props = PageProps<{
    foodItems: FoodItem[];
    schools: {
        id: number;
        school_name: string;
        siswa_laki_laki: number;
        siswa_perempuan: number;
        guru_laki_laki: number;
        guru_perempuan: number;
        small_portion_count: number;
        large_portion_count: number;
    }[];
    portion_configs: Record<string, PortionConfig>;
}>;

export default function CreateMenu({ foodItems, schools }: Props) {
    const { portion_configs } = usePage<Props>().props;
    
    const configSmall = portion_configs['Porsi Kecil'];
    const configLarge = portion_configs['Porsi Besar'];
    const { data, setData, post, processing, errors } = useForm({
        menu_name: '',
        target_group: [] as string[],
        cooking_instructions: '',
        items: [] as MenuItem[],
    });

    const [selectedSchoolIds, setSelectedSchoolIds] = useState<number[]>([]);
    const [isSchoolSelectorOpen, setIsSchoolSelectorOpen] = useState(false);
    const [buffer, setBuffer] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');

    const stats = useMemo(() => {
        const selectedSchools = schools.filter(s => selectedSchoolIds.includes(s.id));
        const totalSiswaGuru = selectedSchools.reduce((acc, s) => 
            acc + s.siswa_laki_laki + s.siswa_perempuan + s.guru_laki_laki + s.guru_perempuan, 0
        );
        const totalSmall = selectedSchools.reduce((acc, s) => acc + s.small_portion_count, 0);
        const totalLarge = selectedSchools.reduce((acc, s) => acc + s.large_portion_count, 0);

        return {
            totalSiswaGuru,
            totalSmall,
            totalLarge,
            totalProduction: totalSmall + totalLarge + (selectedSchoolIds.length > 0 ? buffer : 0)
        };
    }, [selectedSchoolIds, schools, buffer]);

    const filteredFoodItems = useMemo(() => {
        // ... previous filtering logic
        return foodItems.filter(fi => 
            fi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fi.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, foodItems]);

    const totals = useMemo(() => {
        // ... previous totals logic (per portion nutrition)
        const calc = (items: MenuItem[], type: 'small' | 'large') => {
            return items.reduce((acc, item) => {
                const fi = foodItems.find(f => f.id === item.food_item_id);
                if (!fi) return acc;
                
                const weight = type === 'small' ? item.weight_small : item.weight_large;
                const ratio = weight / fi.base_quantity;

                return {
                    energy: acc.energy + (fi.energy_kcal * ratio),
                    protein: acc.protein + (fi.protein_g * ratio),
                    fat: acc.fat + (fi.fat_g * ratio),
                    carbs: acc.carbs + (fi.carbs_g * ratio),
                };
            }, { energy: 0, protein: 0, fat: 0, carbs: 0 });
        };

        return {
            small: calc(data.items, 'small'),
            large: calc(data.items, 'large'),
        };
    }, [data.items, foodItems]);

    // ... helper methods (addItem, removeItem, updateItem)
    const addItem = (fi: FoodItem) => {
        if (data.items.find(i => i.food_item_id === fi.id)) return;
        
        setData('items', [
            ...data.items,
            { 
                food_item_id: fi.id, 
                portion_name: fi.category || 'Lauk', 
                weight_small: fi.base_quantity, 
                weight_large: Math.round(fi.base_quantity * (configLarge?.multiplier || 1.37)),
                food_item: fi
            }
        ]);
        setSearchTerm('');
    };

    const removeItem = (id: number) => {
        setData('items', data.items.filter(i => i.food_item_id !== id));
    };

    const updateItem = (index: number, field: keyof MenuItem, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('menus.store'));
    };

    const toggleSchool = (id: number) => {
        setSelectedSchoolIds(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    return (
        <AuthenticatedLayout header="Penyusun Menu Presisi">
            <Head title="Penyusun Menu" />

            <div className="min-h-screen bg-slate-50/50 -m-8 p-8 pb-32">
                <form onSubmit={submit} className="max-w-[1600px] mx-auto space-y-8">
                    {/* Header Bar */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-emerald-900/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                                <span className="material-symbols-outlined">restaurant_menu</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-emerald-950 font-headline uppercase tracking-tight">Penyusun Menu Presisi</h1>
                                <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Sistem Dua-Porsi Teroptimasi</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* School Selector */}
                            <div className="relative">
                                <button 
                                    type="button"
                                    onClick={() => setIsSchoolSelectorOpen(!isSchoolSelectorOpen)}
                                    className="bg-slate-100/50 px-6 py-3 rounded-2xl border border-slate-900/5 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulasi Sekolah</span>
                                    <span className="text-sm font-black text-slate-900 truncate max-w-[150px]">
                                        {selectedSchoolIds.length === 0 ? 'Pilih Sekolah...' : `${selectedSchoolIds.length} Sekolah`}
                                    </span>
                                    <span className={cn("material-symbols-outlined text-sm text-slate-400 transition-transform", isSchoolSelectorOpen && "rotate-180")}>expand_more</span>
                                </button>
                                
                                {isSchoolSelectorOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[55]" onClick={() => setIsSchoolSelectorOpen(false)} />
                                        <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-900/5 z-[60] p-4 min-w-[300px] animate-in slide-in-from-top-2">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Daftar Sekolah Mitra</div>
                                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {schools.map(s => (
                                                    <button 
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => toggleSchool(s.id)}
                                                        className={cn(
                                                            "w-full text-left p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all",
                                                            selectedSchoolIds.includes(s.id) ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50 text-slate-600"
                                                        )}
                                                    >
                                                        {s.school_name}
                                                        {selectedSchoolIds.includes(s.id) && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="bg-emerald-50/50 px-6 py-4 rounded-2xl border border-emerald-900/5 flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Target</span>
                                <div className="flex gap-2">
                                    {['SD', 'SMP', 'SMA'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => {
                                                const current = Array.isArray(data.target_group) ? data.target_group : [];
                                                const next = current.includes(level)
                                                    ? current.filter(l => l !== level)
                                                    : [...current, level];
                                                setData('target_group', next);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                                data.target_group?.includes(level)
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : 'bg-white text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <TextInput
                                className="bg-emerald-50/50 border-emerald-900/5 rounded-2xl px-6 py-3 text-sm font-bold min-w-[200px]"
                                placeholder="Nama Menu..."
                                value={data.menu_name}
                                onChange={e => setData('menu_name', e.target.value)}
                            />

                            <PrimaryButton className="px-8 py-4 bg-emerald-900 rounded-2xl shadow-xl shadow-emerald-900/20 gap-2" disabled={processing}>
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan Templat
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Cooking Instructions Section */}
                    <div className="bg-white p-10 rounded-[3rem] border border-emerald-900/5 shadow-sm">
                         <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-emerald-900/40">description</span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Instruksi Dapur & Prosedur Masak</h3>
                        </div>
                        <textarea 
                            value={data.cooking_instructions}
                            onChange={(e) => setData('cooking_instructions', e.target.value)}
                            placeholder="Tuliskan panduan memasak atau instruksi khusus untuk tim dapur di sini..."
                            className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500/10 min-h-[150px] transition-all"
                        />
                        <p className="mt-4 text-[9px] text-emerald-800/40 italic font-medium px-4">
                            * Instruksi ini akan muncul di halaman Audit QC sebagai panduan verifikasi kualitas bagi Ahli Gizi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Content Area */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Aggregates Section */}
                            <div className="bg-white p-10 rounded-[3rem] border border-emerald-900/5 shadow-sm relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[100px] transition-all group-hover:bg-emerald-500/10" />
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Siswa & Guru (Agregat)</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                                <span className="material-symbols-outlined text-lg">groups</span>
                                            </div>
                                            <span className="text-4xl font-black text-emerald-900">{stats.totalSiswaGuru}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 border-slate-100 md:border-l md:pl-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-2">Buffer + Sampling</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-lg">inventory_2</span>
                                            </div>
                                            <input 
                                                type="number"
                                                className="bg-transparent border-none p-0 text-4xl font-black text-slate-800 w-20 focus:ring-0"
                                                value={buffer}
                                                onChange={e => setBuffer(parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-slate-100 md:border-l md:pl-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Total Produksi</h3>
                                        <div className="bg-emerald-950 p-4 rounded-3xl flex justify-between items-center text-white">
                                            <span className="text-4xl font-black">{stats.totalProduction}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-800 px-2 py-1 rounded-md">Porsi</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-8 text-[10px] text-emerald-800/40 italic leading-relaxed max-w-2xl">
                                    Gramasi dihitung secara otomatis berdasarkan rasio porsi sekolah. Anda dapat mengubah berat item tertentu secara manual untuk menyesuaikan kebutuhan gizi porsi kecil/besar secara independen.
                                </p>

                                <div className="mt-10 relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-900/20">search</span>
                                    <input 
                                        type="text"
                                        placeholder="Cari bahan makanan..."
                                        className="w-full bg-slate-50/50 border-none rounded-3xl py-6 pl-14 pr-8 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-emerald-900/5 z-50 p-4 max-h-[400px] overflow-y-auto space-y-2 animate-in slide-in-from-top-4">
                                            {filteredFoodItems.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 italic text-sm">Tidak ditemukan bahan makanan.</div>
                                            ) : (
                                                filteredFoodItems.map(fi => (
                                                    <button 
                                                        key={fi.id}
                                                        type="button"
                                                        onClick={() => addItem(fi)}
                                                        className="w-full text-left p-4 hover:bg-emerald-50 rounded-2xl flex justify-between items-center group transition-all"
                                                    >
                                                        <div>
                                                            <div className="font-black text-emerald-900">{fi.name}</div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800/30">{fi.category}</div>
                                                        </div>
                                                        <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity">add_circle</span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ingredient Items */}
                            <div className="space-y-4">
                                {data.items.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-emerald-900/10 rounded-[3rem] text-emerald-800/20 font-black uppercase tracking-widest text-[10px]">
                                        Daftar komposisi bahan masih kosong
                                    </div>
                                ) : (
                                    data.items.map((item, index) => (
                                        <div key={item.food_item_id} className="bg-white p-6 rounded-[2.5rem] border border-emerald-900/5 shadow-sm flex flex-wrap lg:flex-nowrap items-center gap-8 group animate-in zoom-in-95 duration-300">
                                            <div className="flex-1 min-w-[200px]">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-emerald-800/30 mb-1">Item Ref</div>
                                                <div className="font-bold text-emerald-900 text-base">{item.food_item?.name}</div>
                                            </div>

                                            <div className="w-40 space-y-1">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-800/30">Tipe Komposisi</label>
                                                <TextInput 
                                                    value={item.portion_name}
                                                    onChange={e => updateItem(index, 'portion_name', e.target.value)}
                                                    className="w-full border-none bg-slate-50/50 rounded-xl text-xs font-black uppercase tracking-widest"
                                                />
                                            </div>

                                            <div className="w-32 space-y-1">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-800/30">Gram (Kecil)</label>
                                                <TextInput 
                                                    type="number"
                                                    value={item.weight_small}
                                                    onChange={e => updateItem(index, 'weight_small', parseFloat(e.target.value))}
                                                    className="w-full border-none bg-emerald-50/50 rounded-xl text-xs font-black text-emerald-600"
                                                />
                                            </div>

                                            <div className="w-32 space-y-1">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-800/30">Gram (Besar)</label>
                                                <TextInput 
                                                    type="number"
                                                    value={item.weight_large}
                                                    onChange={e => updateItem(index, 'weight_large', parseFloat(e.target.value))}
                                                    className="w-full border-none bg-emerald-50/50 rounded-xl text-xs font-black text-emerald-900"
                                                />
                                            </div>

                                            <button 
                                                type="button" 
                                                onClick={() => removeItem(item.food_item_id)}
                                                className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar (Dual Analysis) */}
                        <div className="lg:col-span-4 sticky top-8">
                            <section className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                                
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">Dual Analysis</h2>
                                        <span className="material-symbols-outlined text-emerald-400/20">analytics</span>
                                    </div>

                                    {/* Porsi Kecil Analysis */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Porsi Kecil</div>
                                                <div className="text-6xl font-black leading-none">{Math.round(totals.small.energy)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-medium text-slate-400 italic">kkal</div>
                                                <div className={cn(
                                                    "mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                    totals.small.energy < (configSmall?.meal_energy || 469.9) ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"
                                                )}>
                                                    {totals.small.energy < (configSmall?.meal_energy || 469.9) ? 'UNDER STANDARD' : 'IDEAL'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-white/5">
                                            {[
                                                { label: 'Protein', value: totals.small.protein, target: configSmall?.meal_protein || 10.5 },
                                                { label: 'Lemak', value: totals.small.fat, target: configSmall?.meal_fat || 16.0 },
                                                { label: 'Karbohidrat', value: totals.small.carbs, target: configSmall?.meal_carbs || 72.0 }
                                            ].map(macro => (
                                                <div key={macro.label} className="space-y-2">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                                                        <span className="text-slate-500">{macro.label}</span>
                                                        <span>{Math.round(macro.value)}g / {macro.target}g</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-emerald-500 transition-all duration-700"
                                                            style={{ width: `${Math.min(100, (macro.value / macro.target) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Porsi Besar Analysis */}
                                    <div className="space-y-6 pt-12 border-t border-white/10">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Porsi Besar</div>
                                                <div className="text-6xl font-black leading-none">{Math.round(totals.large.energy)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-medium text-slate-400 italic">kkal</div>
                                                <div className={cn(
                                                    "mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                    totals.large.energy < (configLarge?.meal_energy || 644.5) ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"
                                                )}>
                                                    {totals.large.energy < (configLarge?.meal_energy || 644.5) ? 'UNDER STANDARD' : 'IDEAL'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-white/5">
                                            {[
                                                { label: 'Protein', value: totals.large.protein, target: configLarge?.meal_protein || 18.3 },
                                                { label: 'Lemak', value: totals.large.fat, target: configLarge?.meal_fat || 21.3 },
                                                { label: 'Karbohidrat', value: totals.large.carbs, target: configLarge?.meal_carbs || 95.3 }
                                            ].map(macro => (
                                                <div key={macro.label} className="space-y-2">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                                                        <span className="text-slate-500">{macro.label}</span>
                                                        <span>{Math.round(macro.value)}g / {macro.target}g</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-blue-500 transition-all duration-700"
                                                            style={{ width: `${Math.min(100, (macro.value / macro.target) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <PrimaryButton 
                                        type="submit"
                                        disabled={processing || data.items.length === 0}
                                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[2rem] shadow-2xl shadow-emerald-500/30 justify-center gap-3 mt-8 group"
                                    >
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Terbitkan Resep</span>
                                        <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                    </PrimaryButton>
                                </div>
                            </section>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
