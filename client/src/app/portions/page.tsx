"use client";

import React, { useEffect, useState } from "react";
import { Scale, Save, RefreshCw, AlertCircle, TrendingUp, Pizza, Droplets, Zap } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface PortionConfig {
  id: number;
  name: string;
  daily_energy: number;
  daily_protein: number;
  daily_fat: number;
  daily_carbs: number;
  adequacy_percent: number;
  meal_energy: number;
  meal_protein: number;
  meal_fat: number;
  meal_carbs: number;
  multiplier: number;
}

export default function PortionsPage() {
  const [portions, setPortions] = useState<PortionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchPortions();
  }, []);

  const fetchPortions = async () => {
    try {
      const response = await api.get("/portions");
      setPortions(response.data);
    } catch (error) {
      console.error("Failed to fetch portions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (id: number, field: keyof PortionConfig, value: string | number) => {
    setPortions(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        
        // Recalculate meal values if daily values or adequacy percent changed
        if (['daily_energy', 'daily_protein', 'daily_fat', 'daily_carbs', 'adequacy_percent'].includes(field)) {
            const perc = (updated.adequacy_percent || 30) / 100;
            updated.meal_energy = Number((updated.daily_energy * perc).toFixed(1));
            updated.meal_protein = Number((updated.daily_protein * perc).toFixed(1));
            updated.meal_fat = Number((updated.daily_fat * perc).toFixed(1));
            updated.meal_carbs = Number((updated.daily_carbs * perc).toFixed(1));
        }
        return updated;
      }
      return p;
    }));
  };

  const savePortion = async (portion: PortionConfig) => {
    setSaving(portion.id);
    try {
      await api.put(`/portions/${portion.id}`, portion);
      // Optional: show toast/success
    } catch (error) {
      console.error("Failed to save portion:", error);
      alert("Gagal menyimpan perubahan.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6" />
             </div>
             <h2 className="text-3xl font-black tracking-tight text-slate-900 font-headline">Manajemen Porsi</h2>
          </div>
          <p className="text-slate-500 max-w-xl">
            Konfigurasi target gizi harian dan porsi makan siang (30%) untuk berbagai profil porsi.
            Nilai ini akan menjadi acuan utama di Precision Planner.
          </p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-4 max-w-xs transition-all hover:shadow-lg">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-wider">
                Perubahan pada halaman ini akan langsung mempengaruhi kalkulasi target gizi di Meal Planner secara global.
            </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="h-96 rounded-[2.5rem] bg-slate-100 animate-pulse" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {portions.filter(p => p.name !== 'Standard (SD)').map((portion) => (
            <div key={portion.id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    
                    {/* Card Header */}
                    <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 font-headline uppercase tracking-tight">{portion.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    portion.name.includes("Besar") ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600"
                                )}>
                                    {portion.name.includes("Besar") ? "High Intake" : "Standard Intake"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• Adequacy {portion.adequacy_percent}%</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => savePortion(portion)}
                            disabled={saving === portion.id}
                            className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-primary transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10"
                        >
                            {saving === portion.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Daily Requirements Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kebutuhan Zat Gizi Sehari</h4>
                                <TrendingUp className="w-4 h-4 text-slate-300" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <InputCard 
                                    label="Energi" 
                                    icon={<Zap className="w-4 h-4" />} 
                                    value={portion.daily_energy} 
                                    unit="kkal"
                                    onChange={(v) => handleUpdateField(portion.id, 'daily_energy', v)}
                                    color="orange"
                                />
                                <InputCard 
                                    label="Protein" 
                                    icon={<Pizza className="w-4 h-4" />} 
                                    value={portion.daily_protein} 
                                    unit="g" 
                                    onChange={(v) => handleUpdateField(portion.id, 'daily_protein', v)}
                                    color="blue"
                                />
                                <InputCard 
                                    label="Lemak" 
                                    icon={<Droplets className="w-4 h-4" />} 
                                    value={portion.daily_fat} 
                                    unit="g" 
                                    onChange={(v) => handleUpdateField(portion.id, 'daily_fat', v)}
                                    color="amber"
                                />
                                <InputCard 
                                    label="Karbo" 
                                    icon={<TrendingUp className="w-4 h-4" />} 
                                    value={portion.daily_carbs} 
                                    unit="g" 
                                    onChange={(v) => handleUpdateField(portion.id, 'daily_carbs', v)}
                                    color="emerald"
                                />
                            </div>
                        </div>

                        {/* Calculated Lunch Section */}
                        <div className="pt-8 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Kecukupan Makan Siang ({portion.adequacy_percent}%)
                                </h4>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                <ResultDisplay value={portion.meal_energy} label="Energi" unit="kkal" />
                                <ResultDisplay value={portion.meal_protein} label="Pro" unit="g" />
                                <ResultDisplay value={portion.meal_fat} label="Fat" unit="g" />
                                <ResultDisplay value={portion.meal_carbs} label="Carb" unit="g" />
                            </div>
                        </div>
                    </div>

                    {/* Multiplier Slider (Legacy Support but useful UI) */}
                    <div className="bg-slate-50/50 p-8 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-1">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight Multiplier Factor</label>
                             <span className="font-black text-slate-900">{portion.multiplier}x</span>
                        </div>
                        <input 
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                            value={portion.multiplier}
                            onChange={(e) => handleUpdateField(portion.id, 'multiplier', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InputCard({ label, value, unit, icon, onChange, color }: { label: string, value: number, unit: string, icon: React.ReactNode, onChange: (v: number) => void, color: string }) {
    const colorClasses: Record<string, string> = {
        orange: "text-orange-500 bg-orange-50/50",
        blue: "text-blue-500 bg-blue-50/50",
        amber: "text-amber-500 bg-amber-50/50",
        emerald: "text-emerald-500 bg-emerald-50/50"
    };

    return (
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-1 transition-all focus-within:ring-2 focus-within:ring-slate-200 focus-within:bg-white">
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", colorClasses[color])}>
                    {icon}
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-end gap-1 px-1">
                <input 
                    type="number" 
                    className="bg-transparent border-none p-0 text-xl font-black text-slate-900 w-full outline-none focus:ring-0"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                />
                <span className="text-[10px] font-bold text-slate-300 uppercase mb-1">{unit}</span>
            </div>
        </div>
    );
}

function ResultDisplay({ value, label, unit }: { value: number, label: string, unit: string }) {
    return (
        <div className="flex flex-col items-center bg-white border border-slate-100 py-4 rounded-2xl shadow-sm">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
            <span className="text-sm font-black text-slate-900">{value}</span>
            <span className="text-[8px] font-bold text-slate-300 uppercase leading-none">{unit}</span>
        </div>
    );
}
