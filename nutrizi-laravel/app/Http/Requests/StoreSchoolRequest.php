<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authentication is handled by standard Laravel middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'school_name' => 'required|string|max:255',
            'target_group' => 'nullable|string|max:255',
            'total_beneficiaries' => 'nullable|integer|min:0',
            'total_teachers' => 'nullable|integer|min:0',
            'large_portion_count' => 'nullable|integer|min:0',
            'small_portion_count' => 'nullable|integer|min:0',
            'location_address' => 'nullable|string',
            'siswa_laki_laki' => 'nullable|integer|min:0',
            'siswa_perempuan' => 'nullable|integer|min:0',
            'guru_laki_laki' => 'nullable|integer|min:0',
            'guru_perempuan' => 'nullable|integer|min:0',
            'buffer_count' => 'nullable|integer|min:0',
            'sample_count' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'total_beneficiaries' => (int) ($this->siswa_laki_laki ?? 0) + (int) ($this->siswa_perempuan ?? 0),
            'total_teachers' => (int) ($this->guru_laki_laki ?? 0) + (int) ($this->guru_perempuan ?? 0),
        ]);
    }
}
