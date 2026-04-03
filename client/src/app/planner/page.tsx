"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import SaveTemplateModal from "@/components/SaveTemplateModal";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FoodItem {
  id: number;
  name: string;
  category: string;
  energy_kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  yield_factor: number;
}

interface Conversion {
  id: number;
  unit_name: string;
  weight_gram_standard: number;
}

interface SelectedItem {
  food_id: number;
  name: string;
  quantity_small: number;
  quantity_large: number;
  unit: string;
  category: string;
  nutrients: {
    energy_kcal: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
  };
  conversions: Conversion[];
  yield_factor: number;
}

interface School {
  id: number;
  school_name: string;
  target_group: string;
  total_beneficiaries: number;
  total_teachers: number;
  large_portion_count: number;
  small_portion_count: number;
}

interface PortionConfig {
  id: number;
  name: string;
  multiplier: number;
  meal_energy: number;
  meal_protein: number;
  meal_fat: number;
  meal_carbs: number;
}

export default function MealPlannerPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalsSmall, setTotalsSmall] = useState({ energy_kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0 });
  const [totalsLarge, setTotalsLarge] = useState({ energy_kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0 });
  const [portionConfigs, setPortionConfigs] = useState<PortionConfig[]>([]);

  // Phase 3 States
  const [bufferPortions, setBufferPortions] = useState<number>(5);
  const [samplingPortions, setSamplingPortions] = useState<number>(1);
  const [totalProduction, setTotalProduction] = useState<number>(0);
  const [allergyWarnings, setAllergyWarnings] = useState<any[]>([]);
  const [masterMenus, setMasterMenus] = useState<any[]>([]);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  useEffect(() => { 
    fetchSchools(); 
    fetchMasterMenus(); 
    fetchPortionConfigs();
  }, []);

  const fetchPortionConfigs = async () => {
    try {
      const res = await api.get("/portions");
      setPortionConfigs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSchools = async () => {
    try {
      const res = await api.get("/schools");
      setSchools(res.data);
      if (res.data.length > 0) setSelectedSchools([res.data[0]]);
    } catch (err) { console.error(err); }
  };

  const fetchMasterMenus = async () => {
    try {
      const res = await api.get("/menus/master");
      setMasterMenus(res.data);
    } catch (err) { console.error(err); }
  };

  const smallCountAgg = selectedSchools.reduce((acc, s) => acc + (s.small_portion_count || 0), 0);
  const largeCountAgg = selectedSchools.reduce((acc, s) => acc + (s.large_portion_count || 0), 0);
  const siswaTerdaftarAgg = selectedSchools.reduce((acc, s) => acc + ((s.small_portion_count || 0) + (s.large_portion_count || 0)), 0);

  useEffect(() => {
    if (selectedSchools.length > 0) {
      setTotalProduction(
        smallCountAgg + 
        largeCountAgg + 
        bufferPortions + 
        samplingPortions
      );
    } else {
        setTotalProduction(0);
    }
  }, [selectedSchools, bufferPortions, samplingPortions]);

  useEffect(() => {
    const checkAllergies = async () => {
      if (selectedSchools.length > 0 && selectedItems.length > 0) {
        try {
          const resArray = await Promise.all(
              selectedSchools.map(school => 
                  api.post("/menus/check-allergies", {
                      school_id: school.id,
                      items: selectedItems
                  })
              )
          );
          
          let compiledWarnings: any[] = [];
          resArray.forEach((res, i) => {
              const warnings = res.data.warnings || [];
              const mapped = warnings.map((w: any) => ({ ...w, school_name: selectedSchools[i].school_name }));
              compiledWarnings = [...compiledWarnings, ...mapped];
          });
          
          setAllergyWarnings(compiledWarnings);
        } catch (err) { console.error(err); }
      } else {
        setAllergyWarnings([]);
      }
    };
    checkAllergies();
  }, [selectedSchools, selectedItems]);

  const calculateTotals = (items: SelectedItem[]) => {
    const compute = (type: 'small' | 'large') => {
      return items.reduce((acc, item) => {
        let weight = type === 'small' ? item.quantity_small : item.quantity_large;
        if (item.unit !== 'gram') {
          const conv = item.conversions.find(c => c.unit_name === item.unit);
          if (conv) weight = (type === 'small' ? item.quantity_small : item.quantity_large) * conv.weight_gram_standard;
        }

        return {
          energy_kcal: acc.energy_kcal + (item.nutrients.energy_kcal * (weight / 100)),
          protein_g: acc.protein_g + (item.nutrients.protein_g * (weight / 100)),
          fat_g: acc.fat_g + (item.nutrients.fat_g * (weight / 100)),
          carbs_g: acc.carbs_g + (item.nutrients.carbs_g * (weight / 100)),
        };
      }, { energy_kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0 });
    };

    setTotalsSmall(compute('small'));
    setTotalsLarge(compute('large'));
  };

  useEffect(() => { 
    calculateTotals(selectedItems); 
  }, [selectedItems, selectedSchools, portionConfigs]);

  const calorieStatus = (type: 'small' | 'large') => {
    if (selectedSchools.length === 0) return "neutral";
    const totals = type === 'small' ? totalsSmall : totalsLarge;
    if (totals.energy_kcal === 0) return "neutral";

    const config = portionConfigs.find(p => p.name.includes(type === 'small' ? "Kecil" : "Besar"));
    if (!config) return "neutral";

    const target = config.meal_energy;
    if (totals.energy_kcal < target * 0.9) return "low";
    if (totals.energy_kcal > target * 1.1) return "high";
    return "ideal";
  };

  const getStatusColor = (type: 'small' | 'large') => {
    switch (calorieStatus(type)) {
      case 'ideal': return 'bg-emerald-500 text-white animate-pulse-ideal border border-white/20';
      case 'low': return 'bg-amber-500 text-white';
      case 'high': return 'bg-rose-500 text-white';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const handleSearchAPI = async (val: string) => {
    try {
      const res = await api.get(`/planner/search?name=${val}`);
      setSearchResults(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) handleSearchAPI(searchQuery);
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addItem = async (food: FoodItem) => {
    try {
      const convRes = await api.get(`/planner/food/${food.id}/conversions`);
      const smallPortion = portionConfigs.find(p => p.name.includes("Kecil"));
      const largePortion = portionConfigs.find(p => p.name.includes("Besar"));
      
      const smallMult = smallPortion ? Number(smallPortion.multiplier) : 0.8;
      const largeMult = largePortion ? Number(largePortion.multiplier) : 1.2;

      const newItem: SelectedItem = {
        food_id: food.id,
        name: food.name,
        quantity_small: 100 * smallMult,
        quantity_large: 100 * largeMult,
        unit: "gram",
        category: food.category,
        conversions: convRes.data,
        nutrients: {
          energy_kcal: parseFloat(food.energy_kcal.toString()),
          protein_g: parseFloat(food.protein_g.toString()),
          fat_g: parseFloat(food.fat_g.toString()),
          carbs_g: parseFloat(food.carbs_g.toString())
        },
        yield_factor: food.yield_factor || 1.0
      };
      setSelectedItems([...selectedItems, newItem]);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) { console.error(err); }
  };

  const removeItem = (idx: number) => {
    const n = [...selectedItems];
    n.splice(idx, 1);
    setSelectedItems(n);
  };

  const loadMasterMenu = async (id: number) => {
    try {
      const res = await api.get(`/menus/master/${id}`);
      const menu = res.data;
      
      const newItems = await Promise.all(menu.items.map(async (item: any) => {
        const convRes = await api.get(`/planner/food/${item.food_item_id}/conversions`);
        const foodRes = await api.get(`/planner/search?name=${item.portion_name}`);
        const food = foodRes.data[0] || { energy_kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0 };

        return {
          food_id: item.food_item_id,
          name: item.portion_name,
          quantity_small: item.weight_small || item.raw_weight_gram,
          quantity_large: item.weight_large || item.raw_weight_gram,
          unit: item.unit_name || "gram",
          category: "TEMPLATE",
          conversions: convRes.data,
          nutrients: {
            energy_kcal: food.energy_kcal,
            protein_g: food.protein_g,
            fat_g: food.fat_g,
            carbs_g: food.carbs_g
          },
          yield_factor: food.yield_factor || 1.0
        };
      }));

      setSelectedItems(newItems as any);
      setIsMasterMenuOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleSaveDailyMenu = async () => {
    if (selectedSchools.length === 0 || selectedItems.length === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(selectedSchools.map(school => 
          api.post("/menus/daily", {
            school_id: school.id,
            menu_date: new Date().toISOString().split('T')[0],
            buffer_portions: bufferPortions,
            organoleptic_portions: samplingPortions,
            items: selectedItems.map(item => ({
              food_item_id: item.food_id,
              portion_name: item.name,
              weight_small: item.quantity_small,
              weight_large: item.quantity_large,
              unit_name: item.unit,
              unit_quantity: item.quantity_large
            }))
          })
      ));
      alert("✅ Seluruh menu berhasil disinkronisasi untuk sekolah-sekolah yang terpilih!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan menu ke salah satu atau semua sekolah.");
    } finally {
      setIsSaving(false);
    }
  };

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleSaveAsTemplate = async (name: string) => {
    if (selectedItems.length === 0) return;
    setIsSavingTemplate(true);
    try {
      await api.post("/menus/master", {
        menu_name: name,
        target_group: selectedSchools[0]?.target_group || "SD",
        items: selectedItems.map(item => ({
          food_item_id: item.food_id,
          portion_name: item.name,
          weight_small: item.quantity_small,
          weight_large: item.quantity_large,
          unit_name: item.unit,
          unit_quantity: item.quantity_large
        }))
      });
      alert("✅ Templat berhasil disimpan!");
      setIsTemplateModalOpen(false);
      fetchMasterMenus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-2xl">set_meal</span>
            </div>
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary font-headline">Precision Planner</h2>
                <p className="text-on-surface-variant mt-1 text-sm">Dual-Portion System Optimized</p>
            </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsMasterMenuOpen(true)}
            className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
          >
             <span className="material-symbols-outlined text-[20px]">auto_stories</span>
             Load Template
          </button>
          
          <button 
            onClick={() => setIsTemplateModalOpen(true)}
            disabled={isSavingTemplate || selectedItems.length === 0}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-primary"
          >
             {isSavingTemplate ? <span className="animate-spin material-symbols-outlined text-[20px]">sync</span> : <span className="material-symbols-outlined text-[20px]">save</span>}
             Simpan Templat
          </button>
          
          <div className="relative">
             <button 
                onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)}
                className="bg-white p-1.5 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors w-48"
             >
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3">Target</span>
                    <span className="text-sm font-bold text-primary">{selectedSchools.length} Sekolah</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">expand_more</span>
             </button>
             
             {isTargetDropdownOpen && (
                 <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                     <div className="p-4 border-b border-slate-50 max-h-64 overflow-y-auto space-y-2">
                         {schools.map(s => {
                             const isChecked = selectedSchools.some(sel => sel.id === s.id);
                             return (
                                 <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-emerald-100">
                                     <div className={cn("w-5 h-5 rounded flex justify-center items-center shrink-0 border transition-colors", isChecked ? "bg-primary border-primary" : "bg-white border-slate-200 group-hover:border-primary")}>
                                         {isChecked && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                     </div>
                                     <div>
                                        <p className="font-bold text-slate-700 text-sm group-hover:text-primary">{s.school_name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{s.target_group}</p>
                                     </div>
                                     <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={isChecked}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedSchools([...selectedSchools, s]);
                                            else setSelectedSchools(selectedSchools.filter(sel => sel.id !== s.id));
                                        }}
                                     />
                                 </label>
                             );
                         })}
                     </div>
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Allergy Warning Banner */}
      {allergyWarnings.length > 0 && (
         <div className="bg-rose-50 border border-rose-200 p-6 rounded-[2rem] flex gap-6 items-center shadow-xl shadow-rose-900/5 animate-in slide-in-from-top-4 duration-500">
            <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div>
                <h4 className="text-rose-600 font-black font-headline uppercase tracking-wide text-sm mb-1">Student Allergy Detected!</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                    {allergyWarnings.map((w, i) => (
                        <span key={i} className="bg-white border border-rose-100 px-3 py-1 rounded-full text-[11px] font-bold text-rose-700">
                            {w.student_name}: No {w.allergen_match}
                        </span>
                    ))}
                </div>
            </div>
         </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Logistics Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Siswa & Guru (Agregat)</label>
                    <div className="bg-slate-50 p-4 rounded-3xl font-black text-2xl text-slate-900 font-headline flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">group</span>
                            <span>{siswaTerdaftarAgg}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded-lg">{smallCountAgg}K</span>
                            <span className="text-[9px] px-2 py-1 bg-rose-100 text-rose-600 rounded-lg">{largeCountAgg}B</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buffer + Sampling</label>
                    <div className="bg-slate-50 p-8 py-4 rounded-3xl font-black text-2xl text-slate-900 font-headline border border-slate-100">
                        {bufferPortions + samplingPortions}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Produksi</label>
                    <div className="bg-primary text-white p-4 rounded-3xl font-black text-2xl font-headline shadow-lg shadow-primary/20 flex justify-between items-center">
                        <span>{totalProduction}</span>
                        <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">Porsi</span>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
                <p className="text-xs text-slate-500 font-medium">Gramasi dihitung secara otomatis berdasarkan rasio porsi sekolah. Anda dapat mengubah berat item tertentu secara manual untuk menyesuaikan kebutuhan gizi porsi kecil/besar secara independen.</p>
            </div>

            {/* Search Bar */}
            <div className="relative pt-6 border-t border-slate-50">
                <span className="material-symbols-outlined absolute left-6 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400">search</span>
                <input
                    type="text"
                    className="w-full pl-14 pr-4 py-5 bg-slate-50 rounded-3xl border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none font-bold text-sm transition-all"
                    placeholder="Cari bahan makanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                   <div className="absolute z-50 mt-2 w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                    {searchResults.map((f) => (
                        <button key={f.id} onClick={() => addItem(f)} className="w-full text-left p-5 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between group">
                            <span className="font-bold text-slate-700 group-hover:text-primary">{f.name}</span>
                            <span className="text-xs font-bold text-slate-400">{f.energy_kcal} kkal</span>
                        </button>
                    ))}
                   </div>
                )}
            </div>
          </div>

          {/* Selected Items */}
          <div className="space-y-4">
             {selectedItems.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:border-primary/20 hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all shrink-0">
                        {idx + 1}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <h4 className="font-bold text-slate-900 text-md leading-tight flex items-center gap-2">
                           {item.name}
                           {(item.yield_factor && item.yield_factor !== 1.0) && (
                               <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase">Yield: {item.yield_factor}x</span>
                           )}
                        </h4>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                            LOGISTIK: {(() => {
                                let wSmall = item.quantity_small;
                                let wLarge = item.quantity_large;
                                if (item.unit !== 'gram') {
                                    const c = item.conversions.find(conv => conv.unit_name === item.unit);
                                    if (c) { 
                                      wSmall *= c.weight_gram_standard; 
                                      wLarge *= c.weight_gram_standard; 
                                    }
                                }
                                const total = (wSmall * smallCountAgg) + (wLarge * (largeCountAgg + (bufferPortions * selectedSchools.length) + (samplingPortions * selectedSchools.length)));
                                return (total / 1000).toFixed(2);
                            })()} KG
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-2 bg-primary/5 p-3 rounded-2xl border border-primary/10">
                            <span className="text-[8px] font-black text-primary tracking-wider uppercase text-center">Porsi Kecil</span>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] font-bold text-slate-400">Target Matang</span>
                                    <input 
                                        className="w-14 bg-white border border-slate-200 text-center font-bold text-slate-700 text-xs py-1 rounded-md outline-none focus:border-primary" 
                                        type="number" 
                                        value={Math.round(item.quantity_small * (item.yield_factor || 1.0))}
                                        onChange={(e) => {
                                            const n = [...selectedItems];
                                            const val = parseFloat(e.target.value) || 0;
                                            n[idx].quantity_small = val / (item.yield_factor || 1.0);
                                            setSelectedItems(n);
                                        }}
                                    />
                                </div>
                                <span className="material-symbols-outlined text-[10px] text-primary">arrow_forward</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] font-black text-primary">Mentah (Belanja)</span>
                                    <input 
                                        className="w-14 bg-transparent border-none text-center font-black text-primary text-lg p-0 outline-none" 
                                        type="number" 
                                        value={Math.round(item.quantity_small)}
                                        onChange={(e) => {
                                            const n = [...selectedItems];
                                            n[idx].quantity_small = parseFloat(e.target.value) || 0;
                                            setSelectedItems(n);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 bg-rose-50 p-3 rounded-2xl border border-rose-100">
                            <span className="text-[8px] font-black text-rose-600 tracking-wider uppercase text-center">Porsi Besar</span>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] font-bold text-slate-400">Target Matang</span>
                                    <input 
                                        className="w-14 bg-white border border-slate-200 text-center font-bold text-slate-700 text-xs py-1 rounded-md outline-none focus:border-rose-400" 
                                        type="number" 
                                        value={Math.round(item.quantity_large * (item.yield_factor || 1.0))}
                                        onChange={(e) => {
                                            const n = [...selectedItems];
                                            const val = parseFloat(e.target.value) || 0;
                                            n[idx].quantity_large = val / (item.yield_factor || 1.0);
                                            setSelectedItems(n);
                                        }}
                                    />
                                </div>
                                <span className="material-symbols-outlined text-[10px] text-rose-600">arrow_forward</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] font-black text-rose-600">Mentah (Belanja)</span>
                                    <input 
                                        className="w-14 bg-transparent border-none text-center font-black text-rose-600 text-lg p-0 outline-none" 
                                        type="number" 
                                        value={Math.round(item.quantity_large)}
                                        onChange={(e) => {
                                            const n = [...selectedItems];
                                            n[idx].quantity_large = parseFloat(e.target.value) || 0;
                                            setSelectedItems(n);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <select 
                            className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-[10px] font-bold text-slate-500"
                            value={item.unit}
                            onChange={(e) => {
                                const n = [...selectedItems];
                                n[idx].unit = e.target.value;
                                setSelectedItems(n);
                            }}
                        >
                            <option value="gram">G</option>
                            {item.conversions?.map(c => <option key={c.id} value={c.unit_name}>{c.unit_name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    
                    <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-rose-500 transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
             ))}
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl space-y-8 sticky top-8 border border-white/5">
                <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Dual Analysis</h5>
                </div>

                <div className="space-y-8">
                    {/* Small Analysis */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Porsi Kecil</p>
                                <p className="text-3xl font-black font-headline tracking-tighter">{Math.round(totalsSmall.energy_kcal)} <span className="text-xs opacity-40">kkal</span></p>
                            </div>
                            <div className={cn("px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", getStatusColor('small'))}>
                                {calorieStatus('small')}
                            </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className={cn("h-full transition-all duration-700", getStatusColor('small'))} 
                                style={{ width: `${Math.min((totalsSmall.energy_kcal / (portionConfigs.find(p => p.name.includes("Kecil"))?.meal_energy || 500)) * 100, 100)}%` }}
                             />
                        </div>
                    </div>

                    {/* Large Analysis */}
                    <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Porsi Besar</p>
                                <p className="text-3xl font-black font-headline tracking-tighter">{Math.round(totalsLarge.energy_kcal)} <span className="text-xs opacity-40">kkal</span></p>
                            </div>
                            <div className={cn("px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", getStatusColor('large'))}>
                                {calorieStatus('large')}
                            </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className={cn("h-full transition-all duration-700", getStatusColor('large'))} 
                                style={{ width: `${Math.min((totalsLarge.energy_kcal / (portionConfigs.find(p => p.name.includes("Besar"))?.meal_energy || 700)) * 100, 100)}%` }}
                             />
                        </div>
                    </div>
                </div>

                {/* Macro Split Summary */}
                <div className="pt-8 border-t border-white/10 flex justify-center">
                    <div className="w-32 h-32 relative">
                        <Doughnut 
                            data={{
                                labels: ['Karbo', 'Pro', 'Lemak'],
                                datasets: [{
                                    data: [(totalsSmall.carbs_g + totalsLarge.carbs_g) * 4, (totalsSmall.protein_g + totalsLarge.protein_g) * 4, (totalsSmall.fat_g + totalsLarge.fat_g) * 9],
                                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                                    borderWidth: 0
                                }]
                            }} 
                            options={{ cutout: '80%', plugins: { legend: { display: false } } }} 
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[8px] font-black text-slate-500 uppercase">Avg Makro</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSaveDailyMenu}
                    disabled={isSaving || selectedItems.length === 0}
                    className="w-full bg-primary py-6 rounded-3xl font-black font-headline text-white shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 text-xs uppercase tracking-widest"
                >
                    {isSaving ? "Sinkronisasi..." : "Kirim ke Dapur"}
                </button>
            </div>
        </div>
      </div>

      <SaveTemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveAsTemplate}
        isSaving={isSavingTemplate}
        defaultGroup={selectedSchools[0]?.target_group || "SD"}
      />

      {isMasterMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsMasterMenuOpen(false)} />
              <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-slate-900">Master Menu Library</h3>
                      <button onClick={() => setIsMasterMenuOpen(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
                      {masterMenus.map(m => (
                          <button 
                            key={m.id} 
                            onClick={() => loadMasterMenu(m.id)}
                            className="w-full p-6 text-left border border-slate-100 rounded-3xl hover:bg-primary/5 hover:border-primary/20 transition-all flex justify-between items-center group"
                          >
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">{m.menu_name}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Target: {m.target_group}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">arrow_forward</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
