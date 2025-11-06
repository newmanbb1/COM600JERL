package com.practica.compras.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document("compras")
public class Compra {
    @Id
    private String id;
    private String usuarioId;
    private String eventoId;
    private int cantidad;
    private double total;
    private EstadoCompra estado;
    private LocalDateTime fechaCreacion;

    public Compra(String usuarioId, String eventoId, int cantidad, double total) {
        this.usuarioId = usuarioId;
        this.eventoId = eventoId;
        this.cantidad = cantidad;
        this.total = total;
        this.estado = EstadoCompra.PENDIENTE;
        this.fechaCreacion = LocalDateTime.now();
    }
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsuarioId() { return usuarioId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
    public String getEventoId() { return eventoId; }
    public void setEventoId(String eventoId) { this.eventoId = eventoId; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public EstadoCompra getEstado() { return estado; }
    public void setEstado(EstadoCompra estado) { this.estado = estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}