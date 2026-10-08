package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.application.dtos.ClienteRequestDTO;
import com.example.motoprojetofinal.application.dtos.ClienteResponseDTO;
import com.example.motoprojetofinal.domain.entities.Cliente;
import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
import com.example.motoprojetofinal.domain.entities.Role;
import com.example.motoprojetofinal.domain.repository.ClienteRepository;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteService {
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ClienteResponseDTO cadastrar(ClienteRequestDTO dto) {
        String emailLimpo = dto.email().toLowerCase().trim();

        if (usuarioRepository.existsByEmail(emailLimpo) || clienteRepository.existsByEmail(emailLimpo)) {
            throw new RuntimeException("Email já cadastrado");
        }

        String cpfFinal = gerarCpfValido(dto.cpf());

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

        log.info("Cadastrando novo cliente: {}", emailLimpo);
        return toResponse(clienteRepository.save(cliente));
    }

    // Lógica extraída - SRP - agora tá certo
    private String gerarCpfValido(String cpfInput) {
        String cpfFinal = cpfInput != null ? cpfInput.replaceAll("\\D","") : "";
        if(cpfFinal.isBlank() || cpfFinal.equals("00000000000")){
            cpfFinal = String.valueOf(System.currentTimeMillis()).substring(2, 13);
            while(clienteRepository.existsByCpf(cpfFinal)){
                cpfFinal = String.valueOf(System.currentTimeMillis() + (int)(Math.random()*1000)).substring(2,13);
            }
            return cpfFinal;
        }
        if(clienteRepository.existsByCpf(cpfFinal)){
            throw new RuntimeException("CPF já cadastrado");
        }
        return cpfFinal;
    }

    @Transactional
    public ClienteResponseDTO login(String email, String senha){
        String emailLimpo = email.toLowerCase().trim();
        var clienteOpt = clienteRepository.findByEmail(emailLimpo);

        var usuario = clienteOpt.<Object>map(c -> (Object)c)
                .orElseGet(() -> usuarioRepository.findByEmail(emailLimpo)
                        .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos")));

        // validação de senha centralizada
        String senhaBanco = (usuario instanceof Cliente c) ? c.getSenha() : ((com.example.motoprojetofinal.domain.entities.Usuario)usuario).getSenha();
        if(!passwordEncoder.matches(senha, senhaBanco)){
            throw new RuntimeException("E-mail ou senha incorretos");
        }

        if (usuario instanceof Cliente cliente) {
            if(cliente.getStatus() == EnumStatusCliente.EXCLUIDO){
                throw new RuntimeException("Conta excluída");
            }
            cliente.setUltimoLogin(LocalDateTime.now());
            cliente.setUltimoAcesso(LocalDateTime.now());
            cliente.setStatus(EnumStatusCliente.ATIVO);
            cliente.setAtivo(true);
            return toResponse(clienteRepository.save(cliente));
        }

        // Usuário sem ser Cliente - agora lança erro correto em vez de criar fake
        throw new RuntimeException("Usuário não é um cliente válido");
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream()
                .peek(c -> c.atualizarStatusAutomatico())
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarPorStatus(EnumStatusCliente status) {
        return clienteRepository.findByStatus(status).stream()
                .peek(c -> c.atualizarStatusAutomatico())
                .map(this::toResponse).toList();
    }

    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.atualizarStatusAutomatico();
        return toResponse(clienteRepository.save(cliente));
    }

    @Transactional
    public void registrarAcesso(Long id){
        var cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.setUltimoAcesso(LocalDateTime.now());
        cliente.setUltimoLogin(LocalDateTime.now());
        if(cliente.getStatus() != EnumStatusCliente.EXCLUIDO){
            cliente.setStatus(EnumStatusCliente.ATIVO);
            cliente.setAtivo(true);
        }
        clienteRepository.save(cliente);
    }

    @Transactional
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

    public void registrarLogin(Long id) { registrarAcesso(id); }

    @Transactional
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