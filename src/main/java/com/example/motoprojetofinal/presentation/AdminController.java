package com.example.motoprojetofinal.presentation;

import com.example.motoprojetofinal.application.dtos.AdminRequestDTO;
import com.example.motoprojetofinal.application.dtos.AdminResponseDTO;
import com.example.motoprojetofinal.application.services.AdminService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    public ResponseEntity<AdminResponseDTO> criarAdmin(@RequestBody AdminRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.criarAdmin(dto));
    }
}