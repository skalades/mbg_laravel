<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreKitchenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role === 'ADMIN';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kitchen_name' => 'required|string|max:255',
            'location_address' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'default_buffer_count' => 'nullable|integer|min:0',
            'default_sample_count' => 'nullable|integer|min:0',
        ];
    }
}
