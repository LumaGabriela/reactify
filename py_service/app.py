import os
import whisper
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

print("Carregando o modelo Whisper...")
model = whisper.load_model("medium")
print("Modelo carregado com sucesso.")

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if not request.json or 'file_url' not in request.json:
        return jsonify({"error": "Requisição inválida. 'file_url' é obrigatório."}), 400

    file_url = request.json['file_url']
    
    try:
        print(f"Baixando arquivo de: {file_url}")
        with requests.get(file_url, stream=True) as r:
            r.raise_for_status()
            temp_file_path = "temp_audio_file.tmp"
            with open(temp_file_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        print("Download concluído.")

        print("Iniciando transcrição...")
        result = model.transcribe(temp_file_path, fp16=False) # fp16=False para maior compatibilidade de CPU
        transcript_text = result['text']
        print("Transcrição concluída.")

        os.remove(temp_file_path)

        return jsonify({"transcript": transcript_text})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Falha ao baixar o arquivo: {e}"}), 500
    except Exception as e:
        if os.path.exists("temp_audio_file.tmp"):
            os.remove("temp_audio_file.tmp")
        print(f"Erro inesperado: {e}")
        return jsonify({"error": f"Ocorreu um erro durante a transcrição: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)