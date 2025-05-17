<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\Project;
use App\Http\Requests\PersonaRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonaController extends Controller
{
    /**
     * Store a newly created persona in storage.
     */
    public function store(PersonaRequest $request)
    {
        $validated = $request->validated();

        // Criar uma estrutura padrão para os campos json caso estejam vazios
        $validated['profile'] = !empty($validated['profile']) ? $validated['profile'] : [];
        $validated['expectations'] = !empty($validated['expectations']) ? $validated['expectations'] : [];
        $validated['restrictions'] = !empty($validated['restrictions']) ? $validated['restrictions'] : [];
        $validated['goals'] = !empty($validated['goals']) ? $validated['goals'] : [];

        Persona::create($validated);

        return redirect()->back()
            ->with('success', 'Persona criada com sucesso!');
    }

    /**
     * Update the specified persona in storage.
     */
    public function update(PersonaRequest $request, Persona $persona)
    {
        $validated = $request->validated();

        // Garantir que os campos json tenham valores padrão caso estejam vazios
        $validated['profile'] = !empty($validated['profile']) ? $validated['profile'] : [];
        $validated['expectations'] = !empty($validated['expectations']) ? $validated['expectations'] : [];
        $validated['restrictions'] = !empty($validated['restrictions']) ? $validated['restrictions'] : [];
        $validated['goals'] = !empty($validated['goals']) ? $validated['goals'] : [];

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