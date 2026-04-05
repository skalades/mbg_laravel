"use client";

import React, { useEffect, useState } from "react";
import { X, Save, Box, MapPin } from "lucide-react";
import api from "@/lib/axios";

interface Kitchen {
  id?: number;
  kitchen_name: string;
  address: string;
}

interface AddKitchenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kitchen?: Kitchen | null;
}

export default function AddKitchenModal({ isOpen, onClose, onSuccess, kitchen }: AddKitchenModalProps) {
  const [formData, setFormData] = useState<Kitchen>({
    kitchen_name: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (kitchen) {
      setFormData(kitchen);
    } else {
      setFormData({ kitchen_name: "", address: "" });
    }
  }, [kitchen, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (kitchen?.id) {
        await api.put(`/kitchens/${kitchen.id}`, formData);
      } else {
        await api.post("/kitchens", formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save kitchen:", error);
      alert("Gagal menyimpan data dapur");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{kitchen ? "Edit Dapur" : "Tambah Dapur Baru"}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola unit produksi makanan</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Box className="w-4 h-4 text-primary" />
              Nama Dapur
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Dapur Pusat Oemah Koneng"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              value={formData.kitchen_name}
              onChange={(e) => setFormData({ ...formData, kitchen_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Alamat Lengkap
            </label>
            <textarea
              required
              rows={3}
              placeholder="Masukkan alamat lengkap operasional dapur..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan Dapur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
