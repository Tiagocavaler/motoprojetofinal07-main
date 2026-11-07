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
        String emailLimpo = dto.email().toLowerCase().trim();

        if (usuarioRepository.existePorEmail(emailLimpo)) {
            throw new RuntimeException("Email já cadastrado");
        }

        Administrador admin = new Administrador();
        admin.setNome(dto.nome());
        admin.setEmail(emailLimpo);
        admin.setSenha(passwordEncoder.encode(dto.senha()));
        admin.setRole(Role.ADMINISTRADOR);
        administradorRepository.salvar(admin);

        return new AdminResponseDTO(admin.getId(), admin.getNome(), admin.getEmail(), admin.getRole());
    }
}