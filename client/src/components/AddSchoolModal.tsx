"use client";

import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import api from "@/lib/axios";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  school?: any; // Optional school object for editing
}

export default function AddSchoolModal({ isOpen, onClose, onSuccess, school }: AddSchoolModalProps) {
  const [formData, setFormData] = useState({
    school_name: school?.school_name || "",
    target_group: school?.target_group || "SD",
    total_beneficiaries: school?.total_beneficiaries || 0,
    total_teachers: school?.total_teachers || 0,
    large_portion_count: school?.large_portion_count || 0,
    small_portion_count: school?.small_portion_count || 0,
    location_address: school?.location_address || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (school) {
      setFormData({
        school_name: school.school_name || "",
        target_group: school.target_group || "SD",
        total_beneficiaries: school.total_beneficiaries || 0,
        total_teachers: school.total_teachers || 0,
        large_portion_count: school.large_portion_count || 0,
        small_portion_count: school.small_portion_count || 0,
        location_address: school.location_address || ""
      });
    } else {
        setFormData({
            school_name: "",
            target_group: "SD",
            total_beneficiaries: 0,
            total_teachers: 0,
            large_portion_count: 0,
            small_portion_count: 0,
            location_address: ""
        });
    }
  }, [school, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (school) {
        await api.put(`/schools/${school.id}`, formData);
      } else {
        await api.post("/schools", formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${school ? 'update' : 'create'} school`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">{school ? "Edit Sekolah" : "Tambah Sekolah Baru"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 text-rose-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nama Sekolah</label>
            <input 
              required
              type="text" 
              placeholder="Contoh: SD Negeri 01 Jakarta"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={formData.school_name}
              onChange={(e) => setFormData({...formData, school_name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kelompok Sasar</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.target_group}
                onChange={(e) => setFormData({...formData, target_group: e.target.value})}
              >
                <option value="PAUD">PAUD</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jumlah Siswa</label>
              <input 
                required
                type="number" 
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.total_beneficiaries}
                onChange={(e) => setFormData({...formData, total_beneficiaries: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jumlah Guru</label>
              <input 
                required
                type="number" 
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all underline decoration-dashed decoration-slate-300"
                value={formData.total_teachers}
                onChange={(e) => setFormData({...formData, total_teachers: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary uppercase tracking-widest">Penerima Porsi Kecil</label>
              <input 
                required
                type="number" 
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-black text-primary"
                value={formData.small_portion_count}
                onChange={(e) => setFormData({...formData, small_portion_count: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Penerima Porsi Besar</label>
              <input 
                required
                type="number" 
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 bg-rose-50/50 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-black text-rose-600"
                value={formData.large_portion_count}
                onChange={(e) => setFormData({...formData, large_portion_count: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex justify-between items-center shadow-xl shadow-slate-900/10">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Total Porsi Produksi</span>
              <span className="text-2xl font-black font-headline">{(formData.small_portion_count || 0) + (formData.large_portion_count || 0)} <span className="text-xs opacity-40">Porsi</span></span>
            </div>
            <div className="text-right">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Census Referensi</span>
                <p className="text-sm font-bold opacity-60">{(formData.total_beneficiaries || 0) + (formData.total_teachers || 0)} Siswa & Guru</p>
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Lokasi / Alamat</label>
            <textarea 
              rows={2}
              placeholder="Alamat lengkap sekolah..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              value={formData.location_address}
              onChange={(e) => setFormData({...formData, location_address: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Menyimpan..." : (school ? "Simpan Perubahan" : "Simpan Sekolah")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
