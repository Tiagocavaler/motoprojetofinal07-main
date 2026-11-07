package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.services.ProdutoSyncService;
import com.example.motoprojetofinal.application.services.ProdutoService;
import com.example.motoprojetofinal.domain.entities.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoSyncService produtoSyncService;
    private final ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping("/sync")
    public ResponseEntity<String> sincronizar() {
        produtoSyncService.sincronizarProdutos();
        return ResponseEntity.ok("Catálogo atualizado com sucesso!");
    }
}