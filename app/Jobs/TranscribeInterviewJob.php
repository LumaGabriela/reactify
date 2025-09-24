<?php

namespace App\Jobs;

use App\Models\Interview;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Events\ProjectUpdated;

class TranscribeInterviewJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Aumenta o tempo máximo que o job pode rodar para 5 minutos (300 segundos)
    public $timeout = 300;

    protected $interview;

    public function __construct(Interview $interview)
    {
        $this->interview = $interview;
    }

    public function handle(): void
    {

        $pythonServiceUrl = config('services.python_transcriber.url');

        try {
            $response = Http::timeout($this->timeout - 10) // Timeout da requisição um pouco menor que o do job
                ->post($pythonServiceUrl . '/transcribe', [
                    'file_url' => $this->interview->file_path,
                ]);

            if ($response->successful()) {
                $transcript = $response->json('transcript');
                $this->interview->update([
                    'transcript' => $transcript,
                    'extraction_status' => 'completed'
                ]);
            } else {
                throw new \Exception('Serviço de transcrição retornou um erro: ' . $response->body());
            }

        } catch (\Exception $e) {
            Log::error('Falha no job de transcrição: ' . $e->getMessage());
            $this->interview->update(['extraction_status' => 'failed']);
            $this->fail($e); // Marca o job como falho
            return;
        }
        
        Log::info("Job concluído para a entrevista ID: {$this->interview->id}.");
    }
}