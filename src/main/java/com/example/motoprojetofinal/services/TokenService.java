package com.example.motoprojetofinal.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.example.motoprojetofinal.entities.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret:moto-chave-super-secreta-precisa-ter-no-minimo-32-caracteres-123456}")
    private String secret;

    @Value("${api.security.token.expiracao:1440}")
    private Long expiracao;

    @Value("${api.security.token.emissor:moto-api}")
    private String emissor;

    // METODO QUE O AuthService USA
    public String gerarToken(Usuario usuario){
        return gerarToken(usuario.getEmail());
    }

    public String gerarToken(String subject){
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer(emissor)
                    .withSubject(subject)
                    .withExpiresAt(getDataExpiracao())
                    .sign(algorithm);

        }catch (Exception e){
            throw new RuntimeException("Erro ao gerar token: " + e.getMessage(), e);
        }
    }

    public String getSubject(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(emissor)
                    .build();
            DecodedJWT decoded = verifier.verify(token);
            return decoded.getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Token inválido ou expirado");
        }
    }

    public DecodedJWT verificarToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verificador = JWT.require(algorithm).withIssuer(emissor).build();
        return verificador.verify(token);
    }

    private Instant getDataExpiracao(){
        var dataAtual = LocalDateTime.now();
        var dataFutura = dataAtual.plusMinutes(expiracao);
        return dataFutura.toInstant(ZoneOffset.of("-03:00"));
    }
}