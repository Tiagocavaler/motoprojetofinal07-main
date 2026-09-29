package com.example.motoprojetofinal.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data                    // Cria Getters, Setters, toString, etc.
@NoArgsConstructor       // Cria Construtor vazio padrão
@AllArgsConstructor      // Cria Construtor com todos os campos
public class Produto {
    @Id
    private Integer id;
    private String nome;
    private String tipo;

    public void setNome(String nomeApi) {
    }

    public void setId(Integer idApi) {
    }

    public void setTipo(String tipoApi) {
    }
}
