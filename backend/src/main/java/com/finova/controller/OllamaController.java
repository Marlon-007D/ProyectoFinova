package com.finova.controller;

import com.finova.dto.ChatRequest;
import com.finova.dto.ChatResponse;
import com.finova.service.OllamaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
@CrossOrigin(origins = "http://localhost:4200")
public class OllamaController {

    private final OllamaService ollamaService;

    public OllamaController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @PostMapping("/generar")
    public ResponseEntity<ChatResponse> generarRespuesta(@RequestBody ChatRequest request) {
        String respuesta = ollamaService.generateResponse(request.getPrompt());
        return ResponseEntity.ok(new ChatResponse(respuesta));
    }
}
