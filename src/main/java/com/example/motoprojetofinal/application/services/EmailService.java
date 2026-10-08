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

    // @Autowired(required = false) faz o Spring NÃO quebrar se não achar o bean do e-mail
    public EmailService(@Autowired(required = false) JavaMailSender mailSender,
                        @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
    }

    public void enviarLinkReset(String email, String token) {
        if (mailSender == null) {
            log.warn("[EMAIL MOCK] Sem config de e-mail, mas gerando link para: {}", email);
            log.warn("[EMAIL MOCK] Link seria: {}/recuperar?token={}", frontendUrl, token);
            System.out.println("LINK DE RECUPERAÇÃO: " + frontendUrl + "/recuperar?token=" + token);
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
            log.error("ERRO AO ENVIAR E-MAIL para {}: {}", email, e.getMessage());
            // Não joga exceção, senão quebra o fluxo de recuperar senha
            System.out.println("LINK DE RECUPERAÇÃO (fallback): " + frontendUrl + "/recuperar?token=" + token);
        }
    }
}