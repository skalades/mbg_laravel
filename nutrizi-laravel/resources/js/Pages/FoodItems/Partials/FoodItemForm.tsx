import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

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
    onSuccess: () => void;
    onCancel: () => void;
}

export default function FoodItemForm({ foodItem, onSuccess, onCancel }: FoodItemFormProps) {
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
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-900 border-b border-emerald-900/10 pb-2">Informasi Dasar</h3>
                    
                    <div>
                        <InputLabel htmlFor="name" value="Nama Bahan" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="category" value="Kategori" />
                        <TextInput
                            id="category"
                            className="mt-1 block w-full"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                        />
                        <InputError message={errors.category} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="base_unit" value="Satuan Dasar" />
                            <TextInput
                                id="base_unit"
                                className="mt-1 block w-full"
                                value={data.base_unit}
                                onChange={(e) => setData('base_unit', e.target.value)}
                                required
                            />
                            <InputError message={errors.base_unit} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="base_quantity" value="Jumlah Dasar" />
                            <TextInput
                                id="base_quantity"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.base_quantity}
                                onChange={(e) => setData('base_quantity', Number(e.target.value))}
                                required
                            />
                            <InputError message={errors.base_quantity} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-900/5 mt-2">
                        <div>
                            <InputLabel htmlFor="urt_unit" value="Satuan URT" />
                            <TextInput
                                id="urt_unit"
                                className="mt-1 block w-full bg-emerald-50/30"
                                placeholder="Piring, Sdm, dll"
                                value={data.urt_unit}
                                onChange={(e) => setData('urt_unit', e.target.value)}
                            />
                            <InputError message={errors.urt_unit} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="urt_weight" value="Berat per URT (g)" />
                            <TextInput
                                id="urt_weight"
                                type="number"
                                className="mt-1 block w-full bg-emerald-50/30"
                                placeholder="Gram"
                                value={data.urt_weight}
                                onChange={(e) => setData('urt_weight', Number(e.target.value))}
                            />
                            <InputError message={errors.urt_weight} className="mt-2" />
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-900/5 relative group">
                        <div className="flex items-center justify-between mb-2">
                            <InputLabel htmlFor="yield_factor" value="Yield Factor" className="text-emerald-900 font-bold" />
                            <button 
                                type="button"
                                onClick={() => setShowCalculator(!showCalculator)}
                                className="text-[10px] font-bold text-emerald-900 bg-white px-2 py-1 rounded-lg border border-emerald-900/10 hover:bg-emerald-900 hover:text-white transition-all shadow-sm"
                            >
                                {showCalculator ? 'Tutup Kalkulator' : 'Buka Kalkulator'}
                            </button>
                        </div>
                        
                        <TextInput
                            id="yield_factor"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full shadow-inner bg-white/80"
                            value={data.yield_factor}
                            onChange={(e) => setData('yield_factor', Number(e.target.value))}
                            required
                        />
                        <p className="text-[9px] text-emerald-800/50 mt-2 uppercase font-bold tracking-tighter italic leading-relaxed">
                            Faktor Kali (Multiplier): Rasio Berat <span className="text-emerald-900 underline">MATANG</span> terhadap Berat <span className="text-emerald-900 underline">MENTAH</span>
                        </p>
                        <InputError message={errors.yield_factor} className="mt-2" />

                        {/* Yield Multiplier Calculator Sub-form */}
                        {showCalculator && (
                            <div className="mt-4 pt-4 border-t border-emerald-900/10 space-y-3 animate-in slide-in-from-top duration-300">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[9px] font-bold text-emerald-900/60 uppercase">Estimasi Mentah (g)</label>
                                        <input 
                                            type="number"
                                            className="w-full text-xs p-2 rounded-lg border border-emerald-900/10 bg-white"
                                            placeholder="Indikator Ment..."
                                            onChange={(e) => {
                                                const raw = Number(e.target.value);
                                                const cooked = document.getElementById('calc_cooked') as HTMLInputElement;
                                                if (raw && cooked.value) setData('yield_factor', Number((Number(cooked.value) / raw).toFixed(2)));
                                            }}
                                            id="calc_raw"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-emerald-900/60 uppercase">Hasil Matang (g)</label>
                                        <input 
                                            type="number"
                                            className="w-full text-xs p-2 rounded-lg border border-emerald-900/10 bg-white"
                                            placeholder="Nilai Matang..."
                                            onChange={(e) => {
                                                const cooked = Number(e.target.value);
                                                const raw = document.getElementById('calc_raw') as HTMLInputElement;
                                                if (cooked && raw.value) setData('yield_factor', Number((cooked / Number(raw.value)).toFixed(2)));
                                            }}
                                            id="calc_cooked"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-emerald-900/60 uppercase">Preset Standar (Faktor Kali):</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { name: 'Nasi (Beras x2.5)', val: 2.50 },
                                            { name: 'Ayam Goreng (x0.67)', val: 0.67 },
                                            { name: 'Daging Goreng (x0.59)', val: 0.59 },
                                            { name: 'Ikan Goreng (x0.71)', val: 0.71 },
                                            { name: 'Tempe Goreng (x1.0)', val: 1.00 },
                                            { name: 'Mie Rebus (x2.0)', val: 2.00 },
                                        ].map((preset) => (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() => setData('yield_factor', preset.val)}
                                                className="text-[8px] font-bold px-2 py-1 bg-white border border-emerald-900/5 rounded-full hover:bg-emerald-50 hover:border-emerald-900/20 text-emerald-800 transition-all"
                                            >
                                                {preset.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nutritional Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-900 border-b border-emerald-900/10 pb-2">Informasi Gizi</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <InputLabel htmlFor="energy_kcal" value="Energi (Kcal)" />
                            <TextInput
                                id="energy_kcal"
                                type="number"
                                step="0.1"
                                className="mt-1 block w-full"
                                value={data.energy_kcal}
                                onChange={(e) => setData('energy_kcal', Number(e.target.value))}
                                required
                            />
                            <InputError message={errors.energy_kcal} className="mt-2" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <InputLabel htmlFor="protein_g" value="Protein (g)" />
                                <TextInput
                                    id="protein_g"
                                    type="number"
                                    step="0.1"
                                    className="mt-1 block w-full"
                                    value={data.protein_g}
                                    onChange={(e) => setData('protein_g', Number(e.target.value))}
                                    required
                                />
                                <InputError message={errors.protein_g} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="fat_g" value="Lemak (g)" />
                                <TextInput
                                    id="fat_g"
                                    type="number"
                                    step="0.1"
                                    className="mt-1 block w-full"
                                    value={data.fat_g}
                                    onChange={(e) => setData('fat_g', Number(e.target.value))}
                                    required
                                />
                                <InputError message={errors.fat_g} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="carbs_g" value="Karbo (g)" />
                                <TextInput
                                    id="carbs_g"
                                    type="number"
                                    step="0.1"
                                    className="mt-1 block w-full"
                                    value={data.carbs_g}
                                    onChange={(e) => setData('carbs_g', Number(e.target.value))}
                                    required
                                />
                                <InputError message={errors.carbs_g} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="image_url" value="URL Gambar (Opsional)" />
                            <TextInput
                                id="image_url"
                                className="mt-1 block w-full"
                                value={data.image_url}
                                onChange={(e) => setData('image_url', e.target.value)}
                            />
                            <InputError message={errors.image_url} className="mt-2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-emerald-900/5">
                <SecondaryButton onClick={onCancel} type="button">
                    Batal
                </SecondaryButton>
                <PrimaryButton disabled={processing} type="submit">
                    {foodItem ? 'Perbarui Data' : 'Tambah Bahan'}
                </PrimaryButton>
            </div>
        </form>
    );
}
