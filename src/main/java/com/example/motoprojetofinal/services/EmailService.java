package com.example.motoprojetofinal.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void enviarLinkReset(String email, String token) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("firestorm134679@gmail.com");
            msg.setTo(email);
            msg.setSubject("Recuperar senha - MotoProjetoFinal");
            msg.setText("Clique no link para recuperar sua senha:\n\n" +
                    frontendUrl + "/recuperar?token=" + token + "\n\n" +
                    "Esse link expira em 30 minutos.");

            mailSender.send(msg);
            System.out.println("E-mail enviado para: " + email);
        } catch (Exception e) {
            e.printStackTrace();
            // NÃO joga exceção pra cima, senão o front mostra "Erro ao enviar"
            // Só loga
            System.out.println("ERRO AO ENVIAR E-MAIL: " + e.getMessage());
        }
    }
}