"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, User, Box, Search, Edit, Trash2, ShieldCheck, Mail } from "lucide-react";
import api from "@/lib/axios";
import AddUserModal from "@/components/AddUserModal";

interface UserProfile {
  id: number;
  username: string;
  full_name: string | null;
  title: string | null;
  role: string;
  kitchen_id: number | null;
  kitchen_name: string | null;
}

interface Kitchen {
  id: number;
  kitchen_name: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Basic RBAC check
    const userJson = localStorage.getItem("user");
    const userRole = userJson ? JSON.parse(userJson).role : null;
    
    if (userRole !== 'ADMIN') {
      router.push("/");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, kitchenRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/kitchens")
      ]);
      setUsers(userRes.data);
      setKitchens(kitchenRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: UserProfile) => {
    if (user.role === 'ADMIN') {
        alert("Admin utama tidak dapat dihapus melalui panel ini.");
        return;
    }
    if (confirm(`Yakin ingin menghapus user "${user.username}"? Akses ke sistem akan langsung dicabut.`)) {
      try {
        await api.delete(`/admin/users/${user.id}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Gagal menghapus user");
      }
    }
  };

  return (
    <div className="space-y-8">
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }} 
        onSuccess={fetchData} 
        user={editingUser}
        kitchens={kitchens}
      />

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-headline">Manajemen User & Ahli Gizi</h2>
          <p className="text-slate-500 mt-1">Kelola akun personil dan penugasan lokasi dapur.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Tambah User
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 flex items-center gap-4 bg-emerald-50/50 border-emerald-100/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-primary">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Akun</p>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4 bg-blue-50/50 border-blue-100/50">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Administrator</p>
            <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'ADMIN').length}</p>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4 bg-amber-50/50 border-amber-100/50">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-warning">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ahli Gizi Aktif</p>
            <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'NUTRITIONIST').length}</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="premium-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Username</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Penugasan Dapur</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-6 py-8 h-16 bg-slate-50/50"></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  Belum ada data user. Silakan tambah user baru.
                </td>
              </tr>
            ) : (
              users.map((userProfile) => (
                <tr key={userProfile.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${userProfile.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-primary/20 text-primary'}`}>
                            {userProfile.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{userProfile.full_name || userProfile.username}</p>
                          {userProfile.full_name && (
                            <p className="text-[10px] text-slate-400 mt-1 italic">@{userProfile.username} {userProfile.title && `• ${userProfile.title}`}</p>
                          )}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${userProfile.role === 'ADMIN' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-primary'}`}>
                      {userProfile.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Box className="w-4 h-4 text-slate-400" />
                      <span className={`text-sm font-medium ${!userProfile.kitchen_name ? 'text-slate-300 italic' : 'text-slate-600'}`}>
                        {userProfile.kitchen_name || "Tidak ada penugasan"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => {
                                setEditingUser(userProfile);
                                setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                            onClick={() => handleDelete(userProfile)}
                            className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
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
  );
}
