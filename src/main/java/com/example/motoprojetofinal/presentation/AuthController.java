package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.services.ClienteService;
import com.example.motoprojetofinal.application.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {

    private final ClienteService clienteService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        try {
            // aqui era ClienteService com C maiúsculo, tem que ser minúsculo
            return ResponseEntity.ok(clienteService.login(body.get("email"), body.get("senha")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody Map<String, String> body){
        try {
            passwordResetService.gerarTokenRecuperacao(body.get("email"));
            return ResponseEntity.ok(Map.of("message","Se o e-mail existir, enviamos o link"));
        } catch (RuntimeException e){
            if(e.getMessage().contains("Limite")){
                return ResponseEntity.status(429).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.ok(Map.of("message","Se o e-mail existir, enviamos o link"));
        }
    }

    @PostMapping("/resetar-senha")
    public ResponseEntity<?> resetarSenha(@RequestBody Map<String, String> body){
        try {
            passwordResetService.resetarSenha(body.get("token"), body.get("novaSenha"));
            return ResponseEntity.ok(Map.of("message","Senha alterada com sucesso!"));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}