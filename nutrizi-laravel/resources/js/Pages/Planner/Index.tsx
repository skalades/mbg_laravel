import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface School {
    id: number;
    school_name: string;
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
        school_id: '',
        master_menu_id: '',
        menu_date: '',
        status: 'TERPUBLIKASI'
    });

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
                                <div className="space-y-2">
                                    <InputLabel value="Pilih Sekolah" className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40" />
                                    <select
                                        className="w-full border-emerald-900/10 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm text-sm font-bold"
                                        value={data.school_id}
                                        onChange={e => setData('school_id', e.target.value)}
                                    >
                                        <option value="">-- Pilih Sekolah --</option>
                                        {schools.map(s => <option key={s.id} value={s.id}>{s.school_name}</option>)}
                                    </select>
                                    <InputError message={errors.school_id} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel value="Pilih Resep" className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40" />
                                    <select
                                        className="w-full border-emerald-900/10 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm text-sm font-bold"
                                        value={data.master_menu_id}
                                        onChange={e => setData('master_menu_id', e.target.value)}
                                    >
                                        <option value="">-- Pilih Resep --</option>
                                        {masterMenus.map(m => <option key={m.id} value={m.id}>{m.menu_name}</option>)}
                                    </select>
                                    <InputError message={errors.master_menu_id} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel value="Tanggal Distribusi" className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40" />
                                    <TextInput
                                        type="date"
                                        className="w-full border-emerald-900/10 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm"
                                        value={data.menu_date}
                                        onChange={e => setData('menu_date', e.target.value)}
                                    />
                                    <InputError message={errors.menu_date} />
                                </div>

                                <PrimaryButton className="w-full py-4 bg-emerald-900 rounded-2xl shadow-xl shadow-emerald-900/20 justify-center gap-2" disabled={processing}>
                                    Tambahkan ke Jadwal
                                    <span className="material-symbols-outlined text-sm">send</span>
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
