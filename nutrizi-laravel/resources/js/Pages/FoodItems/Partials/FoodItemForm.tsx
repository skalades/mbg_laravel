import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import PremiumSelector from '@/Components/PremiumSelector';
import { Calculator, ChevronDown, ChevronUp, Info, Utensils } from 'lucide-react';

interface FoodItem {
    id?: number;
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

interface FoodItemFormProps {
    foodItem?: FoodItem;
    categories: string[];
    onSuccess: () => void;
    onCancel: () => void;
}

export default function FoodItemForm({ foodItem, categories, onSuccess, onCancel }: FoodItemFormProps) {
    const [showCalculator, setShowCalculator] = useState(false);
    const { data, setData, post, patch, processing, errors } = useForm({
        name: foodItem?.name || '',
        category: foodItem?.category || '',
        base_unit: foodItem?.base_unit || 'gram',
        base_quantity: foodItem?.base_quantity || 100,
        urt_unit: foodItem?.urt_unit || '',
        urt_weight: foodItem?.urt_weight || 0,
        energy_kcal: foodItem?.energy_kcal || 0,
        protein_g: foodItem?.protein_g || 0,
        fat_g: foodItem?.fat_g || 0,
        carbs_g: foodItem?.carbs_g || 0,
        yield_factor: foodItem?.yield_factor || 1.00,
        image_url: foodItem?.image_url || '',
    });

    const categoryOptions = useMemo(() => 
        categories.map(cat => ({ id: cat, label: cat })), 
    [categories]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (foodItem) {
            patch(route('food-items.update', foodItem.id), {
                onSuccess: () => onSuccess(),
            });
        } else {
            post(route('food-items.store'), {
                onSuccess: () => onSuccess(),
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-8 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <Utensils className="w-4 h-4 text-emerald-900/20" />
                        <h3 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Informasi Dasar & Satuan</h3>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Nama Bahan Makanan</label>
                        <TextInput
                            id="name"
                            className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Ayam Broiler (Daging Saja)"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <PremiumSelector 
                        label="Kategori Bahan"
                        placeholder="Pilih Kategori..."
                        options={categoryOptions}
                        value={data.category}
                        onChange={(val) => setData('category', val.toString())}
                        error={errors.category}
                    />

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-900/5">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Satuan Dasar</label>
                            <TextInput
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-xl p-3 text-emerald-955 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-xs"
                                value={data.base_unit}
                                onChange={(e) => setData('base_unit', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Jumlah (Netto)</label>
                            <TextInput
                                type="number"
                                className="w-full bg-slate-100 border-none rounded-xl p-3 text-emerald-955 font-black text-center focus:ring-0 text-xs shadow-inner"
                                value={data.base_quantity}
                                onChange={(e) => setData('base_quantity', Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-900/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-emerald-600" />
                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Konversi URT (Opsional)</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-emerald-950/30 uppercase tracking-widest ml-1">Nama URT</label>
                                <TextInput
                                    className="w-full bg-white border-emerald-900/5 rounded-xl p-3 text-emerald-955 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-xs"
                                    placeholder="Gelas, Sdm, dll"
                                    value={data.urt_unit}
                                    onChange={(e) => setData('urt_unit', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-emerald-950/30 uppercase tracking-widest ml-1">Gram/Unit</label>
                                <TextInput
                                    type="number"
                                    className="w-full bg-white border-emerald-900/5 rounded-xl p-3 text-emerald-955 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-xs"
                                    value={data.urt_weight}
                                    onChange={(e) => setData('urt_weight', Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutritional & Yield */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-emerald-900/20" />
                                <h3 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Analisis Gizi & Yield</h3>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setShowCalculator(!showCalculator)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                            >
                                <Calculator className="w-3 h-3" />
                                {showCalculator ? 'Tutup Kalibrasi' : 'Kalibrasi Yield'}
                            </button>
                        </div>

                        {showCalculator && (
                            <div className="bg-emerald-950 p-6 rounded-[2.5rem] space-y-4 animate-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-emerald-400 uppercase tracking-widest ml-1">Input Mentah (g)</label>
                                        <input 
                                            id="calc_raw"
                                            type="number"
                                            className="w-full bg-emerald-900/50 border-none rounded-xl p-3 text-white font-black text-center focus:ring-1 focus:ring-emerald-400 text-xs"
                                            placeholder="100"
                                            onChange={(e) => {
                                                const raw = Number(e.target.value);
                                                const cooked = document.getElementById('calc_cooked') as HTMLInputElement;
                                                if (raw && cooked.value) setData('yield_factor', Number((Number(cooked.value) / raw).toFixed(2)));
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-emerald-400 uppercase tracking-widest ml-1">Hasil Matang (g)</label>
                                        <input 
                                            id="calc_cooked"
                                            type="number"
                                            className="w-full bg-emerald-900/50 border-none rounded-xl p-3 text-white font-black text-center focus:ring-1 focus:ring-emerald-400 text-xs"
                                            placeholder="70"
                                            onChange={(e) => {
                                                const cooked = Number(e.target.value);
                                                const raw = document.getElementById('calc_raw') as HTMLInputElement;
                                                if (cooked && raw.value) setData('yield_factor', Number((cooked / Number(raw.value)).toFixed(2)));
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <span className="text-[7px] font-black text-emerald-500/40 uppercase tracking-widest">Preset Faktor Matang:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { n: 'Nasi', v: 2.50 }, { n: 'Ayam Gr', v: 0.67 }, 
                                            { n: 'Daging Gr', v: 0.59 }, { n: 'Ikan Gr', v: 0.71 },
                                            { n: 'Mie Rebus', v: 2.10 }
                                        ].map(p => (
                                            <button key={p.n} type="button" onClick={() => setData('yield_factor', p.v)} className="px-2 py-1 bg-white/5 hover:bg-emerald-400 hover:text-emerald-950 rounded-lg text-[8px] font-black text-white/40 transition-all border border-white/5 uppercase">
                                                {p.n} (x{p.v})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Yield Factor (Multiplier)</label>
                            <TextInput
                                type="number"
                                step="0.01"
                                className="w-full bg-emerald-50/50 border-emerald-900/5 rounded-2xl p-6 text-emerald-950 font-black focus:ring-2 focus:ring-emerald-500/10 transition-all text-xl shadow-sm"
                                value={data.yield_factor}
                                onChange={(e) => setData('yield_factor', Number(e.target.value))}
                                required
                            />
                            <p className="px-2 text-[8px] font-black text-emerald-900/30 uppercase tracking-[0.1em] leading-relaxed italic">
                                Multiplier berat MATANG ÷ MENTAH. Nasi ≈ 2.5, Protein Goreng ≈ 0.6-0.7.
                            </p>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16" />
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest ml-1">Energi (Kcal)</label>
                                    <TextInput
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-emerald-950 border-none rounded-2xl p-5 text-emerald-400 font-black focus:ring-1 focus:ring-emerald-400 text-4xl leading-none"
                                        value={data.energy_kcal}
                                        onChange={(e) => setData('energy_kcal', Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Protein (g)</label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            className="w-full bg-white/5 border-none rounded-xl p-3 text-white font-black text-center focus:ring-1 focus:ring-white/20 text-sm"
                                            value={data.protein_g}
                                            onChange={(e) => setData('protein_g', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Lemak (g)</label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            className="w-full bg-white/5 border-none rounded-xl p-3 text-white font-black text-center focus:ring-1 focus:ring-white/20 text-sm"
                                            value={data.fat_g}
                                            onChange={(e) => setData('fat_g', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Karb (g)</label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            className="w-full bg-white/5 border-none rounded-xl p-3 text-white font-black text-center focus:ring-1 focus:ring-white/20 text-sm"
                                            value={data.carbs_g}
                                            onChange={(e) => setData('carbs_g', Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-8 border-t border-emerald-900/5">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    disabled={processing}
                    className="bg-emerald-900 text-white px-12 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-emerald-900/30"
                >
                    {foodItem ? 'Sinkronisasi Data' : 'Daftarkan Bahan'}
                </button>
            </div>
        </form>
    );
}
