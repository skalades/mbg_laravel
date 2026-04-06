import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { 
    CheckCircle2, 
    Package, 
    Calendar, 
    Camera, 
    Star, 
    FileText, 
    ClipboardCheck, 
    CheckSquare,
    Save,
    AlertCircle,
    Download,
    Trophy
} from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

interface IngredientRequirement {
    name: string;
    category: string;
    unit: string;
    total_weight: number;
}

interface Instruction {
    menu_name: string;
    content: string;
}

interface AuditLog {
    id: number;
    photo_path: string | null;
    taste_score: number;
    appearance_score: number;
    aroma_score: number;
    texture_score: number;
    notes: string | null;
    audited_by: number;
    auditor?: {
        full_name: string;
        title: string | null;
    };
}

interface AuditProps extends PageProps {
    requirements: IngredientRequirement[];
    instructions: Instruction[];
    auditLog: AuditLog | null;
    selectedDate: string;
    kitchenId?: number;
}

export default function AuditIndex({ auth, requirements, instructions, auditLog, selectedDate, kitchenId }: AuditProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(auditLog?.photo_path ? `/storage/${auditLog.photo_path}` : null);

    const { data, setData, post, processing, errors, reset } = useForm({
        audit_date: selectedDate,
        taste_score: auditLog?.taste_score || 0,
        appearance_score: auditLog?.appearance_score || 0,
        aroma_score: auditLog?.aroma_score || 0,
        texture_score: auditLog?.texture_score || 0,
        photo: null as File | null,
        notes: auditLog?.notes || '',
        kitchen_id: kitchenId
    });

    useEffect(() => {
        if (auditLog) {
            setData({
                audit_date: selectedDate,
                taste_score: auditLog.taste_score,
                appearance_score: auditLog.appearance_score,
                aroma_score: auditLog.aroma_score,
                texture_score: auditLog.texture_score,
                photo: null,
                notes: auditLog.notes || '',
                kitchen_id: kitchenId
            });
            setPreviewImage(auditLog.photo_path ? `/storage/${auditLog.photo_path}` : null);
        } else {
            reset();
            setPreviewImage(null);
        }
    }, [auditLog, selectedDate]);

    const handleDateChange = (date: string) => {
        router.get(route('audit.index'), { date }, { preserveState: true });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('audit.store'), {
            forceFormData: true,
        });
    };

    const handleExportPdf = () => {
        window.location.href = route('audit.export', { date: selectedDate, kitchen_id: kitchenId });
    };

    const ScoreSelector = ({ label, value, field }: { label: string, value: number, field: string }) => (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{label}</label>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{value}/5</span>
            </div>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setData(field as any, s)}
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                            value >= s 
                                ? "bg-emerald-900 border-emerald-900 text-white shadow-lg shadow-emerald-900/20" 
                                : "bg-white border-emerald-950/5 text-emerald-900/20 hover:border-emerald-900 hover:text-emerald-900"
                        )}
                    >
                        <Star className={cn("w-4 h-4", value >= s && "fill-current")} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout header="Audit & Kontrol QC">
            <Head title="Audit & QC" />

            <div className="space-y-12 animate-in fade-in duration-700 pb-32">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4 max-w-[1400px] mx-auto w-full">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-emerald-950 font-headline uppercase italic">Quality Control Center</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-emerald-900/40 italic tracking-wide text-[10px] font-black uppercase">
                                Verifikasi Gizi, Organoleptik & Visual Proof
                            </p>
                            {auditLog && (
                                <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    QC Certified
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-emerald-900/5 shadow-sm">
                            <Calendar className="w-5 h-5 text-emerald-500 ml-2" />
                            <input 
                                type="date" 
                                className="border-none bg-transparent text-sm font-black text-emerald-900 focus:ring-0 cursor-pointer"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                        </div>
                        
                        <button
                            onClick={handleExportPdf}
                            className={cn(
                                "px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-3 animate-in slide-in-from-right",
                                auditLog 
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20" 
                                    : "bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-900/10 shadow-sm"
                            )}
                        >
                            <Download className="w-4 h-4" />
                            {auditLog ? 'Unduh Sertifikat QC' : 'Unduh Lembar Kerja Persiapan'}
                        </button>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
                    {/* Left: Input Audit Form */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Status Message for Admin */}
                        {!kitchenId && auth.user.role === 'ADMIN' && (
                            <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex items-center gap-4">
                                <AlertCircle className="text-amber-500 w-8 h-8" />
                                <div>
                                    <div className="font-black text-amber-900 text-sm">Mode Administrator</div>
                                    <div className="text-xs text-amber-900/60 font-medium">Pilih jadwal di Planner terlebih dahulu untuk melihat data audit spesifik dapur.</div>
                                </div>
                            </div>
                        )}

                        {/* 1. Kitchen Instructions */}
                        <section className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <ClipboardCheck className="w-6 h-6 text-emerald-400" />
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">Instruksi Produksi & QC</h3>
                                </div>
                                
                                {instructions.length === 0 ? (
                                    <p className="text-emerald-100/30 italic text-sm font-medium">Tidak ada instruksi khusus untuk menu hari ini.</p>
                                ) : (
                                    <div className="space-y-8">
                                        {instructions.map((inst, idx) => (
                                            <div key={idx} className="space-y-4 border-l-2 border-emerald-500/20 pl-6 py-2">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 leading-none">{inst.menu_name}</div>
                                                <p className="text-sm font-bold text-white leading-relaxed whitespace-pre-wrap">{inst.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 2. Audit Verification Form */}
                        <form onSubmit={submit} className="bg-white rounded-[3rem] p-10 border border-emerald-900/5 shadow-sm space-y-12">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-900/40 flex items-center gap-3">
                                    <CheckSquare className="w-4 h-4" />
                                    Laporan Organoleptik & Visual
                                </h3>
                                {auditLog && (
                                    <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Trophy className="w-3 h-3" />
                                        Terverifikasi: {auditLog.auditor?.full_name} {auditLog.auditor?.title && `, ${auditLog.auditor.title}`}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Photo Upload Section */}
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">Visual Proof (Bukti Foto Menu)</label>
                                    <div 
                                        onClick={() => document.getElementById('photo-upload')?.click()}
                                        className="aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-emerald-900/10 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group hover:bg-emerald-50 transition-all"
                                    >
                                        {previewImage ? (
                                            <>
                                                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                                <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all">
                                                    <Camera className="w-10 h-10 mb-2" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Ganti Foto</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-emerald-900/20 group-hover:scale-110 transition-transform">
                                                    <Camera className="w-8 h-8" />
                                                </div>
                                                <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-emerald-950/30">Klik untuk ambil foto</p>
                                                <p className="mt-2 text-[9px] text-emerald-900/20 italic">Sistem akan mengompres foto secara otomatis</p>
                                            </>
                                        )}
                                        <input 
                                            id="photo-upload"
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                    </div>
                                    {errors.photo && <p className="text-xs text-rose-500 mt-2 font-bold">{errors.photo}</p>}
                                </div>

                                {/* Scoring Section */}
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                                        <ScoreSelector label="Rasa (Taste)" value={data.taste_score} field="taste_score" />
                                        <ScoreSelector label="Penampilan" value={data.appearance_score} field="appearance_score" />
                                        <ScoreSelector label="Aroma" value={data.aroma_score} field="aroma_score" />
                                        <ScoreSelector label="Tekstur" value={data.texture_score} field="texture_score" />
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">Catatan Audit Tambahan</label>
                                        <textarea 
                                            placeholder="Tuliskan detail tambahan atau penyimpangan jika ada..."
                                            className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500/10 min-h-[120px] transition-all"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-3 text-emerald-800/40 italic text-[10px] font-medium leading-tight max-w-[400px]">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    Dengan menyimpan, Anda menyatakan telah melakukan verifikasi visual dan indrawi sesuai standar QC Nutrizi. Laporan PDF akan segera tersedia.
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto bg-emerald-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-black hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3"
                                >
                                    {processing ? 'Memproses...' : (auditLog ? 'Perbarui Audit' : 'Kunci & Terbitkan Audit')}
                                    <Save className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Aggregation Stats */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="bg-white p-10 rounded-[3rem] border border-emerald-900/5 shadow-sm space-y-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-900/40 flex items-center gap-3">
                                <Package className="w-4 h-4" />
                                Ringkasan Kebutuhan Bahan
                            </h4>

                            {requirements.length === 0 ? (
                                <div className="py-10 text-center bg-slate-50 rounded-2xl italic text-[10px] uppercase font-black tracking-widest text-emerald-900/20">Jadwal Kosong</div>
                            ) : (
                                <div className="space-y-4">
                                    {requirements.map((req, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl hover:bg-emerald-50/50 transition-colors">
                                            <div>
                                                <div className="text-[8px] font-black uppercase tracking-widest text-emerald-900/30">{req.category}</div>
                                                <div className="text-sm font-black text-emerald-950 uppercase italic">{req.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-emerald-900">{(req.total_weight / 1000).toFixed(1)}</span>
                                                <span className="text-[10px] font-black text-emerald-900/20 uppercase ml-1">kg</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!auditLog && requirements.length > 0 && (
                                <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-emerald-900/5 text-center group hover:bg-emerald-50 transition-all">
                                    <FileText className="w-6 h-6 mx-auto mb-2 text-emerald-900/20 group-hover:text-emerald-500 transition-colors" />
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Siap Memasak?</div>
                                    <p className="text-[9px] mt-1 italic text-emerald-900/30">Unduh lembar kerja untuk panduan porsi & instruksi dapur.</p>
                                </div>
                            )}

                            {auditLog && (
                                <div className="mt-8 p-6 bg-emerald-900 rounded-[2rem] text-white text-center shadow-xl shadow-emerald-900/20 animate-in zoom-in-95">
                                    <Trophy className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Sertifikat Tersedia</div>
                                    <p className="text-[9px] mt-1 italic">Hasil pengadaan dan QC sudah dapat diunduh.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
