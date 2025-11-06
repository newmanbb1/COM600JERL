package com.example.alumnos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Data // Genera automáticamente getters, setters, toString, etc. con Lombok
@NoArgsConstructor // Genera un constructor sin argumentos
@Schema(description = "Modelo de datos que representa a un Alumno")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del alumno", example = "1")
    private Long id;

    @Schema(description = "Nombre del alumno", required = true, example = "Juan")
    private String nombre;

    @Schema(description = "Apellido del alumno", required = true, example = "Pérez")
    private String apellido;

    @Schema(description = "Edad del alumno", example = "21")
    private int edad;
}
