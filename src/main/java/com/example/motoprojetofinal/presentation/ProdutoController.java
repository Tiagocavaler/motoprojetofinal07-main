package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.services.ProdutoSyncService;
import com.example.motoprojetofinal.application.services.ProdutoService; // seu service que lista produtos
import com.example.motoprojetofinal.domain.entities.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ProdutoController {

    private final ProdutoSyncService produtoSyncService;
    private final ProdutoService produtoService; // injete o service que você já deve ter

    @GetMapping // GET /produtos - pro front listar o catálogo
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/{id}") // GET /produtos/1 - pro front ver detalhe da moto
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping("/sync") // Antes /sincronizar, agora /sync (mais curto e padrão)
    public ResponseEntity<String> sincronizar() {
        produtoSyncService.sincronizarProdutos();
        return ResponseEntity.ok("Catálogo atualizado com sucesso!");
    }
}