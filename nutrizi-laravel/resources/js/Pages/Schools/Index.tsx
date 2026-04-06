import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { School } from '@/types/school';
import SchoolCard from '@/Components/Schools/SchoolCard';
import SchoolFormModal from '@/Components/Schools/SchoolFormModal';
import { Plus, School as SchoolIcon, LayoutGrid, Info, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolsProps extends PageProps {
    schools: School[];
    kitchenName: string | null;
}

export default function SchoolsIndex({ schools, kitchenName }: SchoolsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const openCreateModal = () => {
        setEditingSchool(null);
        setIsModalOpen(true);
    };

    const openEditModal = (school: School) => {
        setEditingSchool(school);
        setIsModalOpen(true);
    };

    const filteredSchools = schools.filter(s => 
        s.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.target_group?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout header="Manajemen Unit Sekolah">
            <Head title="Unit Sekolah" />

            <div className="max-w-[1600px] mx-auto space-y-10 pb-32 animate-in fade-in duration-1000">
                {/* Header & Search Bar combined */}
                <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-emerald-900/5 shadow-sm">
                    <div className="flex items-center gap-4 px-2 min-w-[300px]">
                        <div className="w-14 h-14 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-950/20">
                            <SchoolIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-950 font-headline uppercase tracking-tight">Mitra Nutrizi</h2>
                            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                                {kitchenName || 'Unit Operasional Pusat'}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-950/20 group-focus-within:text-emerald-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari unit sekolah, tingkat (SD/SMP), atau lokasi..."
                            className="w-full pl-14 pr-12 h-14 bg-slate-50 border-none rounded-[1.5rem] font-bold text-emerald-950 placeholder:text-emerald-900/20 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="w-full lg:w-auto h-14 bg-emerald-900 text-white px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-emerald-900/20 active:scale-95 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Unit
                    </button>
                </div>

                {/* Main Grid */}
                {filteredSchools.length === 0 ? (
                    <div className="bg-white/40 p-32 rounded-[4rem] border border-emerald-900/5 text-center space-y-6 backdrop-blur-sm">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-900/10 mx-auto">
                            <SchoolIcon className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Tidak Ada Unit Ditemukan</h3>
                            <p className="text-emerald-900/30 text-xs font-black uppercase tracking-widest">Database mitra kosong atau hasil pencarian nihil.</p>
                        </div>
                        <button onClick={() => setSearchTerm('')} className="px-8 py-4 bg-emerald-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                            Reset Pencarian
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSchools.map((school) => (
                            <SchoolCard 
                                key={school.id} 
                                school={school} 
                                onEdit={openEditModal} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <SchoolFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                editingSchool={editingSchool} 
            />
        </AuthenticatedLayout>
    );
}
