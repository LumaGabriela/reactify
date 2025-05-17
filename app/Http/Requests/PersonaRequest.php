<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersonaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'project_id' => $this->isMethod('POST') ? 'required|exists:projects,id' : '',
            'profile' => 'required|array',
            'expectations' => 'required|array',
            'restrictions' => 'required|array',
            'goals' => 'required|array'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome da persona é obrigatório',
            'project_id.required' => 'O projeto é obrigatório',
            'project_id.exists' => 'O projeto selecionado não existe',
            'profile.required' => 'O perfil da persona é obrigatório',
            'profile.array' => 'O perfil deve ser um array',
            'expectations.required' => 'As expectativas são obrigatórias',
            'expectations.array' => 'As expectativas devem ser um array',
            'restrictions.required' => 'As restrições são obrigatórias',
            'restrictions.array' => 'As restrições devem ser um array',
            'goals.required' => 'Os objetivos são obrigatórios',
            'goals.array' => 'Os objetivos devem ser um array'
        ];
    }
}