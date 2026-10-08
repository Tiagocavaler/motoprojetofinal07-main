package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.application.dtos.ClienteResponseDTO;
import com.example.motoprojetofinal.application.dtos.AtualizarStatusDTO;
import com.example.motoprojetofinal.application.services.ClienteService;
import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ClienteController {
    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos(
            @RequestParam(required = false) EnumStatusCliente status
    ){
        if(status != null) return ResponseEntity.ok(clienteService.listarPorStatus(status));
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criar(@Valid @RequestBody ClienteRequestDTO dto){
        // AGORA TÁ CERTO: Controller só repassa. Lógica do CPF vai pro Service.
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @Valid @RequestBody AtualizarStatusDTO dto){
        clienteService.atualizarStatus(id, dto.status());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/acesso")
    public ResponseEntity<Void> registrarAcesso(@PathVariable Long id){
        clienteService.registrarAcesso(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id){
        clienteService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}