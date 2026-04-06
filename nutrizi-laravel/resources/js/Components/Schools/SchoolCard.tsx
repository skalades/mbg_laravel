import { School } from '@/types/school';
import { Link } from '@inertiajs/react';
import { School as SchoolIcon, Edit, ArrowRight, Utensils, Users, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolCardProps {
    school: School;
    onEdit: (school: School) => void;
}

export default function SchoolCard({ school, onEdit }: SchoolCardProps) {
    const totalCensus = (school.siswa_laki_laki || 0) + (school.siswa_perempuan || 0) + (school.guru_laki_laki || 0) + (school.guru_perempuan || 0);

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-emerald-900/5 shadow-sm hover:shadow-2xl hover:shadow-emerald-950/5 hover:-translate-y-2 transition-all group relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500 shadow-sm">
                    <SchoolIcon className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onEdit(school)}
                        className="w-10 h-10 bg-white text-emerald-600 rounded-xl border border-emerald-900/5 shadow-sm hover:bg-emerald-900 hover:text-white transition-all active:scale-90 flex items-center justify-center group/btn"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <span className="h-10 text-[9px] font-black text-emerald-900/40 bg-slate-50 px-5 rounded-xl border border-emerald-900/5 uppercase tracking-[0.2em] flex items-center justify-center transform group-hover:bg-emerald-50 group-hover:text-emerald-900 transition-all">
                        {school.target_group || 'PAUD'}
                    </span>
                </div>
            </div>

            <div className="relative z-10 space-y-1">
                <h3 className="text-2xl font-black text-emerald-950 font-headline leading-tight tracking-tight group-hover:text-emerald-800 transition-colors">{school.school_name}</h3>
                <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <LayoutGrid className="w-3 h-3" />
                    Unit Operasional SC-00{school.id}
                </p>
            </div>

            <div className="mt-10 py-8 border-t border-emerald-900/5 flex items-center justify-between relative z-10">
                <div className="flex gap-8">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-emerald-900/20 uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-emerald-900/10" />
                            Census
                        </p>
                        <p className="text-xl font-black text-emerald-950 leading-none">{totalCensus.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 border-l border-emerald-900/5 pl-8">
                        <p className="text-[8px] font-black text-emerald-600/40 uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Utensils className="w-3 h-3" />
                            Kecil
                        </p>
                        <p className="text-xl font-black text-emerald-600 leading-none">{school.small_portion_count || 0}</p>
                    </div>
                    <div className="space-y-1 border-l border-emerald-900/5 pl-8">
                        <p className="text-[8px] font-black text-indigo-500/40 uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Utensils className="w-3 h-3" />
                            Besar
                        </p>
                        <p className="text-xl font-black text-indigo-600 leading-none">{school.large_portion_count || 0}</p>
                    </div>
                </div>
            </div>

            <Link 
                href={`/schools/${school.id}`}
                className="w-full h-14 mt-2 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl shadow-slate-900/20 group/link"
            >
                Buka Dashboard Unit
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
            </Link>
        </div>
    );
}
