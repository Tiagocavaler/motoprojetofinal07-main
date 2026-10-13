package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.application.dtos.AdminRequestDTO;
import com.example.motoprojetofinal.application.dtos.AdminResponseDTO;
import com.example.motoprojetofinal.domain.entities.Administrador;
import com.example.motoprojetofinal.domain.entities.Role;
import com.example.motoprojetofinal.domain.repository.AdministradorRepository;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    private final UsuarioRepository usuarioRepository;
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AdminResponseDTO criarAdmin(AdminRequestDTO dto) {
        if (usuarioRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        Administrador admin = new Administrador();
        admin.setNome(dto.nome());
        admin.setEmail(dto.email().toLowerCase());
        admin.setSenha(passwordEncoder.encode(dto.senha()));
        admin.setRole(Role.ADMINISTRADOR);

        // OFFLINE-FIRST - H2 ./localdb/
        admin.setSincronizado(false);
        admin.setOrigem("LOCAL");
        admin.setAtivoNaLoja(true);
        admin.setUpdatedAt(LocalDateTime.now());

        administradorRepository.save(admin);
        log.info("Admin criado offline no H2: {}", admin.getEmail());

        return new AdminResponseDTO(admin.getId(), admin.getNome(), admin.getEmail(), admin.getRole());
    }
}