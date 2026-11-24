package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.services.SyncService;
import com.example.motoprojetofinal.domain.entities.Produto;
import com.example.motoprojetofinal.domain.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
/**
 * CAMADA: Presentation / Controller - REST
 * O QUE FAZ: Recebe as requisições HTTP relacionadas ao Produto.
 * Ex: listar produtos, buscar por id, cadastrar, sincronizar com API externa.
 * POR QUE EXISTE: É a porta de entrada da API para o catálogo.
 * Ele só recebe o JSON e repassa para a camada Application.
 * NÃO tem regra de negócio aqui, só HTTP.
 * ROTA BASE: /produtos
 */

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final SyncService syncService;

    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        return ResponseEntity.ok(produtoRepository.findByAtivoNaLojaTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoRepository.findById(id).orElseThrow());
    }

    @PostMapping("/sync")
    public ResponseEntity<String> sincronizar() {
        if (!syncService.temInternet()) {
            return ResponseEntity.ok("Offline - " + produtoRepository.findByAtivoNaLojaTrue().size() + " produtos no H2");
        }
        syncService.sincronizarSeOnline();
        return ResponseEntity.ok("Atualizado - " + produtoRepository.findByAtivoNaLojaTrue().size() + " produtos");
    }
}