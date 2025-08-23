<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ollama Settings
    |--------------------------------------------------------------------------
    |
    | Configurações para conectar com a API local do Ollama.
    |
    */

    'base_url' => env('OLLAMA_BASE_URL', 'http://localhost:11434'),

    'model' => env('OLLAMA_MODEL', 'llama3'),
];