<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkStoreJourneyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Altere para sua lógica de autorização
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
          'project_id' => 'required|integer|exists:projects,id',
          'journeys' => 'required|array',
          'journeys.*.title' => 'required|string|max:255',
          'journeys.*.steps' => 'required|array',
          'journeys.*.steps.*.description' => 'required|string',
          'journeys.*.steps.*.is_touchpoint' => 'sometimes|boolean',
        ];
    }
}