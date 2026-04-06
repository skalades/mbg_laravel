import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { Save, X, UserPlus, Edit2, Shield, User as UserIcon, Lock } from 'lucide-react';

interface Kitchen {
    id: number;
    kitchen_name: string;
}

interface User {
    id: number;
    username: string;
    full_name: string;
    title: string | null;
    role: 'ADMIN' | 'NUTRITIONIST';
    kitchen_id: number | null;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    kitchens: Kitchen[];
}

export default function UserFormModal({ isOpen, onClose, user, kitchens }: UserFormModalProps) {
    const isEditing = !!user;

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        username: '',
        full_name: '',
        title: '',
        password: '',
        role: 'NUTRITIONIST' as 'ADMIN' | 'NUTRITIONIST',
        kitchen_id: '' as string | number,
    });

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setData({
                    username: user.username,
                    full_name: user.full_name,
                    title: user.title || '',
                    password: '',
                    role: user.role,
                    kitchen_id: user.kitchen_id || '',
                });
            } else {
                reset();
                setData('role', 'NUTRITIONIST');
            }
            clearErrors();
        }
    }, [isOpen, user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            patch(route('users.update', user.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="bg-white p-10 space-y-8 relative">
                <div className="flex justify-between items-start border-b border-emerald-900/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            {isEditing ? <Edit2 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-950 font-headline uppercase tracking-tight">
                                {isEditing ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
                            </h2>
                            <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                                {isEditing ? 'Sesuaikan informasi akun dan penugasan' : 'Daftarkan personel baru ke dalam sistem'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <UserIcon className="w-3 h-3" /> Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                required
                            />
                            {errors.full_name && <p className="text-xs text-rose-600 mt-1">{errors.full_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                Gelar (Contoh: S.Gz)
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Gelar akademik"
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                            />
                            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                @ Username
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                required
                            />
                            {errors.username && <p className="text-xs text-rose-600 mt-1">{errors.username}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Shield className="w-3 h-3" /> Peran Sistem
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as any)}
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                required
                            >
                                <option value="NUTRITIONIST">Ahli Gizi (Dapur)</option>
                                <option value="ADMIN">Administrator (Semua-Akses)</option>
                            </select>
                            {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Lock className="w-3 h-3" /> {isEditing ? 'Ubah Password' : 'Password Kontrol'}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={isEditing ? 'Kosongkan jika tidak diubah' : 'Min. 8 karakter'}
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                required={!isEditing}
                            />
                            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    {data.role === 'NUTRITIONIST' && (
                        <div className="space-y-2 pt-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Penugasan Unit Kitchen</label>
                            <select
                                value={data.kitchen_id}
                                onChange={(e) => setData('kitchen_id', e.target.value)}
                                className="w-full bg-emerald-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-black focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm appearance-none"
                                required={data.role === 'NUTRITIONIST'}
                            >
                                <option value="">--- Pilih Unit Dapur ---</option>
                                {kitchens.map((kitchen) => (
                                    <option key={kitchen.id} value={kitchen.id}>
                                        {kitchen.kitchen_name}
                                    </option>
                                ))}
                            </select>
                            {errors.kitchen_id && <p className="text-xs text-rose-600 mt-1">{errors.kitchen_id}</p>}
                            <p className="text-[9px] text-emerald-800/40 italic font-medium px-2 mt-2">
                                * Akun ini hanya akan memiliki akses ke data di unit dapur yang dipilih.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-emerald-900/30"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Memproses...' : (isEditing ? 'Simpan Perubahan' : 'Buat Akun')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
