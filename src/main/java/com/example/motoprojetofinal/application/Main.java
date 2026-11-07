package com.example.motoprojetofinal.application;

import com.example.motoprojetofinal.WebApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import java.awt.Desktop;
import java.net.URI;

public class Main {
    public static void main(String[] args) throws Exception {
        ConfigurableApplicationContext ctx = SpringApplication.run(WebApplication.class, args);

        // Abre sua landpage que tá em resources/static/home no navegador
        // Herdando 100% do front
        if (Desktop.isDesktopSupported()) {
            Desktop.getDesktop().browse(new URI("http://localhost:8080/home"));
        }
    }
}