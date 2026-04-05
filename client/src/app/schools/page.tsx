"use client";

import React, { useEffect, useState } from "react";
import { Plus, School as SchoolIcon, MapPin, Users, Target, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import AddSchoolModal from "@/components/AddSchoolModal";
import ManageStudentsModal from "@/components/ManageStudentsModal";


interface School {
  id: number;
  school_name: string;
  target_group: string;
  total_beneficiaries: number;
  total_teachers: number;
  large_portion_count: number;
  small_portion_count: number;
  location_address: string;
  siswa_laki_laki?: number;
  siswa_perempuan?: number;
  guru_laki_laki?: number;
  guru_perempuan?: number;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<{id: number, name: string} | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);


  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get("/schools");
      setSchools(response.data);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AddSchoolModal 
        isOpen={isModalOpen} 
        onClose={() => {
            setIsModalOpen(false);
            setEditingSchool(null);
        }} 
        onSuccess={fetchSchools} 
        school={editingSchool}
      />

      <ManageStudentsModal 
        isOpen={isManageStudentsOpen}
        onClose={() => setIsManageStudentsOpen(false)}
        schoolId={selectedSchool?.id || null}
        schoolName={selectedSchool?.name || ""}
      />

      {/* Header */}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen Sekolah</h2>
          <p className="text-slate-500 mt-1">Kelola data institusi dan target gizi harian siswa.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah Sekolah
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-primary">
            <SchoolIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Sekolah</p>
            <p className="text-2xl font-bold text-slate-900">{schools.length}</p>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Penerima Manfaat</p>
            <p className="text-2xl font-bold text-slate-900">
              {schools.reduce((acc, s) => acc + s.total_beneficiaries, 0).toLocaleString()} Siswa
            </p>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-warning">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rata-rata Target Kalori</p>
            <p className="text-2xl font-bold text-slate-900">~ 500 kkal</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama sekolah atau lokasi..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="premium-card"> {/* Removed overflow-hidden to prevent clipping dropdowns */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Sekolah</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Kelompok Sasar</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Pembagian Porsi</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Lokasi</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8 h-16 bg-slate-50/50"></td>
                </tr>
              ))
            ) : schools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Belum ada data sekolah. Silakan tambah sekolah baru.
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900">{school.school_name}</p>
                    <p className="text-xs text-slate-500">ID: SCH-{school.id.toString().padStart(3, '0')}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-primary text-[10px] font-bold border border-emerald-100">
                      {school.target_group}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black">{school.small_portion_count}K</span>
                            <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-600 text-[10px] font-black">{school.large_portion_count}B</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">Total: {school.small_portion_count + school.large_portion_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{school.location_address || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => {
                                setSelectedSchool({ id: school.id, name: school.school_name });
                                setIsManageStudentsOpen(true);
                            }}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary transition-all flex items-center gap-2"
                        >
                            <Users className="w-3.5 h-3.5" />
                            Kelola Siswa
                        </button>
                        <div className={`relative ${activeMenuId === school.id ? 'z-50' : ''}`}>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === school.id ? null : school.id);
                                }}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {activeMenuId === school.id && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40 bg-transparent" 
                                        onClick={() => setActiveMenuId(null)}
                                    ></div>
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingSchool(school);
                                                setIsModalOpen(true);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Edit className="w-4 h-4 text-blue-500" />
                                            Edit Sekolah
                                        </button>
                                        <button 
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (confirm(`Yakin ingin menghapus ${school.school_name}? Semua data siswa di sekolah ini juga akan terhapus.`)) {
                                                    try {
                                                        await api.delete(`/schools/${school.id}`);
                                                        fetchSchools();
                                                    } catch (err) {
                                                        console.error("Failed to delete school:", err);
                                                        alert("Gagal menghapus sekolah");
                                                    }
                                                }
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Hapus Sekolah
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
