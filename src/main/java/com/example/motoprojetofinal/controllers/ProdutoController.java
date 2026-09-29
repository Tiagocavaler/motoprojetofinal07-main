package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.services.ProdutoSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoSyncService produtoSyncService; // Injetado automaticamente via @Autowired

    // Sua rota para disparar a sincronização
    @PostMapping("/sincronizar")
    public ResponseEntity<String> forcarSincronizacaoProdutos() {
        produtoSyncService.sincronizarProdutos();
        return ResponseEntity.ok("Catálogo de produtos atualizado manualmente com sucesso!");
    }
}
