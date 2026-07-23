package com.finova.service;

import com.finova.dto.OllamaRequest;
import com.finova.dto.OllamaResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OllamaService {

    private final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private final String MODEL_NAME = "llama3.2:1b";

    public String generateResponse(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            // Inyectar un System Prompt (Contexto) para que la IA sepa su rol
            String systemPrompt = "Eres Nova, la asistente virtual y mascota de Finova, una aplicación de gestión financiera. " +
                                  "Debes responder de manera amigable, profesional y corta (máximo 2 o 3 oraciones). " +
                                  "El usuario te pregunta: " + prompt;

            OllamaRequest request = new OllamaRequest(MODEL_NAME, systemPrompt, false);

            OllamaResponse response = restTemplate.postForObject(OLLAMA_URL, request, OllamaResponse.class);

            if (response != null && response.getResponse() != null) {
                return response.getResponse();
            }
            return "Lo siento, no pude generar una respuesta.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error al conectar con la Inteligencia Artificial (Ollama). Asegúrate de que Ollama esté corriendo en localhost:11434 y tengas el modelo " + MODEL_NAME + " descargado.";
        }
    }
}
