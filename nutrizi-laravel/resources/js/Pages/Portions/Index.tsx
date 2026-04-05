import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import PortionConfigCard from '@/Components/Portions/PortionConfigCard';

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
    return (
        <AuthenticatedLayout
            header="Manajemen Standar Porsi"
        >
            <Head title="Manajemen Porsi" />

            <div className="space-y-12 animate-in fade-in duration-700">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline uppercase tracking-tighter">
                            Standar Gizi Nutrizi
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium max-w-2xl leading-relaxed italic border-l-4 border-emerald-100 pl-4">
                            Acuan gizi berikut adalah parameter utama yang digunakan sistem dalam menghitung komposisi menu harian. 
                            Setiap porsi dirancang untuk memenuhi **30% Angka Kecukupan Gizi (AKG)** harian siswa.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-emerald-900/5 shadow-sm">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Acuan</p>
                            <p className="text-sm font-black text-emerald-900 uppercase">Terverifikasi Ahli Gizi</p>
                        </div>
                    </div>
                </div>

                {/* Focused Portion Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {portions.map((portion) => (
                        <PortionConfigCard key={portion.id} portion={portion} />
                    ))}
                </div>

                {/* Nutritional Guidance Section */}
                <div className="bg-white rounded-[3rem] p-12 border border-emerald-900/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-emerald-50 transition-colors" />
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="md:col-span-1">
                            <h3 className="text-xl font-black text-emerald-900 font-headline mb-4 uppercase tracking-tight">Pedoman Penyusunan Menu</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Gunakan standar di atas sebagai batas minimum (floor) dalam menentukan bahan baku utama seperti Protein Hewani dan Karbohidrat.
                            </p>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-white shadow-sm flex items-start gap-4">
                                <span className="material-symbols-outlined text-emerald-600">calculate</span>
                                <div>
                                    <h4 className="text-xs font-black text-emerald-900 uppercase mb-1">Otomasi Kalkulator</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Sistem akan otomatis menyesuaikan gramasi bahan berdasarkan multiplier porsi.</p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-white shadow-sm flex items-start gap-4">
                                <span className="material-symbols-outlined text-emerald-600">science</span>
                                <div>
                                    <h4 className="text-xs font-black text-emerald-900 uppercase mb-1">Validasi Ahli Gizi</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Setiap menu yang Anda susun akan divalidasi terhadap standar ini secara real-time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
