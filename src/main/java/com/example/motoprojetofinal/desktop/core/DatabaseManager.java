package com.example.motoprojetofinal.desktop.core;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseManager {
    // Seu Supabase
    private static final String SUPABASE_URL = "jdbc:postgresql://db.SEU_CODIGO.supabase.co:5432/postgres?sslmode=require";
    private static final String SUPABASE_USER = "postgres";
    private static final String SUPABASE_PASS = "SUA_SENHA_DO_SUPABASE";

    // Banco local que salva na pasta /data - CORRIGIDO PARA H2 2.2.224
    private static final String LOCAL_URL = "jdbc:h2:file:./data/motodb_local;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";

    public static Connection getConnection() {
        try {
            System.out.println(">>> Tentando Supabase...");
            return DriverManager.getConnection(SUPABASE_URL, SUPABASE_USER, SUPABASE_PASS);
        } catch (Exception e) {
            System.out.println(">>> Supabase OFFLINE! Ativando plano B local: " + e.getMessage());
            try {
                return DriverManager.getConnection(LOCAL_URL, "sa", "");
            } catch (Exception ex) {
                throw new RuntimeException("Erro nos dois bancos!", ex);
            }
        }
    }

    public static void initLocalTables() {
        try (Connection conn = DriverManager.getConnection(LOCAL_URL, "sa", "")) {
            conn.createStatement().execute(
                    "CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), preco DOUBLE, estoque INT, synced BOOLEAN DEFAULT FALSE)"
            );
            conn.createStatement().execute(
                    "CREATE TABLE IF NOT EXISTS clientes (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), cpf VARCHAR(20), telefone VARCHAR(50), synced BOOLEAN DEFAULT FALSE)"
            );
            System.out.println(">>> Tabelas locais verificadas!");
        } catch (Exception e) { e.printStackTrace(); }
    }
}