<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PersonaController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'profile' => 'nullable|array',
            'expectations' => 'nullable|array',
            'restrictions' => 'nullable|array',
            'goals' => 'nullable|array',
            'project_id' => 'required|exists:projects,id',

        ]);

        $persona = Persona::create($validated);

        return back()->with('success', 'Persona atualizada.');
    }

    public function update(Request $request, Persona $persona)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255', // Opcional, se enviado, valida como string
            'profile' => 'nullable|array',
            'expectations' => 'nullable|array',
            'restrictions' => 'nullable|array',
            'goals' => 'nullable|array',
            'project_id' => 'required|exists:projects,id',

        ]);

        $persona->update($validated);

        return back()->with('success', 'Persona atualizada.');

    }

    /**
     * Remove uma persona.
     */
    public function destroy(Persona $persona)
    {
        $persona->delete();

        return back()->with('success', 'Persona deletada.');

    }
}