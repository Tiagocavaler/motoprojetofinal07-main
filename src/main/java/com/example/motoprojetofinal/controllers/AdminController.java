package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.dtos.AdminRequestDTO;
import com.example.motoprojetofinal.dtos.AdminResponseDTO;
import com.example.motoprojetofinal.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    public ResponseEntity<AdminResponseDTO> criarAdmin(@RequestBody AdminRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.criarAdmin(dto));
    }
}