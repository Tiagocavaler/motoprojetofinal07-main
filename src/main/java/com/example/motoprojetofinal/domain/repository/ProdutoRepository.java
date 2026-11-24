package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato para buscar e salvar Produto.
 * Ex: listar todos, buscar por nome, salvar produto vindo da API externa.
 * POR QUE EXISTE: O Domain define o que precisa, a Infra implementa com JPA.
 */

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Usado no modo offline: professor apaga Supabase e você ainda lista
    List<Produto> findByAtivoNaLojaTrue();

    List<Produto> findByAtivoNaLojaTrueOrderByNomeAsc();

    // Para o sync: pega só o que foi criado offline e ainda não foi pro Supabase
    List<Produto> findBySincronizadoFalse();

    // Para ignorar repetido: se já tem produto com mesmo nome, ignora o mais novo
    boolean existsByNomeIgnoreCase(String nome);

    // Busca por tipo pra sua tela de filtro
    List<Produto> findByTipoAndAtivoNaLojaTrue(String tipo);
}