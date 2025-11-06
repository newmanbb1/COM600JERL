package com.practica.compras.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public Queue notificacionesQueue() {
        return new Queue("notificaciones_queue", true); // durable=true
    }
}