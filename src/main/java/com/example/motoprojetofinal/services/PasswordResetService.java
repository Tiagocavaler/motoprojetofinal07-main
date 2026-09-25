package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.entities.PasswordResetToken;
import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final ClienteRepository clienteRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public String gerarTokenRecuperacao(String email){
        var cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setCliente(cliente);
        resetToken.setExpiracao(LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepository.save(resetToken);
        return token;
    }

    public PasswordResetToken validarToken(String token) {
        var tokenEncontrado = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (LocalDateTime.now().isAfter(tokenEncontrado.getExpiracao())) {
            throw new RuntimeException("Token expirado");
        }
        return tokenEncontrado;
    }

    public void recuperarSenha(String token, String novaSenha) {
        PasswordResetToken resetToken = validarToken(token);
        Cliente cliente = resetToken.getCliente();
        cliente.setSenha(passwordEncoder.encode(novaSenha));
        clienteRepository.save(cliente);
        passwordResetTokenRepository.delete(resetToken);
    }
}