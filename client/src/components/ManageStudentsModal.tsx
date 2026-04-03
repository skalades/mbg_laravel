"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import api from "@/lib/axios";

interface Student {
  id: number;
  student_name: string;
  allergy_notes: string;
}

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: number | null;
  schoolName: string;
}

export default function ManageStudentsModal({ isOpen, onClose, schoolId, schoolName }: ManageStudentsModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({ student_name: "", allergy_notes: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && schoolId) {
      fetchStudents();
    }
  }, [isOpen, schoolId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/schools/${schoolId}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setIsSaving(true);
    try {
      await api.post(`/schools/${schoolId}/students`, newStudent);
      setNewStudent({ student_name: "", allergy_notes: "" });
      setIsAdding(false);
      fetchStudents();
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Gagal menambah data siswa.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!window.confirm("Hapus data siswa ini?")) return;
    try {
      await api.delete(`/schools/${schoolId}/students/${studentId}`);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Manajemen Siswa</h3>
            <p className="text-sm text-slate-500 font-medium">Sekolah: <span className="text-primary font-bold">{schoolName}</span></p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-white hover:shadow-md flex items-center justify-center text-slate-400 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Add Student Form Toggle */}
          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-500 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Tambah Siswa / Profil Alergi
            </button>
          ) : (
            <form onSubmit={handleAddStudent} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    required
                    autoFocus
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                    placeholder="Contoh: Ahmad Subagja"
                    value={newStudent.student_name}
                    onChange={(e) => setNewStudent({...newStudent, student_name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan Alergi (Pisahkan Koma)</label>
                  <input 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                    placeholder="Misal: Telur, Kacang, Udang"
                    value={newStudent.allergy_notes}
                    onChange={(e) => setNewStudent({...newStudent, allergy_notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary transition-all shadow-lg shadow-slate-900/10 text-sm"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Simpan Siswa
                </button>
              </div>
            </form>
          )}

          {/* Students List */}
          <div className="space-y-3">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Daftar Siswa & Alergi</h4>
             
             {loading ? (
                <div className="flex flex-col items-center py-10 text-slate-300">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="mt-4 font-bold text-sm">Memuat data...</p>
                </div>
             ) : students.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium text-sm">Belum ada data siswa untuk sekolah ini.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 gap-3">
                    {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    {student.student_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm leading-tight">{student.student_name}</p>
                                    {student.allergy_notes ? (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <ShieldAlert className="w-3 h-3 text-rose-500" />
                                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Alergi: {student.allergy_notes}</p>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">Aman / Tidak Ada Alergi</p>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteStudent(student.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
             )}
          </div>
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Sistem Otomatis: Data alergi siswa akan disinkronkan langsung ke Meal Planner untuk memunculkan Safety Filter Peringatan Dini.
            </p>
        </div>
      </div>
    </div>
  );
}
