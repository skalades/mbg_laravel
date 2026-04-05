import { cn } from "@/lib/utils";

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
}

export default function PortionConfigCard({ portion }: PortionConfigCardProps) {
    const isLarge = portion.name.toLowerCase().includes('besar');
    
    const stats = [
        { label: 'Energi', value: portion.meal_energy, unit: 'kcal', icon: 'bolt', color: isLarge ? 'text-orange-500' : 'text-emerald-500' },
        { label: 'Protein', value: portion.meal_protein, unit: 'g', icon: 'egg_alt', color: isLarge ? 'text-red-500' : 'text-emerald-500' },
        { label: 'Lemak', value: portion.meal_fat, unit: 'g', icon: 'opacity', color: isLarge ? 'text-blue-500' : 'text-emerald-500' },
        { label: 'Karbohidrat', value: portion.meal_carbs, unit: 'g', icon: 'grain', color: isLarge ? 'text-amber-500' : 'text-emerald-500' },
    ];

    return (
        <div className={cn(
            "relative p-10 rounded-[3rem] border transition-all hover:shadow-2xl overflow-hidden group bg-white",
            isLarge ? "border-pink-900/5" : "border-emerald-900/5"
        )}>
            {/* Background Decoration */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
                isLarge ? "bg-pink-500" : "bg-emerald-500"
            )} />

            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border",
                            isLarge ? "bg-pink-50 text-pink-700 border-pink-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        )}>
                            <span className="material-symbols-outlined text-[14px]">
                                {isLarge ? 'restaurant' : 'soup_kitchen'}
                            </span>
                            Standar Nutritional
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 font-headline tracking-tight">{portion.name}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Multiplier</p>
                        <p className={cn(
                            "text-3xl font-black font-headline",
                            isLarge ? "text-pink-600" : "text-emerald-600"
                        )}>{portion.multiplier}x</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 w-full" />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn("p-2 rounded-xl bg-slate-50", stat.color.replace('text', 'bg').replace('500', '100/50'))}>
                                    <span className={cn("material-symbols-outlined text-lg", stat.color)}>{stat.icon}</span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                            <p className="text-2xl font-black text-slate-900">
                                {stat.value.toLocaleString()} <span className="text-xs font-bold text-slate-300 uppercase">{stat.unit}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer Reference Note */}
                <div className="pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 italic">
                        *Target nutrisi dihitung berdasarkan 30% dari total AKG harian.
                    </p>
                </div>
            </div>
        </div>
    );
}
