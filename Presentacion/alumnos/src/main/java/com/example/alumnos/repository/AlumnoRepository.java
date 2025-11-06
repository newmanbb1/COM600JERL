package com.example.alumnos.repository;

import com.example.alumnos.model.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    // Spring Data JPA implementará automáticamente los métodos CRUD:
    // save(), findById(), findAll(), deleteById(), etc.
}