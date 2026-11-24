package com.example.motoprojetofinal.infra.configuration;

import com.example.motoprojetofinal.domain.entities.Administrador;
import com.example.motoprojetofinal.domain.entities.Role;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
/**
 * CAMADA: Infra / Configuração
 * O QUE FAZ: Cria o administrador padrão (admin@palworld.com / admin123)
 * na primeira vez que a aplicação sobe, se ele ainda não existir.
 * POR QUE EXISTE: Garante que sempre tenha um admin para logar na
 * apresentação, sem precisar cadastrar na mão no Supabase.
 */

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner criarAdmin(UsuarioRepository usuarioRepo) {
        return args -> {
            String email = "admin@palworld.com";
            if (usuarioRepo.buscarPorEmail(email).isEmpty()) {
                Administrador admin = new Administrador();
                admin.setNome("Admin Palworld");
                admin.setEmail(email);
                admin.setSenha(new BCryptPasswordEncoder().encode("admin123"));
                admin.setRole(Role.ADMINISTRADOR); // <-- ESSA LINHA FALTAVA
                admin.setAtivo(true);
                admin.setOrigem("SUPABASE");

                usuarioRepo.salvar(admin);
                System.out.println(">>> ADMIN CRIADO: admin@palworld.com / admin123");
            } else {
                System.out.println(">>> ADMIN JA EXISTE");
            }
        };
    }
}