package com.example.motoprojetofinal.domain.entities;

/**
 * CAMADA: Domain / Enum
 * O QUE FAZ: Lista os únicos perfis possíveis de um Usuario:
 * ADMINISTRADOR e CLIENTE.
 * POR QUE EXISTE: É usado pelo Spring Security para decidir quem pode
 * acessar o que. Ex: só ADMINISTRADOR pode cadastrar produto.
 * No token JWT vai como "ROLE_ADMINISTRADOR".
 */

public enum Role {
    CLIENTE,
    ADMINISTRADOR
}