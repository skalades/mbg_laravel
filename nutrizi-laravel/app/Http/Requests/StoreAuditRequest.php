<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Per-kitchen scoping is handled in Controller
    }

    public function rules(): array
    {
        return [
            'audit_date' => 'required|date',
            'taste_score' => 'required|integer|min:1|max:5',
            'appearance_score' => 'required|integer|min:1|max:5',
            'aroma_score' => 'required|integer|min:1|max:5',
            'texture_score' => 'required|integer|min:1|max:5',
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // 10MB max upload
            'notes' => 'nullable|string',
        ];
    }
}
