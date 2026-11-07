package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.dtos.AdminRequestDTO;
import com.example.motoprojetofinal.application.dtos.AdminResponseDTO;
import com.example.motoprojetofinal.application.services.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return ResponseEntity.ok(administradorRepository.findByAtivoNaLojaTrue());
    }

    @PostMapping("/sync")
    public ResponseEntity<String> sincronizar() {
        if (!syncService.temInternet()) {
            return ResponseEntity.ok("Offline - " + administradorRepository.findByAtivoNaLojaTrue().size() + " admins no H2");
        }
        syncService.sincronizarSeOnline();
        return ResponseEntity.ok("Sync OK - " + administradorRepository.findByAtivoNaLojaTrue().size() + " admins");
    }
}