package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

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

    // --- CAMPOS OFFLINE-FIRST ---
    @Column(nullable = false)
    private Boolean sincronizado = false;

    @Column(nullable = false)
    private String origem = "LOCAL";

    @Column
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean ativoNaLoja = true;

    @PrePersist
    @PreUpdate
    public void preSave() {
        this.updatedAt = LocalDateTime.now();
        if (this.origem == null) this.origem = "LOCAL";
        if (this.sincronizado == null) this.sincronizado = false;
        if (this.ativoNaLoja == null) this.ativoNaLoja = true;
    }

    // --- UserDetails ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override public String getPassword() { return senha; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return ativoNaLoja; }
}