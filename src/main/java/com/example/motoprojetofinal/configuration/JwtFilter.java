package com.example.motoprojetofinal.configuration;

import com.example.motoprojetofinal.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        // ROTAS PUBLICAS - libera sem checar token
        if(uri.startsWith("/swagger-ui")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-resources")
                || uri.startsWith("/webjars")
                || uri.startsWith("/auth")
                || uri.startsWith("/login")
                || uri.startsWith("/usuarios")
                || uri.startsWith("/admin")){
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            try {
                var jwtValidado = tokenService.verificarToken(token);
                var authentication = new UsernamePasswordAuthenticationToken(
                        jwtValidado.getSubject(), null, Collections.emptyList()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Token OK: " + jwtValidado.getSubject());
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().println("Token invalido: " + e.getMessage());
                return;
            }
        }
        // Se não tem token e não é rota pública, deixa o Spring decidir (vai dar 403/401)
        filterChain.doFilter(request, response);
    }
}