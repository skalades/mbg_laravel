"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface MasterMenu {
  id: number;
  menu_name: string;
  target_group: string;
  is_approved: boolean;
  created_at: string;
}

interface MasterMenuItem {
  id: number;
  food_item_id: number;
  food_name?: string; // Optional if joined, but usually we just show portion_name
  portion_name: string;
  raw_weight_gram: number;
  unit_name: string;
  unit_quantity: number;
}


export default function MasterMenusPage() {
  const [menus, setMenus] = useState<MasterMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMenu, setNewMenu] = useState({ menu_name: "", target_group: "SD" });
  const [isSaving, setIsSaving] = useState(false);

  // Detail Modal State
  const [selectedMenu, setSelectedMenu] = useState<(MasterMenu & { items: MasterMenuItem[] }) | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);



  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get("/menus/master");
      setMenus(res.data);
    } catch (err) {
      console.error("Error fetching master menus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // For simplicity in this modal, we create a template with an empty items list initially, 
      // or we could redirect to a builder. For now, let's just create the shell.
      await api.post("/menus/master", { ...newMenu, items: [] });
      setIsModalOpen(false);
      setNewMenu({ menu_name: "", target_group: "SD" });
      fetchMenus();
    } catch (err) {
      console.error("Error creating menu:", err);
      alert("Gagal membuat templat.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    setIsDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const res = await api.get(`/menus/master/${id}`);
      setSelectedMenu(res.data);
    } catch (err) {
      console.error("Error fetching menu details:", err);
      alert("Gagal mengambil detail menu.");
      setIsDetailModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent card clicks
    
    if (!window.confirm("Apakah Anda yakin ingin menghapus templat menu ini?")) return;
    
    console.log("Menghapus templat menu ID:", id);
    try {
      const res = await api.delete(`/menus/master/${id}`);
      console.log("Delete success:", res.data);
      
      // Update local state for immediate feedback
      setMenus(prev => prev.filter(m => m.id !== id));
      
      alert("Templat menu berhasil dihapus.");
      // fetchMenus(); // Optional refresh to be sure
    } catch (err: any) {
      console.error("Gagal menghapus menu:", err.response?.data || err.message);
      alert("Gagal menghapus menu: " + (err.response?.data?.message || err.message));
    }
  };



  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary font-headline">Master Menu Library</h2>
          <p className="text-on-surface-variant mt-1 italic tracking-wide">Koleksi templat menu nutrisi yang telah terverifikasi oleh Senior Ahli Gizi.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white border border-primary/20 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Buat Templat Baru
        </button>
      </div>


      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-surface-container-low rounded-3xl animate-pulse border border-black/5" />
          ))}
        </div>
      ) : menus.length === 0 ? (
        <div className="py-32 text-center bg-surface-container-lowest border border-dashed border-outline-variant/30 rounded-[3rem] space-y-4">
           <div className="w-24 h-24 bg-surface-container flex items-center justify-center rounded-full mx-auto text-outline/30">
              <span className="material-symbols-outlined text-5xl">auto_stories</span>
           </div>
           <div>
            <h3 className="text-xl font-bold text-on-surface">Pustaka Kosong</h3>
            <p className="text-on-surface-variant max-w-xs mx-auto mt-2">Belum ada paket menu tersimpan. Mulai buat templat untuk mempercepat kerja harian Anda.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="group relative bg-surface-container-lowest border border-black/5 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-6 right-6">
                {menu.is_approved ? (
                  <span className="flex items-center gap-1.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verified
                  </span>
                ) : (
                   <span className="bg-surface-container text-outline text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-black/5">
                    Pending Review
                  </span>
                )}
              </div>
              
              <div className="mb-8">
                <div className="w-14 h-14 bg-primary-fixed-dim rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">restaurant</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface font-headline leading-tight group-hover:text-primary transition-colors">{menu.menu_name}</h3>
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mt-2 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">school</span>
                   Target: {menu.target_group}
                </p>
              </div>

              <div className="pt-6 border-t border-black/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-[10px] text-outline font-medium">
                    {new Date(menu.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, menu.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-outline/30 hover:bg-error-container hover:text-on-error-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <button 
                  onClick={() => handleViewDetail(menu.id)}
                  className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lihat Detail
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-emerald-900 text-white rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
         <div className="w-20 h-20 bg-emerald-800 rounded-3xl flex items-center justify-center shrink-0 shadow-inner border border-white/10">
            <span className="material-symbols-outlined text-4xl text-emerald-200">lightbulb</span>
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold font-headline mb-2">Automatisasi Logistics & Caching</h4>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-2xl">
              Gunakan Master Menu untuk menyusun rencana makan mingguan secara instan. Sistem akan otomatis menghitung 
              kebutuhan bahan baku mentah (Logistic Calculation) berdasarkan jumlah siswa di tiap sekolah target.
            </p>
         </div>
         <button className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all shrink-0">
           Pelajari Caranya
         </button>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        /* ... existing create modal code ... */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Buat Templat Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Paket Menu</label>
                <input 
                  autoFocus
                  required
                  type="text"
                  placeholder="Contoh: Paket Ayam Bakar Sehat"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                  value={newMenu.menu_name}
                  onChange={(e) => setNewMenu({...newMenu, menu_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Kelompok Sasar</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold"
                  value={newMenu.target_group}
                  onChange={(e) => setNewMenu({...newMenu, target_group: e.target.value})}
                >
                  <option value="PAUD">PAUD (Anak Usia Dini)</option>
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? "MENYIMPAN..." : "BUAT TEMPLAT"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden animate-in zoom-in-95 duration-300">
            {isDetailLoading ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <span className="material-symbols-outlined text-5xl animate-spin text-primary">circle_loader</span>
                <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Memuat Detail...</p>
              </div>
            ) : selectedMenu && (
              <>
                <div className="p-10 border-b border-slate-50 flex justify-between items-start">
                  <div>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                      {selectedMenu.target_group} Group
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 font-headline leading-none">{selectedMenu.menu_name}</h3>
                    <p className="text-slate-400 text-sm mt-3 flex items-center gap-2 italic">
                       <span className="material-symbols-outlined text-sm">calendar_today</span>
                       Terdaftar sejak {new Date(selectedMenu.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button onClick={() => setIsDetailModalOpen(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <div className="p-10 max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Daftar Komposisi Bahan</h4>
                  </div>
                  
                  {selectedMenu.items.length === 0 ? (
                    <div className="p-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 text-sm font-medium">Belum ada bahan baku yang terdaftar di templat ini.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {selectedMenu.items.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100 shadow-sm">
                               <span className="material-symbols-outlined text-xl">lunch_dining</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{item.portion_name}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                {item.unit_quantity} {item.unit_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-slate-900 leading-none">{item.raw_weight_gram}g</p>
                            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mt-1.5">Berat Mentah</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-10 bg-slate-50 flex justify-end gap-4">
                    <button 
                      onClick={() => setIsDetailModalOpen(false)}
                      className="px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      Tutup
                    </button>
                    <button 
                      className="bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.98]"
                      onClick={() => { alert("Fitur edit akan tersedia segera!"); }}
                    >
                      Edit Komposisi
                    </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>

  );
}
