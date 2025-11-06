package com.practica.compras.controller;

import com.practica.compras.model.Compra;
import com.practica.compras.service.CompraService;
import com.practica.compras.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <-- ESTA ES LA LÍNEA QUE FALTABA

@RestController
@RequestMapping("/compras")

public class CompraController {
    private final CompraService compraService;
    private final JwtUtil jwtUtil;

    public CompraController(CompraService compraService, JwtUtil jwtUtil) {
        this.compraService = compraService;
        this.jwtUtil = jwtUtil;
    }

    public static class CompraRequest {
        private String eventoId;
        private int cantidad;
        // Getters y Setters
        public String getEventoId() { return eventoId; }
        public void setEventoId(String eventoId) { this.eventoId = eventoId; }
        public int getCantidad() { return cantidad; }
        public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    }

    @PostMapping
    public ResponseEntity<?> crearCompra(
            @RequestHeader("Authorization") String token,
            @RequestBody CompraRequest request) {
        try {
            String usuarioId = jwtUtil.extractUserId(token);
            Compra compra = compraService.crearCompra(usuarioId, request.getEventoId(), request.getCantidad(), token);
            return ResponseEntity.ok(compra);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<?> confirmarPago(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        return compraService.confirmarPago(id, token)
                .map(compra -> ResponseEntity.ok(compra))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Compra>> listarCompras(@RequestHeader("Authorization") String token) {
        String usuarioId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(compraService.listarComprasUsuario(usuarioId));
    }
}