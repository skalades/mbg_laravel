export interface School {
    id: number;
    school_name: string;
    target_group: string | null;
    total_beneficiaries: number;
    total_teachers: number | null;
    large_portion_count: number | null;
    small_portion_count: number | null;
    location_address: string | null;
    siswa_laki_laki: number | null;
    siswa_perempuan: number | null;
    guru_laki_laki: number | null;
    guru_perempuan: number | null;
    buffer_count: number | null;
    sample_count: number | null;
    kitchen_id?: number | null;
    created_at?: string;
    updated_at?: string;
}
