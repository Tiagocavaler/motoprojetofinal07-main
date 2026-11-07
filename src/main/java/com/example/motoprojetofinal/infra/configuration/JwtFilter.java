package com.example.motoprojetofinal.infra.configuration;

import com.example.motoprojetofinal.application.services.TokenService;
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
        String method = request.getMethod();

        // 1. Libera TUDO do front herdado + API publica + preflight
        if (method.equals("OPTIONS") ||
                uri.equals("/") ||
                uri.equals("/index.html") ||
                uri.equals("/favicon.ico") ||
                uri.startsWith("/_next") ||
                uri.startsWith("/assets") ||
                uri.startsWith("/static") ||
                uri.startsWith("/home") ||
                uri.startsWith("/armas") ||
                uri.startsWith("/armaduras") ||
                uri.startsWith("/perfil") ||
                uri.startsWith("/produto") ||
                uri.startsWith("/carrinho") ||
                uri.startsWith("/checkout") ||
                uri.startsWith("/login") ||
                uri.startsWith("/swagger-ui") ||
                uri.startsWith("/v3/api-docs") ||
                uri.startsWith("/swagger-resources") ||
                uri.startsWith("/webjars") ||
                uri.startsWith("/h2-console") ||
                uri.startsWith("/auth") ||
                uri.startsWith("/usuarios") ||
                uri.endsWith(".js") ||
                uri.endsWith(".css") ||
                uri.endsWith(".png") ||
                uri.endsWith(".jpg") ||
                uri.endsWith(".jpeg") ||
                uri.endsWith(".webp") ||
                uri.endsWith(".svg") ||
                uri.endsWith(".woff") ||
                uri.endsWith(".woff2") ||
                uri.endsWith(".ico") ||
                uri.equals("/error")) {
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
            } catch (Exception e) {
                // IMPORTANTE: devolve 401 COM CORS, senão o front dá NetworkError
                response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin") != null ? request.getHeader("Origin") : "*");
                response.setHeader("Access-Control-Allow-Credentials", "true");
                response.setHeader("Access-Control-Allow-Methods", "*");
                response.setHeader("Access-Control-Allow-Headers", "*");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\":\"Token invalido: " + e.getMessage().replace("\"", "") + "\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}