package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.application.services.ClienteService;
import com.example.motoprojetofinal.application.services.PasswordResetService;
import com.example.motoprojetofinal.application.services.SyncService;
import com.example.motoprojetofinal.domain.entities.Usuario;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
/**
 * CAMADA: Presentation / Controller - REST
 * O QUE FAZ: Recebe as requisições de autenticação: login e cadastro.
 * Ex: POST /auth/login recebe email + senha e devolve o token JWT.
 * POR QUE EXISTE: É a única parte pública da API - não precisa de token
 * para logar, é aqui que o token é gerado.
 * ROTA BASE: /auth
 */

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@Slf4j
public class AuthController {

    private final ClienteService clienteService;
    private final PasswordResetService passwordResetService;
    private final UsuarioRepository usuarioRepository;
    private final SyncService syncService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        try {
            String email = body.get("email");
            String senha = body.get("senha");
            return ResponseEntity.ok(clienteService.login(email, senha));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody ClienteRequestDTO dto){
        try {
            return ResponseEntity.ok(clienteService.cadastrar(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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