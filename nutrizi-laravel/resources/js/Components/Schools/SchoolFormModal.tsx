import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo } from 'react';
import Modal from '@/Components/Modal';
import { cn } from '@/lib/utils';
import { School } from '@/types/school';
import PremiumSelector from '@/Components/PremiumSelector';
import { School as SchoolIcon, Users, Save, X, Edit, MapPin, CheckCircle2 } from 'lucide-react';

interface SchoolFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingSchool: School | null;
}

export default function SchoolFormModal({ isOpen, onClose, editingSchool }: SchoolFormModalProps) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        school_name: '',
        target_group: '',
        location_address: '',
        siswa_laki_laki: 0,
        siswa_perempuan: 0,
        guru_laki_laki: 0,
        guru_perempuan: 0,
        large_portion_count: 0,
        small_portion_count: 0,
        buffer_count: 0,
        sample_count: 0,
    });

    useEffect(() => {
        if (editingSchool) {
            setData({
                school_name: editingSchool.school_name || '',
                target_group: editingSchool.target_group || '',
                location_address: editingSchool.location_address || '',
                siswa_laki_laki: editingSchool.siswa_laki_laki || 0,
                siswa_perempuan: editingSchool.siswa_perempuan || 0,
                guru_laki_laki: editingSchool.guru_laki_laki || 0,
                guru_perempuan: editingSchool.guru_perempuan || 0,
                large_portion_count: editingSchool.large_portion_count || 0,
                small_portion_count: editingSchool.small_portion_count || 0,
                buffer_count: editingSchool.buffer_count || 0,
                sample_count: editingSchool.sample_count || 0,
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

    const targetGroupOptions = [
        { id: 'PAUD', label: 'PAUD / TK' },
        { id: 'SD', label: 'SD (Sekolah Dasar)' },
        { id: 'SMP', label: 'SMP (Menengah Pertama)' },
        { id: 'SMA', label: 'SMA / SMK (Menengah Atas)' },
    ];

    const totalSiswa = (data.siswa_laki_laki || 0) + (data.siswa_perempuan || 0);
    const totalGuru = (data.guru_laki_laki || 0) + (data.guru_perempuan || 0);
    const totalPorsi = (data.large_portion_count || 0) + (data.small_portion_count || 0);
    const censusReferensi = totalSiswa + totalGuru;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white p-10 space-y-8 max-h-[95vh] overflow-y-auto custom-scrollbar relative">
                {/* Header Section */}
                <div className="flex justify-between items-start border-b border-emerald-900/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                            <SchoolIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-950 font-headline uppercase tracking-tight">
                                {editingSchool ? 'Perbarui Data Sekolah' : 'Tambah Sekolah Baru'}
                            </h2>
                            <p className="text-emerald-800/40 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                                {editingSchool ? `Unit ID: SC-00${editingSchool.id}` : 'Registrasi unit sekolah mitra baru'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">Nama Sekolah / Institusi</label>
                            <input
                                type="text"
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                                className="w-full bg-slate-50 border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                                placeholder="Contoh: SD Negeri 01 Jakarta"
                                required
                            />
                            {errors.school_name && <p className="text-rose-500 text-[10px] font-black uppercase mt-1 ml-1">{errors.school_name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <PremiumSelector 
                                label="Kelompok Sasar (Tingkat)"
                                placeholder="Pilih Tingkat Pendidikan..."
                                options={targetGroupOptions}
                                value={data.target_group}
                                onChange={(val) => setData('target_group', val.toString())}
                                error={errors.target_group}
                            />
                        </div>
                    </div>

                    {/* Portion Management */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-900" />
                            <h3 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Konfigurasi Porsi (Sasaran Gizi)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-50/30 p-6 rounded-[2.5rem] border border-emerald-950/5 space-y-2 group transition-all hover:bg-emerald-50/50">
                                <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-center block">Porsi Kecil</label>
                                <input
                                    type="number"
                                    value={data.small_portion_count}
                                    onChange={(e) => setData('small_portion_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-4xl font-black text-emerald-900 text-center focus:ring-0"
                                />
                            </div>
                            <div className="bg-indigo-50/30 p-6 rounded-[2.5rem] border border-indigo-950/5 space-y-2 group transition-all hover:bg-indigo-50/50">
                                <label className="text-[9px] font-black text-indigo-600 uppercase tracking-widest text-center block">Porsi Besar</label>
                                <input
                                    type="number"
                                    value={data.large_portion_count}
                                    onChange={(e) => setData('large_portion_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-4xl font-black text-indigo-900 text-center focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* New: Buffer & Sample Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-50/30 p-6 rounded-[2.5rem] border border-orange-950/5 space-y-2 group transition-all hover:bg-orange-50/50">
                                <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest text-center block">Porsi Buffer</label>
                                <input
                                    type="number"
                                    value={data.buffer_count}
                                    onChange={(e) => setData('buffer_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-4xl font-black text-orange-900 text-center focus:ring-0"
                                />
                            </div>
                            <div className="bg-rose-50/30 p-6 rounded-[2.5rem] border border-rose-950/5 space-y-2 group transition-all hover:bg-rose-50/50">
                                <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest text-center block">Porsi Sampling</label>
                                <input
                                    type="number"
                                    value={data.sample_count}
                                    onChange={(e) => setData('sample_count', parseInt(e.target.value) || 0)}
                                    className="w-full bg-transparent border-none p-0 text-4xl font-black text-rose-900 text-center focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gender Breakdown */}
                    <div className="bg-slate-50/50 rounded-[3rem] p-8 border border-emerald-900/5 space-y-6">
                        <div className="flex items-center gap-4 px-1">
                            <Users className="w-4 h-4 text-emerald-900/20" />
                            <h3 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Data Administrasi (Gender)</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Siswa Laki</label>
                                    <input
                                        type="number"
                                        value={data.siswa_laki_laki}
                                        onChange={(e) => setData('siswa_laki_laki', parseInt(e.target.value) || 0)}
                                        className="w-full bg-white border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-sm shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Guru Laki</label>
                                    <input
                                        type="number"
                                        value={data.guru_laki_laki}
                                        onChange={(e) => setData('guru_laki_laki', parseInt(e.target.value) || 0)}
                                        className="w-full bg-white border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Siswa Perempuan</label>
                                    <input
                                        type="number"
                                        value={data.siswa_perempuan}
                                        onChange={(e) => setData('siswa_perempuan', parseInt(e.target.value) || 0)}
                                        className="w-full bg-white border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-sm shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Guru Perempuan</label>
                                    <input
                                        type="number"
                                        value={data.guru_perempuan}
                                        onChange={(e) => setData('guru_perempuan', parseInt(e.target.value) || 0)}
                                        className="w-full bg-white border-emerald-900/5 rounded-2xl p-4 text-emerald-950 font-bold text-center focus:ring-2 focus:ring-emerald-500/10 text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-emerald-900/5">
                            <div>
                                <p className="text-[8px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">Agregat Siswa</p>
                                <p className="text-xl font-black text-emerald-900">{totalSiswa} <span className="text-[10px] text-emerald-900/40 uppercase">Total</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">Agregat Guru</p>
                                <p className="text-xl font-black text-emerald-900">{totalGuru} <span className="text-[10px] text-emerald-900/40 uppercase">Total</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-emerald-950 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-950/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-[50px] group-hover:bg-emerald-500/20 transition-all" />
                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <h4 className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Total Porsi Produksi
                                </h4>
                                <p className="text-4xl font-black text-white">{totalPorsi} <span className="text-xs font-bold text-white/30 uppercase tracking-widest">UNIT</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-emerald-400/40 uppercase tracking-widest mb-1">Census Referensi</p>
                                <p className="text-lg font-black text-white">{censusReferensi} <span className="text-[8px] font-black text-white/30 uppercase">Individu</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Location Area */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-1">
                            <MapPin className="w-3 h-3" />
                            Lokasi / Alamat Sekolah
                        </label>
                        <textarea
                            value={data.location_address || ''}
                            onChange={(e) => setData('location_address', e.target.value)}
                            className="w-full bg-slate-50 border-emerald-900/5 rounded-[2rem] p-6 text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm min-h-[120px] shadow-sm"
                            placeholder="Alamat lengkap operasional sekolah..."
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-900 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-emerald-900/30"
                        >
                            {editingSchool ? <Edit className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {processing ? 'Memproses...' : (editingSchool ? 'Perbarui Data' : 'Daftarkan')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
