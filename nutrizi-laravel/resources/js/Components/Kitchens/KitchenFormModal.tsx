import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { Save, X, Settings2, Plus } from 'lucide-react';

interface Kitchen {
    id: number;
    kitchen_name: string;
    location_address: string | null;
    capacity: number | null;
    default_buffer_count: number;
    default_sample_count: number;
}

interface KitchenFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    kitchen: Kitchen | null;
}

export default function KitchenFormModal({ isOpen, onClose, kitchen }: KitchenFormModalProps) {
    const isEditing = !!kitchen;

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        kitchen_name: '',
        location_address: '',
        capacity: 0,
        default_buffer_count: 0,
        default_sample_count: 0,
    });

    useEffect(() => {
        if (isOpen) {
            if (kitchen) {
                setData({
                    kitchen_name: kitchen.kitchen_name || '',
                    location_address: kitchen.location_address || '',
                    capacity: kitchen.capacity || 0,
                    default_buffer_count: kitchen.default_buffer_count || 0,
                    default_sample_count: kitchen.default_sample_count || 0,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [isOpen, kitchen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            patch(route('kitchens.update', kitchen.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            post(route('kitchens.store'), {
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
                            {isEditing ? <Settings2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-950 font-headline uppercase tracking-tight">
                                {isEditing ? 'Pengaturan Kitchen' : 'Tambah Unit Baru'}
                            </h2>
                            <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                                {isEditing ? 'Kelola konfigurasi operasional unit produksi' : 'Daftarkan unit produksi dapur baru'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Nama Kitchen</label>
                            <input
                                type="text"
                                value={data.kitchen_name}
                                onChange={(e) => setData('kitchen_name', e.target.value)}
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                required
                            />
                            {errors.kitchen_name && <p className="text-xs text-rose-600 mt-1">{errors.kitchen_name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Alamat Kitchen</label>
                                <textarea
                                    value={data.location_address || ''}
                                    onChange={(e) => setData('location_address', e.target.value)}
                                    className="w-full bg-slate-50 border-emerald-900/5 rounded-[1.5rem] p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm min-h-[80px]"
                                />
                                {errors.location_address && <p className="text-xs text-rose-600 mt-1">{errors.location_address}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Kapasitas Harian (Porsi)</label>
                                <input
                                    type="number"
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                    required
                                />
                                {errors.capacity && <p className="text-xs text-rose-600 mt-1">{errors.capacity}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-900" />
                            <h3 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Default Porsi Tambahan (Se-Dapur)</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-50/30 p-6 rounded-[2rem] border border-orange-950/5 space-y-2">
                                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest text-center block">Default Buffer</label>
                                <input
                                    type="number"
                                    value={data.default_buffer_count}
                                    onChange={(e) => setData('default_buffer_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-3xl font-black text-orange-900 text-center focus:ring-0"
                                />
                                {errors.default_buffer_count && <p className="text-[9px] text-rose-600 text-center">{errors.default_buffer_count}</p>}
                            </div>
                            <div className="bg-rose-50/30 p-6 rounded-[2rem] border border-rose-950/5 space-y-2">
                                <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest text-center block">Default Sampling</label>
                                <input
                                    type="number"
                                    value={data.default_sample_count}
                                    onChange={(e) => setData('default_sample_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-3xl font-black text-rose-900 text-center focus:ring-0"
                                />
                                {errors.default_sample_count && <p className="text-[9px] text-rose-600 text-center">{errors.default_sample_count}</p>}
                            </div>
                        </div>
                        <p className="text-[9px] text-emerald-800/40 italic font-medium px-2">
                            * Nilai ini akan digunakan sebagai basis porsi tambahan untuk seluruh sekolah di bawah dapur ini, kecuali jika sekolah memiliki pengaturan spesifik.
                        </p>
                    </div>

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
                            {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Daftarkan')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
