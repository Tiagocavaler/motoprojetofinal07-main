package com.example.motoprojetofinal;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import java.io.File;
import java.net.URL;

public class DesktopApp extends Application {

    private ConfigurableApplicationContext context;

    @Override
    public void init() {
        this.context = new SpringApplicationBuilder(MotoprojetofinalApplication.class)
                .profiles("local")
                .run();
    }

    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();

        // Pega a porta real que o Spring subiu (55375, 51377, etc)
        String port = context.getEnvironment().getProperty("local.server.port", "8080");
        System.out.println("Backend rodando na porta: " + port);

        String urlToLoad;

        // 1. Tenta carregar o front BUILDADO (offline)
        // Procura em: target/classes/static/index.html (quando builda) ou front/dist/index.html (dev)
        URL resource = getClass().getResource("/static/index.html");
        File devFront = new File("front/dist/index.html");
        File prodFront = new File("MotoProjeto/front/dist/index.html");

        if (resource != null) {
            System.out.println("Carregando front do JAR: " + resource.toExternalForm());
            urlToLoad = resource.toExternalForm();
        } else if (devFront.exists()) {
            System.out.println("Carregando front de: " + devFront.getAbsolutePath());
            urlToLoad = devFront.toURI().toString();
        } else if (prodFront.exists()) {
            urlToLoad = prodFront.toURI().toString();
        } else {
            // 2. Fallback: tenta o vite dev server na 3000
            System.out.println("Front buildado não encontrado, tentando http://localhost:3000/");
            urlToLoad = "http://localhost:3000/";
        }

        webView.getEngine().load(urlToLoad);

        // Log de erro pra debug
        webView.getEngine().setOnAlert(e -> System.out.println("WebView Alert: " + e.getData()));
        webView.getEngine().getLoadWorker().exceptionProperty().addListener((obs, old, ex) -> {
            if (ex != null) ex.printStackTrace();
        });

        Scene scene = new Scene(webView, 1280, 900);
        stage.setTitle("MotoProjeto Final - Desktop Offline First - Porta " + port);
        stage.setScene(scene);
        stage.setMaximized(true);
        stage.show();
    }

    @Override
    public void stop() {
        if (context != null) context.close();
    }

    public static void main(String[] args) {
        launch(args);
    }
}