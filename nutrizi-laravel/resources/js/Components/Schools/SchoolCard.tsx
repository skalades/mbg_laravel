import { School } from '@/types/school';
import { Link } from '@inertiajs/react';

interface SchoolCardProps {
    school: School;
    onEdit: (school: School) => void;
}

export default function SchoolCard({ school, onEdit }: SchoolCardProps) {
    const totalCensus = (school.total_beneficiaries || 0) + (school.total_teachers || 0);

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-emerald-100 transition-colors" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-[1.5rem] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">school</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onEdit(school)}
                        className="p-3 bg-white text-emerald-600 rounded-xl border border-emerald-100 shadow-sm hover:bg-emerald-600 hover:text-white transition-all scale-90"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest self-center">
                        {school.target_group || 'Umum'}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-black text-emerald-900 font-headline mb-2 pr-4">{school.school_name}</h3>
            <p className="text-emerald-800/40 text-xs font-medium line-clamp-2 min-h-[2.5rem]">{school.location_address || 'Alamat belum diatur'}</p>

            <div className="mt-8 pt-8 border-t border-emerald-50 flex items-center justify-between">
                <div className="flex gap-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-emerald-800/30 uppercase tracking-widest leading-none">Siswa & Guru</p>
                        <p className="text-xl font-black text-emerald-900 leading-none">{totalCensus.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 border-l border-emerald-50 pl-6">
                        <p className="text-[9px] font-black text-emerald-600/30 uppercase tracking-widest leading-none flex items-center gap-1">
                            Kecil <span className="material-symbols-outlined text-[10px]">soup_kitchen</span>
                        </p>
                        <p className="text-xl font-black text-emerald-600 leading-none">{school.small_portion_count || 0}</p>
                    </div>
                    <div className="space-y-1 border-l border-emerald-50 pl-6">
                        <p className="text-[9px] font-black text-pink-500/30 uppercase tracking-widest leading-none flex items-center gap-1">
                            Besar <span className="material-symbols-outlined text-[10px]">restaurant</span>
                        </p>
                        <p className="text-xl font-black text-pink-600 leading-none">{school.large_portion_count || 0}</p>
                    </div>
                </div>
                <Link 
                    href={`/schools/${school.id}`}
                    className="h-12 w-12 rounded-2xl bg-emerald-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20"
                >
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
}
