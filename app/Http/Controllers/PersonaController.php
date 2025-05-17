<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonaController extends Controller
{
    /**
     * Store a newly created persona in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'nullable|string|max:255',
            'profile' => 'nullable|array',
            'expectations' => 'nullable|array',
            'restrictions' => 'nullable|array',
            'goals' => 'nullable|array'
        ]);

        // Garantir valor não-nulo para name
        if (empty($validated['name'])) {
            $validated['name'] = 'Nova Persona';
        }

        Persona::create($validated);

        return redirect()->back()
            ->with('success', 'Persona criada com sucesso!');
    }

    /**
     * Update the specified persona in storage.
     */
    public function update(Request $request, Persona $persona)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'profile' => 'nullable|array',
            'expectations' => 'nullable|array',
            'restrictions' => 'nullable|array',
            'goals' => 'nullable|array'
        ]);

        $persona->update($validated);

        return back()->with('success', 'Persona atualizada com sucesso!');
    }

    /**
     * Remove the specified persona from storage.
     */
    public function destroy(Persona $persona)
    {
        $persona->delete();

        return back()->with('success', 'Persona removida com sucesso!');
    }
}