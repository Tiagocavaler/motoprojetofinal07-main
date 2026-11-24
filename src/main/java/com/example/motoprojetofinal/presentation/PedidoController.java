package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.dtos.PedidoRequestDTO;
import com.example.motoprojetofinal.application.dtos.PedidoResponseDTO;
import com.example.motoprojetofinal.application.services.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
/**
 * CAMADA: Presentation / Controller - REST
 * O QUE FAZ: Recebe as requisições HTTP relacionadas ao Pedido.
 * Ex: criar pedido, listar pedidos de um cliente, mudar status do pedido.
 * POR QUE EXISTE: É a porta de entrada da API para o fluxo de compra.
 * Ele só recebe o JSON e repassa para a camada Application.
 * NÃO tem regra de negócio aqui, só HTTP.
 * ROTA BASE: /pedidos
 */

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criar(@RequestBody PedidoRequestDTO dto) {
        return ResponseEntity.ok(pedidoService.criarPedido(dto));
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }
}