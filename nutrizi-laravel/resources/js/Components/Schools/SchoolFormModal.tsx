import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { cn } from '@/lib/utils';
import { School } from '@/types/school';

interface SchoolFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingSchool: School | null;
}

export default function SchoolFormModal({ isOpen, onClose, editingSchool }: SchoolFormModalProps) {
    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        school_name: '',
        target_group: '',
        total_beneficiaries: 0,
        total_teachers: 0,
        large_portion_count: 0,
        small_portion_count: 0,
        location_address: '',
        siswa_laki_laki: 0,
        siswa_perempuan: 0,
        guru_laki_laki: 0,
        guru_perempuan: 0,
    });

    useEffect(() => {
        if (editingSchool) {
            setData({
                school_name: editingSchool.school_name || '',
                target_group: editingSchool.target_group || '',
                total_beneficiaries: editingSchool.total_beneficiaries || 0,
                total_teachers: editingSchool.total_teachers || 0,
                large_portion_count: editingSchool.large_portion_count || 0,
                small_portion_count: editingSchool.small_portion_count || 0,
                location_address: editingSchool.location_address || '',
                siswa_laki_laki: editingSchool.siswa_laki_laki || 0,
                siswa_perempuan: editingSchool.siswa_perempuan || 0,
                guru_laki_laki: editingSchool.guru_laki_laki || 0,
                guru_perempuan: editingSchool.guru_perempuan || 0,
            });
        } else {
            reset();
        }
    }, [editingSchool]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
        };

        if (editingSchool) {
            patch(`/schools/${editingSchool.id}`, options);
        } else {
            post('/schools', options);
        }
    };

    const totalSiswa = (data.siswa_laki_laki || 0) + (data.siswa_perempuan || 0);
    const totalGuru = (data.guru_laki_laki || 0) + (data.guru_perempuan || 0);
    const totalPorsi = (data.large_portion_count || 0) + (data.small_portion_count || 0);
    const censusReferensi = totalSiswa + totalGuru;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-transparent p-10 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative text-[#4a5568]">
                <form onSubmit={submit} className="space-y-6">
                    {/* Modal Title */}
                    <div className="border-b border-slate-100 pb-4">
                       <h2 className="text-2xl font-black text-emerald-900 font-headline tracking-tight uppercase">
                           {editingSchool ? 'Perbarui Data Sekolah' : 'Tambah Sekolah Baru'}
                       </h2>
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                           {editingSchool ? `ID Unit: SC-00${editingSchool.id}` : 'Lengkapi data unit sekolah mitra baru.'}
                       </p>
                    </div>

                    {/* Section 1: Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-1.5 px-1 font-headline">
                            <label className="text-[11px] font-bold text-slate-700 tracking-tight ml-1">Nama Sekolah</label>
                            <input
                                type="text"
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
                                placeholder="Contoh: SD Negeri 01 Jakarta"
                                required
                            />
                            {errors.school_name && <p className="text-red-500 text-[9px] font-bold mt-1 tracking-widest uppercase">{errors.school_name}</p>}
                        </div>

                        <div className="space-y-1.5 px-1 font-headline">
                            <label className="text-[11px] font-bold text-slate-700 tracking-tight ml-1">Kelompok Sasar</label>
                            <select
                                value={data.target_group || ''}
                                onChange={(e) => setData('target_group', e.target.value)}
                                className="w-full bg-white border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
                            >
                                <option value="">Pilih Kelompok...</option>
                                <option value="PAUD">PAUD / TK</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA / SMK</option>
                            </select>
                            {errors.target_group && <p className="text-red-500 text-[9px] font-bold mt-1 tracking-widest uppercase">{errors.target_group}</p>}
                        </div>
                    </div>

                    {/* Section 2: Portions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-emerald-700/80 uppercase tracking-widest ml-1">Penerima Porsi Kecil</label>
                            <div className={cn(
                                "flex items-center justify-center bg-emerald-50/30 border-2 rounded-3xl p-4 transition-all",
                                data.small_portion_count > 0 ? "border-emerald-500" : "border-emerald-100"
                            )}>
                                <input
                                    type="number"
                                    value={data.small_portion_count}
                                    onChange={(e) => setData('small_portion_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-3xl font-black text-emerald-900 text-center focus:ring-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-pink-700/80 uppercase tracking-widest ml-1">Penerima Porsi Besar</label>
                            <div className={cn(
                                "flex items-center justify-center bg-pink-50/30 border-2 rounded-3xl p-4 transition-all",
                                data.large_portion_count > 0 ? "border-pink-500" : "border-pink-100"
                            )}>
                                <input
                                    type="number"
                                    value={data.large_portion_count}
                                    onChange={(e) => setData('large_portion_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-3xl font-black text-pink-900 text-center focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Data Administrasi (Gender) */}
                    <div className="bg-slate-50/80 rounded-3xl p-6 space-y-6 border border-slate-100">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Data Administrasi (Gender)</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-1.5 px-1">
                                <label className="text-[10px] font-bold text-slate-600 ml-1">Siswa Laki-laki</label>
                                <input
                                    type="number"
                                    value={data.siswa_laki_laki}
                                    onChange={(e) => setData('siswa_laki_laki', parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border-slate-100 rounded-xl p-3 text-slate-900 font-bold focus:ring-emerald-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 px-1">
                                <label className="text-[10px] font-bold text-slate-600 ml-1">Siswa Perempuan</label>
                                <input
                                    type="number"
                                    value={data.siswa_perempuan}
                                    onChange={(e) => setData('siswa_perempuan', parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border-slate-100 rounded-xl p-3 text-slate-900 font-bold focus:ring-emerald-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 px-1">
                                <label className="text-[10px] font-bold text-slate-600 ml-1">Guru Laki-laki</label>
                                <input
                                    type="number"
                                    value={data.guru_laki_laki}
                                    onChange={(e) => setData('guru_laki_laki', parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border-slate-100 rounded-xl p-3 text-slate-900 font-bold focus:ring-emerald-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 px-1">
                                <label className="text-[10px] font-bold text-slate-600 ml-1">Guru Perempuan</label>
                                <input
                                    type="number"
                                    value={data.guru_perempuan}
                                    onChange={(e) => setData('guru_perempuan', parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border-slate-100 rounded-xl p-3 text-slate-900 font-bold focus:ring-emerald-500 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 pt-4 border-t border-slate-200/50">
                            <div className="px-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jumlah Siswa</p>
                                <p className="text-lg font-black text-slate-900">{totalSiswa} <span className="text-[10px] text-slate-400 font-bold">Total</span></p>
                            </div>
                            <div className="px-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jumlah Guru</p>
                                <p className="text-lg font-black text-slate-900">{totalGuru} <span className="text-[10px] text-slate-400 font-bold">Total</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Summary Box (Dark Navy) */}
                    <div className="bg-[#0f172a] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Porsi Produksi</p>
                                <p className="text-4xl font-black text-white">{totalPorsi} <span className="text-sm font-bold text-white/40">Porsi</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Census Referensi</p>
                                <p className="text-lg font-black text-white">{censusReferensi} <span className="text-[10px] font-bold text-white/40 italic">Siswa & Guru</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Address */}
                    <div className="space-y-1.5 px-1 font-headline pt-2">
                        <label className="text-[11px] font-bold text-slate-700 tracking-tight ml-1">Lokasi / Alamat</label>
                        <textarea
                            value={data.location_address || ''}
                            onChange={(e) => setData('location_address', e.target.value)}
                            className="w-full bg-white border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm min-h-[100px]"
                            placeholder="Alamat lengkap sekolah..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 rounded-3xl text-sm font-black text-slate-600 bg-white border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-950 text-white px-8 py-4 rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-lg shadow-emerald-950/20"
                        >
                            <span className="material-symbols-outlined text-lg">{editingSchool ? 'edit_square' : 'save'}</span>
                            {processing ? 'Memproses...' : (editingSchool ? 'Perbarui Data' : 'Simpan Sekolah')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
