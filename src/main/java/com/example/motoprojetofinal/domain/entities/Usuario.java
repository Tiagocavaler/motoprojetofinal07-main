package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import com.example.motoprojetofinal.domain.ValueObjects.Email;

/**
 * CAMADA: Domain / Entidade - CLASSE PAI
 * O QUE FAZ: Representa o usuário base do sistema (nome, email, senha,
 * role, ativo, origem, último login).
 * HERANÇA: @Inheritance JOINED - as tabelas 'administrador' e 'clientes'
 * herdam dessa. O id é Long / bigint em todas as 3.
 * SEGURANÇA: Implementa UserDetails, por isso o Spring Security usa
 * ela para fazer login e validar o JWT.
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "usuario")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    private Role role = Role.CLIENTE;

    // Campos que o ClienteService e o Administrador usam
    private Boolean ativo = true;
    private Boolean sincronizado = false;
    private String origem = "LOCAL";
    private LocalDateTime updatedAt;
    private LocalDateTime ultimoLogin;
    private LocalDateTime ultimoAcesso;

    // VALUE OBJECT - EMAIL
    // O banco continua String, mas quem valida é o VO
    public void setEmail(String email) {
        this.email = new Email(email).valor();
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override public String getPassword() { return senha; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return ativo == null || ativo; }
}