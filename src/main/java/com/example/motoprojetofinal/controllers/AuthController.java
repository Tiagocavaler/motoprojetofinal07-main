package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.dtos.ForgotPasswordRequest;
import com.example.motoprojetofinal.dtos.LoginRequest;
import com.example.motoprojetofinal.dtos.LoginResponse;
import com.example.motoprojetofinal.dtos.ResetPasswordRequest;
import com.example.motoprojetofinal.services.AuthService;
import com.example.motoprojetofinal.services.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Controller de autenticação")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    @Operation(summary = "Autenticação de usuários", description = "Método de login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/esqueci-senha")
    @Operation(summary = "Solicitar recuperação de senha", description = "Gera um token temporário para recuperação da senha")
    public ResponseEntity<String> esqueciSenha(@RequestBody ForgotPasswordRequest request) {
        String token = passwordResetService.gerarTokenRecuperacao(request.email());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/recuperar-senha")
    @Operation(summary = "Recuperar senha", description = "Valida o token e altera a senha do usuário")
    public ResponseEntity<String> recuperarSenha(@RequestBody ResetPasswordRequest request) {
        passwordResetService.recuperarSenha(request.token(), request.novaSenha());
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }
}