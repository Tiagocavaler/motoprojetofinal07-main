package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.application.dtos.ItemPedidoDTO;
import com.example.motoprojetofinal.application.dtos.PedidoRequestDTO;
import com.example.motoprojetofinal.application.dtos.PedidoResponseDTO;
import com.example.motoprojetofinal.domain.entities.*;
import com.example.motoprojetofinal.domain.repository.ClienteRepository;
import com.example.motoprojetofinal.domain.repository.PedidoRepository;
import com.example.motoprojetofinal.domain.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus("PENDENTE");

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoDTO itemDto : dto.itens()) {
            Produto produto = produtoRepository.findById(itemDto.produtoId()) // 1. Agora já é Long
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDto.produtoId()));

            // 2. VALIDAÇÃO DE ESTOQUE - O QUE FALTAVA
            if (produto.getEstoque() == null || produto.getEstoque() < itemDto.quantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome() + " | Disponível: " + produto.getEstoque());
            }

            // 3. BAIXA DE ESTOQUE REAL - Mantém buckets intactos, só muda o número
            produto.setEstoque(produto.getEstoque() - itemDto.quantidade());
            produtoRepository.save(produto);

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDto.quantidade());
            item.setPrecoUnitario(produto.getPreco());

            pedido.getItens().add(item);

            total = total.add(item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
        }

        pedido.setTotal(total);
        Pedido salvo = pedidoRepository.save(pedido);
        return toResponse(salvo);
    }

    public List<PedidoResponseDTO> listarTodos() {
        return pedidoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public PedidoResponseDTO buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        return toResponse(pedido);
    }

    private PedidoResponseDTO toResponse(Pedido pedido) {
        List<ItemPedidoDTO> itensDto = pedido.getItens().stream()
                .map(item -> new ItemPedidoDTO(
                        item.getProduto().getId(),
                        item.getQuantidade()
                )).toList();

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getDataPedido(),
                pedido.getTotal(),
                pedido.getStatus(),
                itensDto
        );
    }
}