package com.example.motoprojetofinal.application.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.net.InetSocketAddress;
import java.net.Socket;

@Slf4j
@Service
@RequiredArgsConstructor
public class SyncService {

    private final ProdutoSyncService produtoSyncService;
    private final ClienteService clienteService;

    public boolean temInternet() {
        try (Socket s = new Socket()) {
            s.connect(new InetSocketAddress("8.8.8.8", 53), 1500);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void sincronizarSeOnline() {
        if (!temInternet()) {
            log.info("Offline - usando H2 local ./localdb/");
            return;
        }
        log.info("Online - sincronizando tudo...");
        try {
            clienteService.sincronizarClientesPendentes();
            produtoSyncService.sincronizar();
            log.info("Sync geral OK!");
        } catch (Exception e) {
            log.error("Sync falhou, continua offline no H2: {}", e.getMessage());
        }
    }
}