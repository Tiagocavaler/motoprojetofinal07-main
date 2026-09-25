package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.dtos.ClienteResponseDTO;
import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.entities.EnumStatusCliente;
import com.example.motoprojetofinal.entities.Role;
import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteResponseDTO cadastrar(ClienteRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email já cadastrado");
        }
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setEmail(dto.email());
        cliente.setSenha(passwordEncoder.encode(dto.senha()));
        cliente.setRole(Role.CLIENTE);
        cliente.setCpf(dto.cpf());
        cliente.setStatus(EnumStatusCliente.ATIVO);
        return toResponse(clienteRepository.save(cliente));
    }

    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ClienteResponseDTO buscarPorId(Long id) {
        return toResponse(clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado")));
    }

    public void atualizarStatus(Long id, EnumStatusCliente status) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.setStatus(status);
        clienteRepository.save(cliente);
    }

    public void excluir(Long id) { atualizarStatus(id, EnumStatusCliente.EXCLUIDO); }

    private ClienteResponseDTO toResponse(Cliente cliente) {
        return new ClienteResponseDTO(cliente.getId(), cliente.getNome(), cliente.getCpf(), cliente.getEmail(), cliente.getRole(), cliente.getStatus());
    }
}