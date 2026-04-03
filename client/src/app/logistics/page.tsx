"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { generateLogisticsPDF } from "@/utils/ExportPDF";

interface LogisticsItem {
  food_name: string;
  category: string;
  unit_name: string;
  total_weight_gram: number;
}

export default function LogisticsTrackerPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<LogisticsItem[]>([]);
  const [targetedSchools, setTargetedSchools] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [applySmartRounding, setApplySmartRounding] = useState(true);

  useEffect(() => {
    fetchLogistics();
  }, [date]);

  const fetchLogistics = async () => {
    setLoading(true);
    try {
      const [resLogistics, resMenus] = await Promise.all([
         api.get(`/menus/daily/logistics/summary?date=${date}`),
         api.get(`/menus/daily?date=${date}`)
      ]);
      setItems(resLogistics.data);
      
      const schools = Array.from(new Set<string>(resMenus.data.map((m: any) => m.school_name)));
      setTargetedSchools(schools);
    } catch (error) {
      console.error("Failed to fetch logistics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, LogisticsItem[]> = {};
    items.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  const categoryIcons: Record<string, string> = {
    'KARBOHIDRAT': 'rice_bowl',
    'PROTEIN_HEWANI': 'set_meal',
    'PROTEIN_NABATI': 'eco',
    'SAYURAN': 'nutrition',
    'BUAH': 'apple',
    'BUMBU': 'science'
  };

  const categoryColors: Record<string, string> = {
    'KARBOHIDRAT': 'bg-amber-100 text-amber-800 border-amber-200',
    'PROTEIN_HEWANI': 'bg-rose-100 text-rose-800 border-rose-200',
    'PROTEIN_NABATI': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'SAYURAN': 'bg-lime-100 text-lime-800 border-lime-200',
    'BUAH': 'bg-orange-100 text-orange-800 border-orange-200',
    'BUMBU': 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const formatWeight = (gramsInput: number | string) => {
    // Smart Rounding Logic: Round up to nearest 0.5 KG if > 1000g, or nearest 50g if smaller
    let grams = Number(gramsInput);
    let finalWeight = grams;
    
    if (applySmartRounding) {
        if (grams >= 1000) {
            // Round to nearest 500g (0.5kg) ceiling
            finalWeight = Math.ceil(grams / 500) * 500;
        } else {
             // Round up to nearest 50g
            finalWeight = Math.ceil(grams / 50) * 50;
        }
    }

    if (finalWeight >= 1000) {
        return { value: (finalWeight / 1000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 }), unit: 'KG' };
    }
    return { value: finalWeight.toLocaleString('id-ID'), unit: 'G' };
  };

  const handlePrint = () => {
    generateLogisticsPDF(date, items, targetedSchools, applySmartRounding);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 print:p-0 print:m-0 print:max-w-none">
      {/* Header - hide on print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-headline">Global Shopping List</h2>
                <p className="text-slate-500 mt-1 text-sm">Agregat Kebutuhan Logistik Sentral</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <span className="material-symbols-outlined text-slate-400">calendar_month</span>
             <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-bold text-slate-700 outline-none bg-transparent"
             />
          </div>

          <button 
             onClick={handlePrint}
             className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
             <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
             Download PDF
          </button>
        </div>
      </div>

      {targetedSchools.length > 0 && (
         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl print:hidden flex items-start gap-4">
             <span className="material-symbols-outlined text-emerald-600 mt-0.5">school</span>
             <div>
                <h4 className="font-bold text-emerald-900 text-sm">Target Distribusi Logistik</h4>
                <p className="text-emerald-700 text-xs mt-1">Daftar belanja sentral ini mencakup pasokan untuk: <span className="font-bold">{targetedSchools.join(', ')}</span>.</p>
             </div>
         </div>
      )}

      {/* Control Tools - hide on print */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center print:hidden shadow-sm">
          <div>
              <h4 className="font-bold text-slate-900">Smart Rounding (Pembulatan Cerdas)</h4>
              <p className="text-xs text-slate-500 mt-1">Otomatis membulatkan gramasi ke satuan belanja terdekat di pasar tradisional (ke atas).</p>
          </div>
          <button 
             onClick={() => setApplySmartRounding(!applySmartRounding)}
             className={cn("relative w-14 h-8 rounded-full transition-colors duration-300", applySmartRounding ? "bg-primary" : "bg-slate-300")}
          >
              <div className={cn("absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300", applySmartRounding ? "translate-x-6" : "translate-x-0")}></div>
          </button>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
          <h1 className="text-3xl font-black font-headline text-slate-900">DAFTAR BELANJA LOGISTIK PUSAT</h1>
          <div className="flex justify-between mt-2">
              <div>
                 <p className="font-bold text-slate-600">Tanggal Operasional: {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 <p className="font-medium text-slate-500 text-sm mt-1">Distribusi: {targetedSchools.join(', ')}</p>
              </div>
              <p className="font-bold text-slate-600 text-right">Ter-generate: {new Date().toLocaleTimeString('id-ID')}</p>
          </div>
      </div>

      {loading ? (
          <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          </div>
      ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
              <span className="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
              <h3 className="font-bold text-slate-400 mt-2">Belum ada pemesanan menu yang disetujui untuk tanggal ini.</h3>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-2">
              {Object.keys(groupedItems).sort().map((category) => (
                  <div key={category} className={cn("rounded-3xl border print:border-slate-300 print:shadow-none print:break-inside-avoid", categoryColors[category] || categoryColors['BUMBU'])}>
                      <div className="p-5 border-b border-black/5 flex items-center gap-3">
                          <span className="material-symbols-outlined opacity-60">
                              {categoryIcons[category] || 'local_dining'}
                          </span>
                          <h3 className="font-black font-headline tracking-widest text-sm">{category.replace('_', ' ')}</h3>
                      </div>
                      <div className="p-2">
                          {groupedItems[category].map((item, idx) => {
                              const weightStr = formatWeight(item.total_weight_gram);
                              return (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-white/40 rounded-xl transition-colors print:border-b print:border-slate-200 print:rounded-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-current opacity-30 print:hidden"></div>
                                        <span className="font-bold">{item.food_name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-white/60 px-3 py-1 rounded-lg border border-black/5 flex items-baseline gap-1 print:bg-transparent print:border-none print:p-0">
                                            <span className="font-black text-lg print:text-base leading-none">{weightStr.value}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{weightStr.unit}</span>
                                        </div>
                                        {applySmartRounding && (
                                            <span className="text-[9px] font-medium opacity-50 block mt-1 print:hidden" title="Berat perhitungan riil masakan">
                                                Riil: {(item.total_weight_gram / 1000).toFixed(2)} KG
                                            </span>
                                        )}
                                    </div>
                                </div>
                              )
                          })}
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Analytics Footer/Bottom Sheet */}
      {items.length > 0 && (
          <div className="mt-8 bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center shadow-xl print:hidden gap-6">
              <div>
                  <h4 className="font-black text-2xl font-headline">Total Tonase Kebutuhan</h4>
                  <p className="text-slate-400 text-sm mt-1">Seluruh item bahan mentah digabungkan dalam satu platform pengiriman hari ini.</p>
              </div>
              <div className="bg-white/10 px-8 py-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-4xl font-black font-headline text-primary">
                    {formatWeight(items.reduce((acc, curr) => acc + Number(curr.total_weight_gram), 0)).value}
                  </span>
                  <span className="text-sm font-bold text-slate-300 ml-2">
                    {formatWeight(items.reduce((acc, curr) => acc + Number(curr.total_weight_gram), 0)).unit}
                  </span>
              </div>
          </div>
      )}
    </div>
  );
}
