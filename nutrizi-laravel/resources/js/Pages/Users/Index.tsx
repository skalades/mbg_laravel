import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import UserFormModal from '@/Components/Users/UserFormModal';
import { UserPlus, Shield, User as UserIcon, Trash2, Edit2, MapPin } from 'lucide-react';

interface User {
    id: number;
    username: string;
    full_name: string;
    title: string | null;
    role: 'ADMIN' | 'NUTRITIONIST';
    kitchen_id: number | null;
    kitchen?: {
        id: number;
        kitchen_name: string;
    };
}

interface Kitchen {
    id: number;
    kitchen_name: string;
}

interface UsersProps extends PageProps {
    users: User[];
    kitchens: Kitchen[];
}

export default function UsersIndex({ users, kitchens, auth }: UsersProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const openCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (user: User) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.full_name}"?`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <span className="bg-emerald-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><Shield className="w-2 h-2" /> Admin</span>;
            case 'NUTRITIONIST':
                return <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">Ahli Gizi</span>;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header="Manajemen Pengguna"
        >
            <Head title="Kelola Pengguna" />

            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Daftar Pengguna</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            Kelola akun personel dan penugasan unit dapur.
                        </p>
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:translate-y-[-2px] transition-all flex items-center gap-3"
                    >
                        Tambah Pengguna
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {users.map((user) => (
                        <div key={user.id} className="bg-white rounded-[2.5rem] p-8 border border-emerald-900/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-900 group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500">
                                        <UserIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-950 font-headline truncate max-w-[150px]">
                                            {user.full_name}
                                            {user.title && <span className="text-xs font-normal text-emerald-800/40 ml-1">, {user.title}</span>}
                                        </h3>
                                        <p className="text-xs text-emerald-800/40 font-medium">@{user.username}</p>
                                    </div>
                                </div>
                                {getRoleBadge(user.role)}
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="bg-emerald-50/50 p-4 rounded-2xl flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-emerald-900/40" />
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-800/30 uppercase tracking-widest">Penugasan Kitchen</p>
                                        <p className="text-sm font-bold text-emerald-900">
                                            {user.role === 'ADMIN' ? 'Seluruh Unit Dapur' : (user.kitchen?.kitchen_name || 'Tidak Ditugaskan')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-emerald-50 flex justify-end gap-2">
                                <button 
                                    onClick={() => openEditModal(user)}
                                    className="p-3 text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                {user.id !== auth.user.id && (
                                    <button 
                                        onClick={() => handleDelete(user)}
                                        className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <UserFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={selectedUser} 
                kitchens={kitchens}
            />
        </AuthenticatedLayout>
    );
}
