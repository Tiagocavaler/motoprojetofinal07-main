package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.entities.Pedido;
import com.example.motoprojetofinal.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

    @Service
    public class PedidoService {

        @Autowired
        private PedidoRepository pedidoRepository; // Injetado automaticamente pelo Spring

        // Salva um novo pedido de compra na lojinha do servidor
        public Pedido criarPedido(Pedido pedido) {
            return pedidoRepository.save(pedido);
        }

        // Lista todos os pedidos (útil para o painel do administrador do servidor)
        public List<Pedido> listarTodos() {
            return pedidoRepository.findAll();
        }
    }


