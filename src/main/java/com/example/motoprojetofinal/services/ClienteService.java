package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.dtos.ClienteResponseDTO;
import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.entities.EnumStatusCliente;
import com.example.motoprojetofinal.entities.Role;
import com.example.motoprojetofinal.entities.Usuario;
import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteResponseDTO cadastrar(ClienteRequestDTO dto) {
        String emailLimpo = dto.email().toLowerCase().trim();

        if (usuarioRepository.existsByEmail(emailLimpo) || clienteRepository.existsByEmail(emailLimpo)) {
            throw new RuntimeException("Email já cadastrado");
        }

        String cpfFinal = dto.cpf() != null ? dto.cpf().replaceAll("\\D","") : "";
        if(cpfFinal.isBlank() || cpfFinal.equals("00000000000")){
            cpfFinal = String.valueOf(System.currentTimeMillis()).substring(2, 13);
            while(clienteRepository.existsByCpf(cpfFinal)){
                cpfFinal = String.valueOf(System.currentTimeMillis() + (int)(Math.random()*1000)).substring(2,13);
            }
        } else {
            if(clienteRepository.existsByCpf(cpfFinal)){
                throw new RuntimeException("CPF já cadastrado");
            }
        }

        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setEmail(emailLimpo);
        cliente.setSenha(passwordEncoder.encode(dto.senha()));
        cliente.setRole(Role.CLIENTE);
        cliente.setCpf(cpfFinal);
        cliente.setStatus(EnumStatusCliente.ATIVO);
        cliente.setAtivo(true);
        cliente.setUltimoLogin(LocalDateTime.now());
        cliente.setUltimoAcesso(LocalDateTime.now());
        return toResponse(clienteRepository.save(cliente));
    }

    // === MÉTODO ARRUMADO - AGORA BUSCA EM USUARIO TAMBÉM ===
    public ClienteResponseDTO login(String email, String senha){
        String emailLimpo = email.toLowerCase().trim();

        // 1. Tenta achar como Cliente (com JOIN)
        var clienteOpt = clienteRepository.findByEmail(emailLimpo);
        Usuario usuario;

        if (clienteOpt.isPresent()) {
            usuario = clienteOpt.get();
        } else {
            // 2. Se não achou em cliente, busca só em usuario (caso seu cadastro antigo)
            usuario = usuarioRepository.findByEmail(emailLimpo)
                    .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos"));
        }

        if(!passwordEncoder.matches(senha, usuario.getSenha())){
            throw new RuntimeException("E-mail ou senha incorretos");
        }

        // Se for Cliente, atualiza acesso e status
        if (usuario instanceof Cliente cliente) {
            if(cliente.getStatus() == EnumStatusCliente.EXCLUIDO){
                throw new RuntimeException("Conta excluída");
            }
            cliente.setUltimoLogin(LocalDateTime.now());
            cliente.setUltimoAcesso(LocalDateTime.now());
            cliente.setStatus(EnumStatusCliente.ATIVO);
            cliente.setAtivo(true);
            clienteRepository.save(cliente);
            return toResponse(cliente);
        }

        // Se for só Usuario (sem ser Cliente), converte pra response básica
        // Isso impede o erro que você teve
        Cliente temp = new Cliente();
        temp.setId(usuario.getId());
        temp.setNome(usuario.getNome());
        temp.setEmail(usuario.getEmail());
        temp.setRole(usuario.getRole());
        temp.setCpf("00000000000");
        temp.setStatus(EnumStatusCliente.ATIVO);
        temp.setUltimoAcesso(LocalDateTime.now());
        temp.setUltimoLogin(LocalDateTime.now());
        return toResponse(temp);
    }

    public List<ClienteResponseDTO> listarTodos() {
        List<Cliente> clientes = clienteRepository.findAll();
        clientes.forEach(c -> c.atualizarStatusAutomatico());
        clienteRepository.saveAll(clientes);
        return clientes.stream().map(this::toResponse).toList();
    }

    public List<ClienteResponseDTO> listarPorStatus(EnumStatusCliente status) {
        List<Cliente> todos = clienteRepository.findAll();
        todos.forEach(c -> c.atualizarStatusAutomatico());
        clienteRepository.saveAll(todos);
        return clienteRepository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.atualizarStatusAutomatico();
        clienteRepository.save(cliente);
        return toResponse(cliente);
    }

    public void registrarAcesso(Long id){
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.setUltimoAcesso(LocalDateTime.now());
        cliente.setUltimoLogin(LocalDateTime.now());
        if(cliente.getStatus() != EnumStatusCliente.EXCLUIDO){
            cliente.setStatus(EnumStatusCliente.ATIVO);
            cliente.setAtivo(true);
        }
        clienteRepository.save(cliente);
    }

    public void atualizarStatus(Long id, EnumStatusCliente status) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.setStatus(status);
        cliente.setAtivo(status != EnumStatusCliente.INATIVO && status != EnumStatusCliente.EXCLUIDO);
        clienteRepository.save(cliente);
    }

    public void excluir(Long id) {
        atualizarStatus(id, EnumStatusCliente.EXCLUIDO);
    }

    public void registrarLogin(Long id) {
        registrarAcesso(id);
    }

    public void registrarCompra(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.setUltimaCompra(LocalDateTime.now());
        cliente.setUltimoLogin(LocalDateTime.now());
        cliente.setUltimoAcesso(LocalDateTime.now());
        cliente.setStatus(EnumStatusCliente.ATIVO);
        cliente.setAtivo(true);
        clienteRepository.save(cliente);
    }

    private ClienteResponseDTO toResponse(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getEmail(),
                cliente.getRole(),
                cliente.getStatus(),
                cliente.getUltimoAcesso(),
                cliente.getUltimoLogin(),
                cliente.getUltimaCompra()
        );
    }
}