package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.services.SyncService;
import com.example.motoprojetofinal.domain.entities.Produto;
import com.example.motoprojetofinal.domain.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@Slf4j
public class ProdutoController {
    private final ProdutoRepository produtoRepository;
    private final SyncService syncService;

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoRepository.findByAtivoNaLojaTrue());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoRepository.findById(id).orElseThrow());
    }
    @PostMapping("/sync")
    public ResponseEntity<String> sincronizar() {
        if (!syncService.temInternet()) return ResponseEntity.ok("Offline - " + produtoRepository.findByAtivoNaLojaTrue().size() + " no H2");
        syncService.sincronizarSeOnline();
        return ResponseEntity.ok("Atualizado - " + produtoRepository.findByAtivoNaLojaTrue().size() + " produtos");
    }
}