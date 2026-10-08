package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.application.dtos.AdminRequestDTO;
import com.example.motoprojetofinal.application.dtos.AdminResponseDTO;
import com.example.motoprojetofinal.domain.entities.Administrador;
import com.example.motoprojetofinal.domain.entities.Role;
import com.example.motoprojetofinal.domain.repository.AdministradorRepository;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UsuarioRepository usuarioRepository;
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminResponseDTO criarAdmin(AdminRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email já cadastrado");
        }
        Administrador admin = new Administrador();
        admin.setNome(dto.nome());
        admin.setEmail(dto.email());
        admin.setSenha(passwordEncoder.encode(dto.senha()));
        admin.setRole(Role.ADMINISTRADOR);
        administradorRepository.save(admin);

        return new AdminResponseDTO(admin.getId(), admin.getNome(), admin.getEmail(), admin.getRole());
    }
}