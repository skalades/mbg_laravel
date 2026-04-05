import React from 'react';

interface NutrientVisualizerProps {
    protein: number;
    fat: number;
    carbs: number;
    totalKcal: number;
}

export default function NutrientVisualizer({ protein, fat, carbs, totalKcal }: NutrientVisualizerProps) {
    // Simple calculation for visual distribution (not strictly by energy)
    const total = protein + fat + carbs || 1;
    const pWidth = (protein / total) * 100;
    const fWidth = (fat / total) * 100;
    const cWidth = (carbs / total) * 100;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-emerald-900 leading-none">{totalKcal}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-800/40 tracking-widest">Kcal</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-emerald-700">{protein}g</span>
                        <span className="text-[8px] uppercase font-bold text-emerald-800/30">Prot</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-amber-600">{fat}g</span>
                        <span className="text-[8px] uppercase font-bold text-emerald-800/30">Lemak</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-blue-600">{carbs}g</span>
                        <span className="text-[8px] uppercase font-bold text-emerald-800/30">Karb</span>
                    </div>
                </div>
            </div>

            {/* Distribution Bar */}
            <div className="h-1.5 w-full bg-emerald-50 rounded-full flex overflow-hidden shadow-inner ring-1 ring-emerald-900/5">
                <div 
                    title={`Protein: ${pWidth.toFixed(1)}%`}
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
                    style={{ width: `${pWidth}%` }}
                />
                <div 
                    title={`Lemak: ${fWidth.toFixed(1)}%`}
                    className="h-full bg-amber-400 transition-all duration-500 ease-out" 
                    style={{ width: `${fWidth}%` }}
                />
                <div 
                    title={`Karbohidrat: ${cWidth.toFixed(1)}%`}
                    className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                    style={{ width: `${cWidth}%` }}
                />
            </div>
            
            <div className="flex justify-between items-center text-[9px] font-bold text-emerald-800/40 uppercase tracking-tighter">
                <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Protein
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    Lemak
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Karbo
                </span>
            </div>
        </div>
    );
}
