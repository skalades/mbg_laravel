"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit3, Loader2, Salad, Info, Scale } from "lucide-react";
import api from "@/lib/axios";


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


export default function FoodItemsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSRTModalOpen, setIsSRTModalOpen] = useState(false);
  const [selectedFoodForSRT, setSelectedFoodForSRT] = useState<FoodItem | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newSRT, setNewSRT] = useState({ unit_name: "", weight_gram_standard: 0 });

  const [currentFood, setCurrentFood] = useState<any>({
    name: "",
    category: "Lauk Pauk",
    energy_kcal: 0,
    protein_g: 0,
    fat_g: 0,
    carbs_g: 0,
    yield_factor: 1.0,
    conversions: []
  });

  const addTempConversion = () => {
    setCurrentFood({
        ...currentFood,
        conversions: [...(currentFood.conversions || []), { unit_name: "", weight_gram_standard: 0 }]
    });
  };

  const updateTempConversion = (idx: number, field: string, val: any) => {
      const n = [...currentFood.conversions];
      n[idx][field] = val;
      setCurrentFood({...currentFood, conversions: n});
  };

  const removeTempConversion = (idx: number) => {
      const n = [...currentFood.conversions];
      n.splice(idx, 1);
      setCurrentFood({...currentFood, conversions: n});
  };


  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get("/planner/food");
      setFoods(res.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (currentFood.id) {
        await api.put(`/planner/food/${currentFood.id}`, currentFood);
      } else {
        await api.post("/planner/food", currentFood);
      }
      setIsModalOpen(false);
      setCurrentFood({ 
        name: "", 
        category: "Lauk Pauk", 
        energy_kcal: 0, 
        protein_g: 0, 
        fat_g: 0, 
        carbs_g: 0,
        yield_factor: 1.0,
        conversions: []
      });
      fetchFoods();
    } catch (err) {
      console.error("Error saving food:", err);
      alert("Gagal menyimpan data bahan makanan.");
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus bahan makanan ini secara permanen?")) return;
    try {
      await api.delete(`/planner/food/${id}`);
      fetchFoods();
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchConversions = async (foodId: number) => {
    try {
      const res = await api.get(`/planner/food/${foodId}/conversions`);
      setConversions(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddSRT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFoodForSRT) return;
    try {
      await api.post(`/planner/food/${selectedFoodForSRT.id}/conversions`, newSRT);
      setNewSRT({ unit_name: "", weight_gram_standard: 0 });
      fetchConversions(selectedFoodForSRT.id);
    } catch (err) { console.error(err); }
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-headline">Master Bahan Gizi</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Kelola pustaka nutrisi (TKPI) untuk akurasi Meal Planner.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentFood({ name: "", category: "Lauk Pauk", energy_kcal: 0, protein_g: 0, fat_g: 0, carbs_g: 0, yield_factor: 1.0, conversions: [] });
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah Bahan
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex gap-4 items-start">
        <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800 leading-relaxed font-medium">
            Data nutrisi dihitung berdasarkan nilai per **100 gram (BDD)**. Pastikan angka energi dan makronutrisi sesuai dengan tabel komposisi pangan Indonesia (TKPI) untuk menjaga kualitas standar makanan bergizi gratis.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari nama bahan makanan atau kategori..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bahan Makanan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kategori</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center text-primary">Energi</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pro (g)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fat (g)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Carb (g)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-8 py-6 h-16 bg-slate-50/30"></td>
                  </tr>
                ))
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredFoods.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <Salad className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-wider">
                        {f.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center font-black text-primary italic">
                      {f.energy_kcal} <span className="text-[8px] opacity-60">kkal</span>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-700">{f.protein_g}</td>
                    <td className="px-8 py-5 text-center font-bold text-slate-700">{f.fat_g}</td>
                    <td className="px-8 py-5 text-center font-bold text-slate-700">{f.carbs_g}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 outline-none">
                        <button 
                          onClick={() => {
                            setSelectedFoodForSRT(f);
                            fetchConversions(f.id);
                            setIsSRTModalOpen(true);
                          }}
                          className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 hover:text-primary transition-all flex items-center gap-1.5"
                          title="Kelola Satuan (SRT)"
                        >
                          <Scale className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">SRT</span>
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentFood(f);
                            setIsModalOpen(true);
                          }}

                          className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(f.id)}
                          className="p-2 hover:bg-rose-50 rounded-xl text-slate-300 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900 font-headline uppercase tracking-tight">
                {currentFood.id ? "Edit Bahan Gizi" : "Tambah Bahan Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full hover:bg-white hover:shadow-md flex items-center justify-center text-slate-400 transition-all">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Bahan Makanan</label>
                  <input 
                    required
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                    placeholder="Contoh: Nasi Putih"
                    value={currentFood.name}
                    onChange={e => setCurrentFood({...currentFood, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                    value={currentFood.category}
                    onChange={e => setCurrentFood({...currentFood, category: e.target.value})}
                  >
                    <option value="Makanan Pokok">Makanan Pokok</option>
                    <option value="Lauk Pauk">Lauk Pauk</option>
                    <option value="Sayuran">Sayuran</option>
                    <option value="Buah-buahan">Buah-buahan</option>
                    <option value="Susu/Tambahan">Susu/Tambahan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-primary">Energi (kkal / 100g)</label>
                  <input 
                    required
                    type="number" step="0.1"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-primary"
                    value={currentFood.energy_kcal}
                    onChange={e => setCurrentFood({...currentFood, energy_kcal: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protein (g)</label>
                  <input 
                    required
                    type="number" step="0.1"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                    value={currentFood.protein_g}
                    onChange={e => setCurrentFood({...currentFood, protein_g: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lemak (g)</label>
                  <input 
                    required
                    type="number" step="0.1"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                    value={currentFood.fat_g}
                    onChange={e => setCurrentFood({...currentFood, fat_g: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Karbohidrat (g)</label>
                  <input 
                    required
                    type="number" step="0.1"
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                    value={currentFood.carbs_g}
                    onChange={e => setCurrentFood({...currentFood, carbs_g: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Yield Factor (Penyusutan/Pemekaran)</label>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Beras = 2.5 | Daging Sapi = 0.6</span>
                  </div>
                  <input 
                    type="number" step="0.01"
                    className="w-full p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-emerald-700"
                    placeholder="Contoh: 1.0"
                    value={currentFood.yield_factor || 1.0}
                    onChange={e => setCurrentFood({...currentFood, yield_factor: parseFloat(e.target.value)})}
                  />
                  <p className="text-[10px] font-bold text-emerald-600/70 ml-1">Rasio matang dibagi mentah. Biarkan 1.0 jika tidak ada perubahan signifikan.</p>
                </div>
              </div>

              {/* Added SRT Integration into Modal */}
              <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logika Konversi SRT (Satuan Rumah Tangga)</label>
                    <button 
                        type="button"
                        onClick={addTempConversion}
                        className="text-[9px] font-black uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                        (+) Tambah Unit
                    </button>
                  </div>
                  
                  {currentFood.conversions?.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic font-medium px-1 bg-slate-50 py-3 rounded-xl border border-dashed border-slate-200 text-center">Belum ada satuan tambahan. Masukkan misal: "Centong" = 60g.</p>
                  )}

                  <div className="space-y-2">
                    {currentFood.conversions?.map((conv: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 animate-in slide-in-from-left-2 duration-300">
                             <div className="flex-1">
                                <input 
                                    placeholder="Nama Unit (Centong)"
                                    className="w-full bg-transparent border-none text-xs font-bold outline-none text-slate-900"
                                    value={conv.unit_name}
                                    onChange={(e) => updateTempConversion(idx, "unit_name", e.target.value)}
                                />
                             </div>
                             <div className="w-24 flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-100">
                                <input 
                                    type="number"
                                    placeholder="40"
                                    className="w-full bg-transparent border-none text-xs font-black text-primary p-0 outline-none"
                                    value={conv.weight_gram_standard || ""}
                                    onChange={(e) => updateTempConversion(idx, "weight_gram_standard", parseFloat(e.target.value))}
                                />
                                <span className="text-[9px] font-black opacity-30">G</span>
                             </div>
                             <button type="button" onClick={() => removeTempConversion(idx)} className="text-rose-300 hover:text-rose-500 transition-colors">
                                <Plus className="w-4 h-4 rotate-45" />
                             </button>
                        </div>
                    ))}
                  </div>
              </div>

              <div className="pt-4">

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Data Nutrisi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SRT Modal */}
      {isSRTModalOpen && selectedFoodForSRT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSRTModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-emerald-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Kelola SRT</h3>
                <p className="text-[10px] font-bold text-primary">{selectedFoodForSRT.name}</p>
              </div>
              <button onClick={() => setIsSRTModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Form Tambah */}
              <form onSubmit={handleAddSRT} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
                    <input 
                      required
                      placeholder="Centong/Gelas"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                      value={newSRT.unit_name}
                      onChange={e => setNewSRT({...newSRT, unit_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Berat (Gram)</label>
                    <input 
                      required
                      type="number"
                      placeholder="60"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                      value={newSRT.weight_gram_standard || ""}
                      onChange={e => setNewSRT({...newSRT, weight_gram_standard: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                  Tambah Satuan
                </button>
              </form>

              {/* List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Daftar Konversi</h4>
                {conversions.length === 0 ? (
                  <p className="text-center py-4 text-slate-300 text-[10px] font-bold uppercase italic">Belum ada satuan khusus</p>
                ) : (
                  <div className="grid gap-2">
                    {conversions.map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Scale className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-xs font-black text-slate-700">{c.unit_name}</span>
                        </div>
                        <span className="text-xs font-black text-primary italic">{c.weight_gram_standard} g</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-50 text-[8px] font-bold text-slate-400 uppercase text-center tracking-widest">
              Gunakan satuan ini di Meal Planner untuk kemudahan input porsi.
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
