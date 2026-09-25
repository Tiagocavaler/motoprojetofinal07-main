package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.dtos.AtualizarStatusRequest;
import com.example.motoprojetofinal.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.dtos.ClienteResponseDTO;
import com.example.motoprojetofinal.services.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class ClienteController {
    private final ClienteService clienteService;

    @GetMapping public ResponseEntity<List<ClienteResponseDTO>> listarTodos(){ return ResponseEntity.ok(clienteService.listarTodos()); }
    @GetMapping("/{id}") public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id){ return ResponseEntity.ok(clienteService.buscarPorId(id)); }
    @PostMapping public ResponseEntity<ClienteResponseDTO> criar(@RequestBody ClienteRequestDTO dto){ return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(dto)); }
    @PatchMapping("/{id}/status") public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusRequest req){ clienteService.atualizarStatus(id, req.status()); return ResponseEntity.ok().build(); }
    @DeleteMapping("/{id}/excluir") public ResponseEntity<Void> excluir(@PathVariable Long id){ clienteService.excluir(id); return ResponseEntity.ok().build(); }
}