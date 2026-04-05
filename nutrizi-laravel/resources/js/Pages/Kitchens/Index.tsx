import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

interface Kitchen {
    id: number;
    kitchen_name: string;
    location_address: string;
    capacity: number;
}

interface KitchensProps extends PageProps {
    kitchens: Kitchen[];
}

export default function KitchensIndex({ kitchens }: KitchensProps) {
    return (
        <AuthenticatedLayout
            header="Unit Produksi"
        >
            <Head title="Kitchen & Logistik" />

            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Manajemen Kitchen</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            Pantau kapasitas produksi dan status operasional unit dapur.
                        </p>
                    </div>
                    
                    <button className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:translate-y-[-2px] transition-all flex items-center gap-3">
                        Tambah Unit
                        <span className="material-symbols-outlined">add_business</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {kitchens.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-emerald-800/30 italic">Belum ada unit kitchen terdaftar.</div>
                    ) : (
                        kitchens.map((kitchen) => (
                            <div key={kitchen.id} className="bg-white rounded-[3rem] p-10 border border-emerald-900/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                    <div className="w-24 h-24 bg-emerald-900 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-900/20">
                                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black text-emerald-900 font-headline">{kitchen.kitchen_name}</h3>
                                            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                                        </div>
                                        <p className="text-emerald-800/50 text-sm font-medium pr-10">{kitchen.location_address || 'Lokasi belum diatur'}</p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-emerald-50 grid grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-emerald-800/30 uppercase tracking-widest">Kapasitas Harian</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-black text-emerald-900">{kitchen.capacity || 0}</p>
                                            <span className="text-[10px] font-bold text-emerald-800/40">porsi / hari</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-end">
                                        <Link 
                                            href={`/kitchens/${kitchen.id}`}
                                            className="px-6 py-3 bg-emerald-50 text-emerald-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900 hover:text-white transition-all shadow-sm"
                                        >
                                            Kelola Unit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
