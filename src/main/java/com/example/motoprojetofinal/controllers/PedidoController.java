package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.entities.Pedido;
import com.example.motoprojetofinal.services.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService; // Injetado automaticamente via @Autowired

    // Rota POST para simular uma compra na lojinha (/pedidos/comprar)
    @PostMapping("/comprar")
    public ResponseEntity<Pedido> realizarCompra(@RequestBody Pedido novoPedido) {
        // Recebe o JSON contendo o ID do cliente e a lista de IDs de produtos comprados
        Pedido pedidoSalvo = pedidoService.criarPedido(novoPedido);
        return ResponseEntity.ok(pedidoSalvo);
    }

    // Rota GET para listar o histórico (/pedidos)
    @GetMapping
    public ResponseEntity<List<Pedido>> buscarHistoricoPedidos() {
        List<Pedido> lista = pedidoService.listarTodos();
        return ResponseEntity.ok(lista);
    }
}
