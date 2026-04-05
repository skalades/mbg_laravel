import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

interface School {
    id: number;
    school_name: string;
    target_group: string | null;
    total_beneficiaries: number;
    total_teachers: number | null;
    large_portion_count: number | null;
    small_portion_count: number | null;
    location_address: string | null;
    siswa_laki_laki: number | null;
    siswa_perempuan: number | null;
    guru_laki_laki: number | null;
    guru_perempuan: number | null;
}

interface ShowProps {
    school: School;
}

export default function SchoolShow({ school }: ShowProps) {


    return (
        <AuthenticatedLayout
            header={`Profil ${school.school_name}`}
        >
            <Head title={`Sekolah: ${school.school_name}`} />

            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] border border-emerald-900/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-100 transition-colors" />
                    
                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-2 rounded-full border border-emerald-100 mb-2">
                            <span className="material-symbols-outlined text-sm">school</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{school.target_group || 'Umum'}</span>
                        </div>
                        <h2 className="text-4xl font-black text-emerald-900 font-headline leading-tight">{school.school_name}</h2>
                        <div className="flex items-center gap-2 text-emerald-800/40 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg">location_on</span>
                            {school.location_address || 'Alamat belum diatur'}
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <Link 
                            href={route('schools.edit', school.id)}
                            className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:translate-y-[-2px] transition-all flex items-center gap-3 shadow-xl shadow-emerald-900/20"
                        >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit Profil
                        </Link>
                        <Link 
                            href={route('schools.destroy', school.id)}
                            method="delete"
                            as="button"
                            onBefore={() => confirm('Apakah Anda yakin ingin menghapus sekolah ini? Seluruh data terkait akan terhapus.')}
                            className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-red-100 transition-all flex items-center gap-3 border border-red-100"
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Hapus
                        </Link>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Beneficiaries Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 shadow-sm space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">Siswa</span>
                        </div>
                        <div>
                            <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest ml-1">Penerima Manfaat</p>
                            <p className="text-5xl font-black font-headline text-emerald-900 mt-2">{school.total_beneficiaries?.toLocaleString() || 0}</p>
                        </div>
                        <div className="pt-6 border-t border-emerald-50 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-black text-blue-800/30 uppercase tracking-widest mb-1 italic">Laki-laki</p>
                                <p className="text-lg font-black text-blue-900">{school.siswa_laki_laki || 0}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-pink-800/30 uppercase tracking-widest mb-1 italic">Perempuan</p>
                                <p className="text-lg font-black text-pink-900">{school.siswa_perempuan || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Staff Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 shadow-sm space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl">
                                <span className="material-symbols-outlined">person_pin</span>
                            </div>
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">Staf</span>
                        </div>
                        <div>
                            <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest ml-1">Total Guru & Staf</p>
                            <p className="text-5xl font-black font-headline text-emerald-900 mt-2">{school.total_teachers?.toLocaleString() || 0}</p>
                        </div>
                        <div className="pt-6 border-t border-emerald-50 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-black text-blue-800/30 uppercase tracking-widest mb-1 italic">Laki-laki</p>
                                <p className="text-lg font-black text-blue-900">{school.guru_laki_laki || 0}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-pink-800/30 uppercase tracking-widest mb-1 italic">Perempuan</p>
                                <p className="text-lg font-black text-pink-900">{school.guru_perempuan || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Portions Card */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div className="p-4 bg-white/10 text-emerald-400 rounded-2xl">
                                <span className="material-symbols-outlined">restaurant</span>
                            </div>
                            <span className="text-[10px] font-black text-white/50 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest">Logistik</span>
                        </div>
                        <div className="relative z-10 transition-transform group-hover:translate-x-1 duration-500">
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Estimasi Porsi</p>
                            <p className="text-5xl font-black font-headline text-white mt-2">{(school.large_portion_count || 0) + (school.small_portion_count || 0)}</p>
                        </div>
                        <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 relative z-10">
                            <div>
                                <p className="text-[9px] font-black text-emerald-400/50 uppercase tracking-widest mb-1 italic">Porsi Besar</p>
                                <p className="text-lg font-black text-white">{school.large_portion_count || 0}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-emerald-400/50 uppercase tracking-widest mb-1 italic">Porsi Kecil</p>
                                <p className="text-lg font-black text-white">{school.small_portion_count || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info / History Placeholder */}
                <div className="bg-white p-10 rounded-[3rem] border border-emerald-900/5 shadow-sm text-center py-24 space-y-4">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl opacity-20">history</span>
                    </div>
                    <p className="text-emerald-900 font-black font-headline text-2xl tracking-tight">Riwayat Distribusi & Audit Terkait</p>
                    <p className="text-emerald-800/40 text-sm italic max-w-md mx-auto leading-relaxed">Modul riwayat distribusi untuk sekolah ini sedang dalam tahap sinkronisasi data dari sistem lama.</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Function to handle route helper (mimicking Ziggy)
const route = (name: string, params?: any) => {
    if (name === 'schools.index') return '/schools';
    if (name === 'schools.edit') return `/schools/${params}/edit`;
    if (name === 'schools.destroy') return `/schools/${params}`;
    return '#';
};
