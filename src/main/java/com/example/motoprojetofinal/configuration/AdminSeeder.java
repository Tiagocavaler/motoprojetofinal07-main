package com.example.motoprojetofinal.configuration;

import com.example.motoprojetofinal.entities.Administrador;
import com.example.motoprojetofinal.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner criarAdmin(UsuarioRepository usuarioRepo) {
        return args -> {
            String email = "admin@palworld.com";
            if (usuarioRepo.findByEmail(email).isEmpty()) {
                Administrador admin = new Administrador();
                admin.setNome("Admin Palworld");
                admin.setEmail(email);
                admin.setSenha(new BCryptPasswordEncoder().encode("admin123"));

                usuarioRepo.save(admin);
                System.out.println(">>> ADMIN CRIADO: admin@palworld.com / admin123");
            } else {
                System.out.println(">>> ADMIN JA EXISTE");
            }
        };
    }
}