import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import PortionConfigCard from '@/Components/Portions/PortionConfigCard';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Scale, ShieldCheck, Zap, Info, Calculator, Microscope, Dna, FileText, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface PortionConfig {
    id: number;
    name: string;
    meal_energy: number;
    meal_protein: number;
    meal_fat: number;
    meal_carbs: number;
    multiplier: number;
}

interface PortionsProps extends PageProps {
    portions: PortionConfig[];
}

export default function PortionsIndex({ portions }: PortionsProps) {
    const [editingPortion, setEditingPortion] = useState<PortionConfig | null>(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        meal_energy: 0,
        meal_protein: 0,
        meal_fat: 0,
        meal_carbs: 0,
        multiplier: 0,
    });

    useEffect(() => {
        if (editingPortion) {
            setData({
                meal_energy: editingPortion.meal_energy,
                meal_protein: editingPortion.meal_protein,
                meal_fat: editingPortion.meal_fat,
                meal_carbs: editingPortion.meal_carbs,
                multiplier: editingPortion.multiplier,
            });
        }
    }, [editingPortion]);

    const handleEdit = (portion: PortionConfig) => {
        setEditingPortion(portion);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPortion) {
            patch(route('portions.update', editingPortion.id), {
                onSuccess: () => {
                    setEditingPortion(null);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout header="Konfigurasi Nutrisi & Portasi">
            <Head title="Manajemen Gizi" />

            <div className="max-w-[1600px] mx-auto space-y-12 pb-32 animate-in fade-in duration-1000">
                {/* Dashboard Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-white p-10 rounded-[4rem] border border-emerald-900/5 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-emerald-950 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-950/30">
                            <Scale className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-emerald-950 font-headline uppercase tracking-tighter leading-none">Parameter AKG</h2>
                            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Sinkronisasi Nutrisi Operasional</p>
                        </div>
                    </div>

                    <div className="flex-1 max-w-2xl hidden lg:block border-l border-emerald-900/5 pl-10">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Info className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-emerald-955/40 font-medium leading-relaxed italic">
                                Sesuai standarisasi **Makan Bergizi Gratis**, setiap porsi harian disesuaikan untuk memenuhi **30% Angka Kecukupan Gizi** sesuai kelompok umur siswa.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[2.5rem] border border-emerald-900/5 transition-all hover:bg-emerald-950 hover:text-white group">
                        <div className="w-14 h-14 bg-white/10 group-hover:bg-emerald-400/20 text-emerald-600 group-hover:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-900/40 group-hover:text-emerald-400/40 uppercase tracking-widest leading-none mb-1 transition-colors">Status Keamanan</p>
                            <p className="text-sm font-black uppercase tracking-tight text-emerald-950 group-hover:text-white transition-colors">Verified by Nutritionists</p>
                        </div>
                    </div>
                </div>

                {/* Main Comparison Matrix Grid */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4 px-4 overflow-hidden">
                        <div className="h-px bg-emerald-900/5 flex-1"></div>
                        <div className="flex items-center gap-3 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100">
                            <Dna className="w-4 h-4 text-emerald-700" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Matriks Perbandingan Porsi</h3>
                        </div>
                        <div className="h-px bg-emerald-900/5 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {portions.map((portion) => (
                            <PortionConfigCard 
                                key={portion.id} 
                                portion={portion} 
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                </section>

                <div className="bg-slate-950 rounded-[4rem] p-16 text-white overflow-hidden relative shadow-2xl shadow-emerald-950/20 group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[120px] opacity-60"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-4 space-y-8">
                            <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center text-emerald-400 shadow-2xl">
                                <Microscope className="w-10 h-10" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-white font-headline leading-tight uppercase tracking-tight">Protocol & Pedoman</h3>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                    Setiap parameter di atas menjadi batasan minimum (floor) dalam algoritma penyusunan menu Nutrizi.
                                </p>
                            </div>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { icon: Calculator, title: "Automated Weights", desc: "Sistem mengalikan berat bahan baku standar dengan multiplier porsi secara dinamis.", color: "text-blue-400" },
                                { icon: Zap, title: "Real-time Auditing", desc: "Validasi komposisi protein & mikro-nutrisi dilakukan setiap kali item menu ditambahkan.", color: "text-amber-400" },
                            ].map((item, i) => (
                                <div key={i} className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col gap-6 hover:bg-white/10 transition-all group/box shadow-sm">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", item.color, "bg-white/5")}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xl font-black text-white">{item.title}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={!!editingPortion} onClose={() => setEditingPortion(null)} maxWidth="2xl">
                <form onSubmit={submit} className="p-12 space-y-10 relative bg-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl" />
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-xl">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-emerald-950 font-headline uppercase tracking-tight">Kalibrasi Nutrisi</h2>
                                <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mt-1 italic">Siklus: {editingPortion?.name}</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setEditingPortion(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                        <p className="text-[11px] text-amber-900 font-bold leading-relaxed uppercase tracking-tighter">
                            Perubahan pada standar ini akan berdampak pada <strong>seluruh kalkulasi menu</strong> yang menggunakan porsi ini. Harap lakukan verifikasi dengan ahli gizi.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Energi (Kcal)</label>
                            <TextInput
                                type="number"
                                step="0.1"
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 font-black transition-all"
                                value={data.meal_energy}
                                onChange={(e) => setData('meal_energy', parseFloat(e.target.value))}
                                required
                            />
                            <InputError message={errors.meal_energy} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Multiplier</label>
                            <TextInput
                                type="number"
                                step="0.01"
                                className="w-full bg-slate-100 border-none rounded-2xl p-4 font-black text-emerald-600 shadow-inner"
                                value={data.multiplier}
                                onChange={(e) => setData('multiplier', parseFloat(e.target.value))}
                                required
                            />
                            <InputError message={errors.multiplier} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Protein (g)</label>
                            <TextInput
                                type="number"
                                step="0.1"
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 font-black"
                                value={data.meal_protein}
                                onChange={(e) => setData('meal_protein', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Lemak (g)</label>
                            <TextInput
                                type="number"
                                step="0.1"
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 font-black"
                                value={data.meal_fat}
                                onChange={(e) => setData('meal_fat', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Karbohidrat (g)</label>
                            <TextInput
                                type="number"
                                step="0.1"
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 font-black"
                                value={data.meal_carbs}
                                onChange={(e) => setData('meal_carbs', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-8 border-t border-emerald-900/5">
                        <button 
                            type="button" 
                            onClick={() => setEditingPortion(null)}
                            className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-100 hover:bg-slate-50 transition-all font-sans"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-emerald-950 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-emerald-950/20 active:scale-95 font-sans"
                        >
                            Update Parameter
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
