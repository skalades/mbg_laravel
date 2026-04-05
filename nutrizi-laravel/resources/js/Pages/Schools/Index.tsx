import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { School } from '@/types/school';
import SchoolCard from '@/Components/Schools/SchoolCard';
import SchoolFormModal from '@/Components/Schools/SchoolFormModal';

interface SchoolsProps extends PageProps {
    schools: School[];
    kitchenName: string | null;
}

export default function SchoolsIndex({ schools, kitchenName }: SchoolsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);

    const openCreateModal = () => {
        setEditingSchool(null);
        setIsModalOpen(true);
    };

    const openEditModal = (school: School) => {
        setEditingSchool(school);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header="Manajemen Sekolah"
        >
            <Head title="Sekolah Mitra" />

            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-emerald-900 font-headline">Daftar Sekolah Mitra</h2>
                        <p className="text-emerald-800/60 mt-1 italic tracking-wide">
                            {kitchenName 
                                ? `Unit Operasional: ${kitchenName}` 
                                : "Daftar sekolah penerima manfaat gizi."}
                        </p>
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-emerald-900/20 hover:translate-y-[-2px] transition-all flex items-center gap-3"
                    >
                        Tambah Sekolah
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schools.length === 0 ? (
                        <div className="col-span-full bg-white p-20 rounded-[3rem] border border-emerald-900/5 text-center space-y-4">
                            <span className="material-symbols-outlined text-6xl text-emerald-100">school</span>
                            <p className="text-emerald-800/30 font-medium italic">Belum ada sekolah yang terdaftar.</p>
                        </div>
                    ) : (
                        schools.map((school) => (
                            <SchoolCard 
                                key={school.id} 
                                school={school} 
                                onEdit={openEditModal} 
                            />
                        ))
                    )}
                </div>
            </div>

            <SchoolFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                editingSchool={editingSchool} 
            />
        </AuthenticatedLayout>
    );
}

// Route helper (kept for simple Link components in Cards if needed)
export const route = (name: string, params?: any) => {
    if (name === 'schools.index') return '/schools';
    if (name === 'schools.show') return `/schools/${params}`;
    if (name === 'schools.store') return '/schools';
    if (name === 'schools.update') return `/schools/${params}`;
    return '#';
};
