"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Box, MapPin, Search, Edit, Trash2, Home } from "lucide-react";
import api from "@/lib/axios";
import AddKitchenModal from "@/components/AddKitchenModal";

interface Kitchen {
  id: number;
  kitchen_name: string;
  address: string;
  created_at: string;
}

export default function KitchensPage() {
  const router = useRouter();
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);

  useEffect(() => {
    // Basic RBAC check
    const userJson = localStorage.getItem("user");
    const userRole = userJson ? JSON.parse(userJson).role : null;
    
    if (userRole !== 'ADMIN') {
      router.push("/");
      return;
    }

    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    try {
      const response = await api.get("/kitchens");
      setKitchens(response.data);
    } catch (error) {
      console.error("Failed to fetch kitchens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Yakin ingin menghapus dapur "${name}"? Data login personil dan sekolah yang terikat mungkin akan terdampak.`)) {
      try {
        await api.delete(`/kitchens/${id}`);
        fetchKitchens();
      } catch (err) {
        console.error("Failed to delete kitchen:", err);
        alert("Gagal menghapus dapur");
      }
    }
  };

  return (
    <div className="space-y-8">
      <AddKitchenModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingKitchen(null);
        }} 
        onSuccess={fetchKitchens} 
        kitchen={editingKitchen}
      />

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-headline">Manajemen Dapur (Kitchens)</h2>
          <p className="text-slate-500 mt-1">Kelola unit produksi dan pusat operasional MBG.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah Dapur
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card p-6 flex items-center gap-4 bg-emerald-50/50 border-emerald-100/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-primary">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Dapur Aktif</p>
            <p className="text-2xl font-bold text-slate-900">{kitchens.length} Unit</p>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4 bg-blue-50/50 border-blue-100/50">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Unit Produksi Central</p>
            <p className="text-2xl font-bold text-slate-900">Mandiri & Terpusat</p>
          </div>
        </div>
      </div>

      {/* Data List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="premium-card h-48 animate-pulse bg-slate-50"></div>
          ))
        ) : kitchens.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 premium-card">
            Belum ada data dapur. Klik tombol di atas untuk menambah.
          </div>
        ) : (
          kitchens.map((k) => (
            <div key={k.id} className="premium-card p-6 group hover:border-primary/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Box className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                        setEditingKitchen(k);
                        setIsModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(k.id, k.kitchen_name)}
                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 mb-2">{k.kitchen_name}</h4>
              <div className="flex items-start gap-2 text-slate-500 text-sm mb-4 min-h-[40px]">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{k.address || "Alamat belum ditentukan"}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Dapur ID: {k.id.toString().padStart(3, '0')}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">AKTIF</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
