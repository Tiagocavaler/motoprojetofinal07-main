package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.dtos.ForgotPasswordRequest;
import com.example.motoprojetofinal.dtos.LoginRequest;
import com.example.motoprojetofinal.dtos.ResetPasswordRequest;
import com.example.motoprojetofinal.services.AuthService;
import com.example.motoprojetofinal.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req){
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping({"/esqueci-senha", "/esqueci_senha", "/forgot-password", "/esqueci"})
    public ResponseEntity<?> esqueciSenha(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.forgotPassword(request.email());
            return ResponseEntity.ok(Map.of("message", "Se o e-mail existir, enviamos o link"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "Se o e-mail existir, enviamos o link"));
        }
    }

    @PostMapping({"/recuperar-senha", "/recuperar_senha", "/reset-password", "/resetar-senha"})
    public ResponseEntity<?> recuperarSenha(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.token(), request.novaSenha());
        return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso!"));
    }
}