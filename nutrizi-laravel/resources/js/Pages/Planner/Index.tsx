import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { FormEventHandler, useMemo, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import PremiumSelector from '@/Components/PremiumSelector';
import { Calendar, Check, Search, Send } from 'lucide-react';

interface School {
    id: number;
    school_name: string;
    target_group: string;
}

interface MasterMenu {
    id: number;
    menu_name: string;
}

interface DailyMenu {
    id: number;
    menu_date: string;
    school: {
        school_name: string;
    };
    master_menu: {
        menu_name: string;
    };
    status: string;
}

interface PlannerProps extends PageProps {
    schools: School[];
    masterMenus: MasterMenu[];
    dailyMenus: DailyMenu[];
}

export default function PlannerIndex({ schools, masterMenus, dailyMenus }: PlannerProps) {
    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
        school_ids: [] as number[],
        master_menu_id: '',
        menu_date: '',
        status: 'TERPUBLIKASI',
        buffer_portions: '' as string | number,
        organoleptic_portions: '' as string | number,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('ALL');

    const filteredSchools = useMemo(() => {
        return schools.filter(s => {
            const matchesSearch = s.school_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = filterLevel === 'ALL' || (s as any).target_group === filterLevel;
            return matchesSearch && matchesLevel;
        });
    }, [schools, searchTerm, filterLevel]);

    const toggleSchool = (id: number) => {
        const current = data.school_ids;
        if (current.includes(id)) {
            setData('school_ids', current.filter(sid => sid !== id));
        } else {
            setData('school_ids', [...current, id]);
        }
    };

    const schoolOptions = useMemo(() => schools.map(s => ({ id: s.id, label: s.school_name })), [schools]);
    const menuOptions = useMemo(() => masterMenus.map(m => ({ id: m.id, label: m.menu_name })), [masterMenus]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('planner.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus rencana menu ini?')) {
            destroy(route('planner.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header="Perencanaan Menu"
        >
            <Head title="Smart Planner" />

            <div className="space-y-12 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline uppercase italic">Smart Planner</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide text-xs">
                            Susun siklus menu dengan dukungan AI dan analisis gizi otomatis.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Schedule Form */}
                    <div className="lg:col-span-1">
                        <section className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/5 shadow-xl shadow-emerald-900/5 sticky top-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-900 mb-8 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500">add_task</span>
                                Jadwalkan Menu
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <InputLabel value="Pilih Sekolah" className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40" />
                                        <div className="flex gap-1">
                                            {['ALL', 'SD', 'SMP', 'SMA'].map(lvl => (
                                                <button
                                                    key={lvl}
                                                    type="button"
                                                    onClick={() => setFilterLevel(lvl)}
                                                    className={cn(
                                                        "px-2 py-1 rounded-md text-[8px] font-black transition-all",
                                                        filterLevel === lvl ? "bg-emerald-900 text-white" : "bg-emerald-50 text-emerald-900/40 hover:bg-emerald-100"
                                                    )}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/20 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="text"
                                            placeholder="Cari sekolah..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-emerald-900/5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="max-h-60 overflow-y-auto border border-emerald-900/5 rounded-2xl p-2 bg-slate-50/30 custom-scrollbar space-y-1">
                                        {filteredSchools.map(s => (
                                            <div 
                                                key={s.id}
                                                onClick={() => toggleSchool(s.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border",
                                                    data.school_ids.includes(s.id) 
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm" 
                                                        : "bg-white border-transparent hover:border-emerald-100 text-slate-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                                        data.school_ids.includes(s.id) ? "bg-emerald-600 border-emerald-600" : "border-emerald-200"
                                                    )}>
                                                        {data.school_ids.includes(s.id) && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-xs font-bold">{s.school_name}</span>
                                                </div>
                                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-900/5 text-emerald-900/40 uppercase">
                                                    {s.target_group}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between px-2">
                                        <button 
                                            type="button"
                                            onClick={() => setData('school_ids', Array.from(new Set([...data.school_ids, ...filteredSchools.map(s => s.id)])))}
                                            className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
                                        >
                                            Pilih Semua {filterLevel !== 'ALL' && filterLevel}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setData('school_ids', data.school_ids.filter(id => !filteredSchools.map(s => s.id).includes(id)))}
                                            className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                                        >
                                            Batal Semua
                                        </button>
                                    </div>
                                    <InputError message={errors.school_ids} />
                                </div>

                                <PremiumSelector 
                                    label="Pilih Resep"
                                    placeholder="Pilih Resep..."
                                    options={menuOptions}
                                    value={data.master_menu_id}
                                    onChange={val => setData('master_menu_id', val.toString())}
                                    error={errors.master_menu_id}
                                />

                                <div className="space-y-2 group">
                                    <InputLabel value="Tanggal Distribusi" className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Calendar className="h-4 w-4 text-emerald-900/20 group-focus-within:text-emerald-500 transition-colors" />
                                        </div>
                                        <input
                                            type="date"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-900/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-2xl text-sm font-bold text-emerald-950 transition-all custom-calendar-picker"
                                            value={data.menu_date}
                                            onChange={e => setData('menu_date', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.menu_date} />
                                </div>

                                {/* New: Manual Overrides for Buffer & Sampling */}
                                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-emerald-900/5 space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="w-1 h-1 rounded-full bg-emerald-900" />
                                        <h3 className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">Manual Override (Opsional)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-emerald-600 uppercase tracking-widest ml-1">Porsi Buffer</label>
                                            <input
                                                type="number"
                                                placeholder="Auto"
                                                value={data.buffer_portions}
                                                onChange={e => setData('buffer_portions', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500/10 placeholder:text-emerald-900/10 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-rose-600 uppercase tracking-widest ml-1">Porsi Sampling</label>
                                            <input
                                                type="number"
                                                placeholder="Auto"
                                                value={data.organoleptic_portions}
                                                onChange={e => setData('organoleptic_portions', e.target.value)}
                                                className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500/10 placeholder:text-emerald-900/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-emerald-800/40 italic px-1">
                                        * Kosongkan ("Auto") untuk menggunakan pengaturan default sekolah/dapur.
                                    </p>
                                </div>

                                <PrimaryButton 
                                    className="w-full py-4 bg-emerald-950 text-white rounded-2xl shadow-xl shadow-emerald-950/20 justify-center gap-3 mt-4 group hover:bg-emerald-900 transition-all active:scale-[0.98]" 
                                    disabled={processing || data.school_ids.length === 0}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">Terbitkan {data.school_ids.length} Jadwal</span>
                                    </div>
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </PrimaryButton>
                            </form>
                        </section>
                    </div>

                    {/* Schedule List */}
                    <div className="lg:col-span-2">
                        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden min-h-[500px]">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[120px]"></div>
                            
                            <h3 className="relative z-10 text-xl font-black font-headline mb-10">Agenda Distribusi</h3>

                            <div className="relative z-10 space-y-4">
                                {dailyMenus.length === 0 ? (
                                    <div className="py-20 text-center text-slate-600 italic text-[10px] font-black uppercase tracking-[0.3em] border border-dashed border-white/5 rounded-[2rem]">
                                        Belum ada jadwal distribusi terdaftar.
                                    </div>
                                ) : (
                                    dailyMenus.map(dm => (
                                        <div key={dm.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl text-center min-w-[80px]">
                                                    <div className="text-[10px] font-black uppercase">{new Date(dm.menu_date).toLocaleDateString('id-ID', { month: 'short' })}</div>
                                                    <div className="text-2xl font-black">{new Date(dm.menu_date).toLocaleDateString('id-ID', { day: 'numeric' })}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">{dm.school?.school_name}</div>
                                                    <div className="text-lg font-bold text-slate-100">{dm.master_menu?.menu_name}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <span className="inline-flex items-center gap-2 bg-slate-800 text-slate-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                    {dm.status}
                                                </span>
                                                <button 
                                                    onClick={() => handleDelete(dm.id)}
                                                    className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
