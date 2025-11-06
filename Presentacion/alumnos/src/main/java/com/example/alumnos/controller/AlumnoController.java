package com.example.alumnos.controller;

import com.example.alumnos.model.Alumno;
import com.example.alumnos.services.AlumnoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@Tag(name = "API de Alumnos", description = "Gestión de alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @Operation(summary = "Obtener todos los alumnos")
    @GetMapping
    public List<Alumno> obtenerTodos() {
        return alumnoService.obtenerTodosLosAlumnos();
    }

    @Operation(summary = "Obtener un alumno por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Alumno encontrado"),
            @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Alumno> obtenerPorId(
            @Parameter(description = "ID del alumno a buscar") @PathVariable Long id) {
        return alumnoService.obtenerAlumnoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear un nuevo alumno")
    @PostMapping
    public ResponseEntity<Alumno> crearAlumno(@RequestBody Alumno alumno) {
        Alumno nuevoAlumno = alumnoService.guardarAlumno(alumno);
        return new ResponseEntity<>(nuevoAlumno, HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar un alumno existente")
    @PutMapping("/{id}")
    public ResponseEntity<Alumno> actualizarAlumno(
            @Parameter(description = "ID del alumno a actualizar") @PathVariable Long id,
            @RequestBody Alumno alumno) {
        Alumno alumnoActualizado = alumnoService.actualizarAlumno(id, alumno);
        if (alumnoActualizado != null) {
            return ResponseEntity.ok(alumnoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar un alumno por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAlumno(
            @Parameter(description = "ID del alumno a eliminar") @PathVariable Long id) {
        alumnoService.eliminarAlumno(id);
        return ResponseEntity.noContent().build();
    }
}