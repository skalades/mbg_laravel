"use client";

import React, { useEffect, useState } from "react";
import { X, Save, User as UserIcon, Lock, Box, Shield } from "lucide-react";
import api from "@/lib/axios";

interface User {
  id?: number;
  username: string;
  full_name: string | null;
  title: string | null;
  role: string;
  kitchen_id: number | null;
  password?: string;
}

interface Kitchen {
  id: number;
  kitchen_name: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
  kitchens: Kitchen[];
}

export default function AddUserModal({ isOpen, onClose, onSuccess, user, kitchens }: AddUserModalProps) {
  const [formData, setFormData] = useState<User>({
    username: "",
    full_name: "",
    title: "",
    role: "NUTRITIONIST",
    kitchen_id: null,
    password: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        full_name: user.full_name || "",
        title: user.title || "",
        role: user.role,
        kitchen_id: user.kitchen_id,
        password: "" // Don't edit password here for now
      });
    } else {
      setFormData({
        username: "",
        full_name: "",
        title: "",
        role: "NUTRITIONIST",
        kitchen_id: null,
        password: "nutrizi123" // Default password
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user?.id) {
        await api.put(`/admin/users/${user.id}`, formData);
      } else {
        await api.post("/admin/users", formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Gagal menyimpan data user");
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
            <h3 className="text-xl font-bold text-slate-900">{user ? "Edit User" : "Tambah Ahli Gizi Baru"}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola akses personil ke dapur</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" />
              Username
            </label>
            <input
              type="text"
              required
              disabled={!!user}
              placeholder="Contoh: rina_nutrizi"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          {/* Full Name & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Rina Sari"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                value={formData.full_name || ""}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Gelar / Title</label>
              <input
                type="text"
                placeholder="S.Gz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          {/* Password (only for new users) */}
          {!user && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password (Default)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-[10px] text-slate-400 italic">* Biarkan default atau ganti dengan password yang aman.</p>
            </div>
          )}

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Role Akses
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none bg-white"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="NUTRITIONIST">AHLI GIZI</option>
              <option value="ADMIN">ADMINISTRATOR</option>
            </select>
          </div>

          {/* Kitchen Assignment */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Box className="w-4 h-4 text-primary" />
              Penugasan Dapur
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none bg-white"
              value={formData.kitchen_id || ""}
              onChange={(e) => setFormData({ ...formData, kitchen_id: e.target.value ? parseInt(e.target.value) : null })}
            >
              <option value="">-- Pilih Dapur (Jika Ahli Gizi) --</option>
              {kitchens.map((k) => (
                <option key={k.id} value={k.id}>{k.kitchen_name}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 italic">* Ahli gizi hanya dapat melihat data sekolah di dapur yang ditugaskan.</p>
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
              {loading ? "Menyimpan..." : "Simpan User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
