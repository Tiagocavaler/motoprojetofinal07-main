package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.dtos.ClienteResponseDTO;
import com.example.motoprojetofinal.entities.EnumStatusCliente;
import com.example.motoprojetofinal.services.ClienteService;
import com.example.motoprojetofinal.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ClienteController {
    private final ClienteService clienteService;
    private final PasswordResetService passwordResetService;

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos(
            @RequestParam(required = false) EnumStatusCliente status
    ){
        if(status != null){
            return ResponseEntity.ok(clienteService.listarPorStatus(status));
        }
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ClienteRequestDTO dto){
        try {
            String cpfFinal = dto.cpf();
            if(cpfFinal == null || cpfFinal.equals("00000000000") || cpfFinal.isBlank() || cpfFinal.replaceAll("\\D","").length() != 11){
                cpfFinal = String.valueOf(System.currentTimeMillis()).substring(2, 13);
            } else {
                cpfFinal = cpfFinal.replaceAll("\\D", "");
            }
            ClienteRequestDTO dtoCorrigido = new ClienteRequestDTO(
                    dto.nome(), cpfFinal, dto.email().toLowerCase().trim(), dto.senha()
            );
            ClienteResponseDTO novo = clienteService.cadastrar(dtoCorrigido);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        try {
            String email = body.get("email");
            String senha = body.get("senha");
            return ResponseEntity.ok(clienteService.login(email, senha));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "E-mail ou senha inválidos"));
        }
    }

    // ====== RESET FUNCIONA PRA CLIENTE E ADMIN ======
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody Map<String,String> body){
        try {
            String email = body.get("email");
            passwordResetService.gerarTokenRecuperacao(email);
            return ResponseEntity.ok(Map.of("message","Se o e-mail existir, enviamos o link"));
        } catch (RuntimeException e){
            if(e.getMessage().contains("Limite")){
                return ResponseEntity.status(429).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.ok(Map.of("message","Se o e-mail existir, enviamos o link"));
        }
    }

    @PostMapping("/resetar-senha")
    public ResponseEntity<?> resetarSenha(@RequestBody Map<String,String> body){
        try {
            String token = body.get("token");
            String novaSenha = body.get("novaSenha");
            passwordResetService.recuperarSenha(token, novaSenha);
            return ResponseEntity.ok(Map.of("message","Senha trocada com sucesso"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/acesso")
    public ResponseEntity<Void> registrarAcesso(@PathVariable Long id){
        clienteService.registrarAcesso(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody Map<String,String> req){
        clienteService.atualizarStatus(id, EnumStatusCliente.valueOf(req.get("status")));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/excluir")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        clienteService.excluir(id);
        return ResponseEntity.ok().build();
    }
}