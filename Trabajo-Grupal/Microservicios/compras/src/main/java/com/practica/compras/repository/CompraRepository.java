package com.practica.compras.repository;

import com.practica.compras.model.Compra;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CompraRepository extends MongoRepository<Compra, String> {
    List<Compra> findByUsuarioId(String usuarioId);
}