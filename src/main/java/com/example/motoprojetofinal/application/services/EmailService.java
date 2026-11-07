package com.example.motoprojetofinal.application.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final String frontendUrl;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender,
                        @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
    }

    public void enviarLinkReset(String email, String token) {
        if (mailSender == null) {
            log.warn("[EMAIL MOCK] Sem SMTP configurado - Link: {}/recuperar?token={}", frontendUrl, token);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("firestorm134679@gmail.com");
            msg.setTo(email);
            msg.setSubject("Recuperar senha - MotoProjetoFinal");
            msg.setText("Clique no link para recuperar sua senha:\n\n" +
                    frontendUrl + "/recuperar?token=" + token + "\n\n" +
                    "Esse link expira em 30 minutos.");
            mailSender.send(msg);
            log.info("E-mail enviado para: {}", email);
        } catch (Exception e) {
            log.error("ERRO AO ENVIAR E-MAIL para {}: {} - Link fallback: {}/recuperar?token={}",
                    email, e.getMessage(), frontendUrl, token);
        }
    }
}