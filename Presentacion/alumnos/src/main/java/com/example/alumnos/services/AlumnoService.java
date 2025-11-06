package com.example.alumnos.services;

import com.example.alumnos.model.Alumno;
import com.example.alumnos.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    public List<Alumno> obtenerTodosLosAlumnos() {
        return alumnoRepository.findAll();
    }

    public Optional<Alumno> obtenerAlumnoPorId(Long id) {
        return alumnoRepository.findById(id);
    }

    public Alumno guardarAlumno(Alumno alumno) {
        return alumnoRepository.save(alumno);
    }

    public Alumno actualizarAlumno(Long id, Alumno alumnoActualizado) {
        return alumnoRepository.findById(id)
                .map(alumno -> {
                    alumno.setNombre(alumnoActualizado.getNombre());
                    alumno.setApellido(alumnoActualizado.getApellido());
                    alumno.setEdad(alumnoActualizado.getEdad());
                    return alumnoRepository.save(alumno);
                }).orElse(null); // O lanzar una excepción
    }

    public void eliminarAlumno(Long id) {
        alumnoRepository.deleteById(id);
    }
}