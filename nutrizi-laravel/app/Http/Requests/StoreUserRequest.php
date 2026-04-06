<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
        $rules = [
            'username' => 'required|string|max:255|unique:users,username,' . ($this->user ? $this->user->id : ''),
            'full_name' => 'required|string|max:255',
            'title' => 'nullable|string|max:100',
            'role' => 'required|string|in:ADMIN,NUTRITIONIST',
            'kitchen_id' => 'required_if:role,NUTRITIONIST|nullable|exists:kitchens,id',
        ];

        if ($this->isMethod('POST')) {
            $rules['password'] = ['required', Password::defaults()];
        } else {
            $rules['password'] = ['nullable', Password::defaults()];
        }

        return $rules;
    }
}
