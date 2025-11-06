package com.practica.compras.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.practica.compras.model.Compra;
import com.practica.compras.model.EstadoCompra;
import com.practica.compras.repository.CompraRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CompraService {
    private final CompraRepository compraRepository;
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${eventos.service.url}")
    private String eventosServiceUrl;

    public CompraService(CompraRepository compraRepository, RabbitTemplate rabbitTemplate) {
        this.compraRepository = compraRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.restTemplate = new RestTemplate();
    }

    public Compra crearCompra(String usuarioId, String eventoId, int cantidad, String token) {
        System.out.println("Iniciando creación de compra para evento: " + eventoId);
        String urlVerificacion = eventosServiceUrl + "/eventos/" + eventoId + "/verificar-disponibilidad";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Integer> body = Map.of("cantidad", cantidad);
        HttpEntity<Map<String, Integer>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> respuestaEventos = restTemplate.exchange(urlVerificacion, HttpMethod.POST, requestEntity, Map.class);
            Map<String, Object> datosEvento = respuestaEventos.getBody();

            if (datosEvento == null || !(boolean) datosEvento.get("disponible")) {
                throw new RuntimeException("Entradas no disponibles.");
            }

            double precioUnitario = ((Number) datosEvento.get("precio_unitario")).doubleValue();
            double total = cantidad * precioUnitario;
            
            Compra compra = new Compra(usuarioId, eventoId, cantidad, total);
            System.out.println("Compra creada en estado PENDIENTE.");
            return compraRepository.save(compra);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error del servicio de eventos: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("No se pudo conectar con el servicio de eventos: " + e.getMessage());
        }
    }

    public Optional<Compra> confirmarPago(String id, String token) {
        Optional<Compra> compraOpt = compraRepository.findById(id);
        if (compraOpt.isPresent()) {
            Compra compra = compraOpt.get();
            if (compra.getEstado() == EstadoCompra.PAGADA) {
                System.out.println("La compra ya estaba pagada.");
                return compraOpt;
            }
            compra.setEstado(EstadoCompra.PAGADA);

            String urlActualizar = eventosServiceUrl + "/eventos/" + compra.getEventoId() + "/actualizar-vendidas";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Integer> body = Map.of("cantidad", compra.getCantidad());
            HttpEntity<Map<String, Integer>> requestEntity = new HttpEntity<>(body, headers);

            try {
                restTemplate.exchange(urlActualizar, HttpMethod.POST, requestEntity, Void.class);
                System.out.println("Inventario actualizado en servicio de eventos.");
            } catch (Exception e) {
                System.err.println("Error al actualizar inventario: " + e.getMessage());
                // En un sistema real, se debería revertir el pago o marcarlo para revisión.
            }

            try {
                String emailUsuario = "admin@tuempresa.com"; // Simulado, se obtendría del token o servicio de usuarios
                String nombreEvento = "Evento ID: " + compra.getEventoId();

                Map<String, Object> notificacion = Map.of(
                        "emailUsuario", emailUsuario,
                        "nombreEvento", nombreEvento,
                        "cantidadEntradas", compra.getCantidad()
                );
                
                String mensajeJson = objectMapper.writeValueAsString(notificacion);
                rabbitTemplate.convertAndSend("notificaciones_queue", mensajeJson);
                System.out.println("Mensaje de notificación enviado a RabbitMQ.");
            } catch (Exception e) {
                System.err.println("Error al enviar mensaje a RabbitMQ: " + e.getMessage());
            }
            
            return Optional.of(compraRepository.save(compra));
        }
        return Optional.empty();
    }

    public List<Compra> listarComprasUsuario(String usuarioId) {
        return compraRepository.findByUsuarioId(usuarioId);
    }
}