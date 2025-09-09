<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Cloudinary\Api\Exception\NotFound;
use Log;

class InterviewController extends Controller
{
    /**
     * Armazena uma nova entrevista de qualquer tipo no Cloudinary.
     */
    public function store(Request $request, Project $project)
    {
        $request->validate([
            'interview' => 'required|file|mimes:mp3,wav,ogg,m4a,mp4,mov,webm,txt,pdf,doc,docx|max:51200',
        ]);

        try {
            $file = $request->file('interview');
            $originalName = $file->getClientOriginalName();

            // Prepara um nome de ficheiro sanitizado, mas mantém a extensão
            $fileNameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME);
            $fileExtension = $file->getClientOriginalExtension();
            $publicFileName = Str::slug($fileNameWithoutExtension) . '.' . $fileExtension;
            
            $folder = 'reactify/interviews/' . $project->id;

            $uploadedFile = cloudinary()->uploadApi()->upload($file->getRealPath(), [
                'folder'           => $folder,
                'public_id'        => pathinfo($publicFileName, PATHINFO_FILENAME),
                'unique_filename'  => false,
                'overwrite'        => true,
                'resource_type'    => 'auto', // Cloudinary deteta o tipo automaticamente
            ]);

            $project->interviews()->create([
                'file_name' => $originalName,
                'file_path' => $uploadedFile['secure_url'],
                'public_id' => $uploadedFile['public_id'],
            ]);

            return back()->with(['status' => 'success', 'message' => 'Entrevista enviada com sucesso.']);
        } catch (\Exception $e) {
            Log::error("Falha no upload da entrevista: " . $e->getMessage());
            return back()->with(['status' => 'error', 'message' => 'Falha ao enviar a entrevista.']);
        }
    }

    /**
     * Remove o ficheiro do Cloudinary e o registo da base de dados.
     */
    public function destroy(Interview $interview)
    {
        try {
            $publicID = $interview->public_id;

            if ($publicID) {
                $response = cloudinary()->adminApi()->deleteAssets([$publicID]);

                if (isset($response['deleted']) && in_array('not_found', $response['deleted'])) {
                    throw new \Exception('Asset com public_id "' . $publicID . '" não foi encontrado no Cloudinary para exclusão.');
                }
            }

            $interview->delete();

            return back()->with(['status' => 'success', 'message' => 'Entrevista apagada com sucesso']);
        } catch (\Exception $e) {
            Log::error("Falha ao apagar a entrevista: ID " . $interview->id . " - " . $e->getMessage());

            if ($e instanceof NotFound) {
                 $interview->delete();
                 return back()->with(['status' => 'warning', 'message' => 'Entrevista apagada do sistema, mas não foi encontrada no Cloudinary.']);
            }

            return back()->with(['status' => 'error', 'message' => 'Falha ao apagar a entrevista.']);
        }
    }

    /**
     * Função auxiliar para determinar o resource_type do Cloudinary a partir do nome do ficheiro.
     */
    private function getResourceType(string $fileName): string
    {
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Cloudinary trata áudio como 'video'
        $videoTypes = ['mp4', 'mov', 'avi', 'webm', 'mp3', 'wav', 'ogg', 'm4a'];

        if (in_array($extension, $videoTypes)) {
            return 'video';
        }

        // Para tudo o resto (PDF, TXT, DOCX, etc.)
        return 'raw';
    }
}