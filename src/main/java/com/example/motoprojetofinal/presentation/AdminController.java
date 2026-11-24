package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.dtos.AdminRequestDTO;
import com.example.motoprojetofinal.application.dtos.AdminResponseDTO;
import com.example.motoprojetofinal.application.services.AdminService;
import com.example.motoprojetofinal.application.services.SyncService;
import com.example.motoprojetofinal.domain.entities.Administrador;
import com.example.motoprojetofinal.domain.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
/**
 * CAMADA: Presentation / Controller - REST
 * O QUE FAZ: Recebe as requisições HTTP relacionadas ao Administrador.
 * Ex: listar administradores, buscar por id, criar novo admin.
 * POR QUE EXISTE: É a porta de entrada da API para tudo que é de admin.
 * Ele só recebe o JSON, valida e repassa para a camada Application.
 * NÃO tem regra de negócio aqui, só HTTP.
 * ROTA BASE: /admin
 */

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final AdministradorRepository administradorRepository;
    private final SyncService syncService;

    @PostMapping
    public ResponseEntity<AdminResponseDTO> criarAdmin(@RequestBody AdminRequestDTO dto){
        // OFFLINE-FIRST: salva no H2 local primeiro
        if (!syncService.temInternet()) {
            log.info("Criando admin offline: {}", dto.email());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.criarAdmin(dto));
    }

    @GetMapping
    public ResponseEntity<List<Administrador>> listarAdmins() {
        // sempre lista do H2 local ./localdb/
        return ResponseEntity.ok(administradorRepository.listarTodos());
    }

    @PostMapping("/sync")
    public ResponseEntity<String> sincronizar() {
        if (!syncService.temInternet()) {
            return ResponseEntity.ok("Offline - " + administradorRepository.listarTodos().size() + " admins no H2");
        }
        syncService.sincronizarSeOnline();
        return ResponseEntity.ok("Sync OK - " + administradorRepository.listarTodos().size() + " admins");
    }
}