import { cn } from "@/lib/utils";
import { Zap, Egg, Droplets, Wheat, Utensils, Scale, Edit } from "lucide-react";

interface PortionConfig {
    id: number;
    name: string;
    meal_energy: number;
    meal_protein: number;
    meal_fat: number;
    meal_carbs: number;
    multiplier: number;
}

interface PortionConfigCardProps {
    portion: PortionConfig;
    onEdit: (portion: PortionConfig) => void;
}

export default function PortionConfigCard({ portion, onEdit }: PortionConfigCardProps) {
    const isLarge = portion.name.toLowerCase().includes('besar');
    
    const stats = [
        { label: 'Energi', value: portion.meal_energy, unit: 'kcal', icon: Zap, color: isLarge ? 'text-orange-500' : 'text-emerald-500', bg: isLarge ? 'bg-orange-50' : 'bg-emerald-50' },
        { label: 'Protein', value: portion.meal_protein, unit: 'g', icon: Egg, color: isLarge ? 'text-red-500' : 'text-emerald-500', bg: isLarge ? 'bg-red-50' : 'bg-emerald-50' },
        { label: 'Lemak', value: portion.meal_fat, unit: 'g', icon: Droplets, color: isLarge ? 'text-blue-500' : 'text-emerald-500', bg: isLarge ? 'bg-blue-50' : 'bg-emerald-50' },
        { label: 'Karbohidrat', value: portion.meal_carbs, unit: 'g', icon: Wheat, color: isLarge ? 'text-amber-500' : 'text-emerald-500', bg: isLarge ? 'bg-amber-50' : 'bg-emerald-50' },
    ];

    return (
        <div className={cn(
            "relative p-12 rounded-[3.5rem] border transition-all hover:shadow-2xl overflow-hidden group bg-white",
            isLarge ? "border-pink-900/5 shadow-pink-900/5" : "border-emerald-900/5 shadow-emerald-900/5"
        )}>
            {/* Background Decorative Element */}
            <div className={cn(
                "absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 blur-[100px] opacity-10 transition-all duration-1000 group-hover:scale-150 group-hover:opacity-30",
                isLarge ? "bg-pink-500" : "bg-emerald-500"
            )} />

            <div className="relative z-10 space-y-12">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className={cn(
                            "inline-flex items-center gap-3 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 border shadow-sm transition-all",
                            isLarge ? "bg-pink-50 text-pink-700 border-pink-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        )}>
                            <Scale className="w-4 h-4" />
                            Core Nutritional Basis
                        </div>
                        <div className="flex items-center gap-4">
                            <h3 className="text-4xl font-black text-emerald-950 font-headline tracking-tighter leading-none">{portion.name}</h3>
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                                isLarge ? "bg-pink-50 text-pink-500" : "bg-emerald-50 text-emerald-500"
                            )}>
                                <Utensils className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-4">
                        <button 
                            onClick={() => onEdit(portion)}
                            className="w-10 h-10 bg-slate-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm hover:bg-emerald-900 hover:text-white transition-all active:scale-90 flex items-center justify-center"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-emerald-900/20 uppercase tracking-[0.3em] mb-2 leading-none">Factor</p>
                            <p className={cn(
                                "text-4xl font-black font-headline leading-none tracking-tighter",
                                isLarge ? "text-pink-600" : "text-emerald-600"
                            )}>{portion.multiplier}<span className="text-xl opacity-40 text-current">x</span></p>
                        </div>
                    </div>
                </div>

                {/* Main Content Divider */}
                <div className="h-px bg-emerald-900/5 w-full" />

                {/* Matrix Grid */}
                <div className="grid grid-cols-2 gap-10">
                    {stats.map((stat) => (
                        <div key={stat.label} className="space-y-3 group/stat">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover/stat:scale-110 shadow-sm", stat.bg, stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                            <div className="flex items-baseline gap-2 pl-1">
                                <p className="text-4xl font-black text-emerald-950 tracking-tighter leading-none">
                                    {stat.value.toLocaleString()}
                                </p>
                                <p className="text-[10px] font-black text-emerald-900/20 uppercase tracking-widest">{stat.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Analytics Callout */}
                <div className="pt-10 border-t border-emerald-900/5 relative">
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-white">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest leading-relaxed">
                            Target nutrisi tersinkronisasi dengan <strong>Database Pusat</strong> • Referensi 30% AKG Harian Siswa Terdaftar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
