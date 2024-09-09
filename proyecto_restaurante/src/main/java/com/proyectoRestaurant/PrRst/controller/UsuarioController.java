package com.proyectoRestaurant.PrRst.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    // Inyección de dependencia de JdbcTemplate para ejecutar consultas SQL
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Obtener todos los usuarios
    @GetMapping
    public Map<String, Object> getAllUsuarios() {
        String sql = "SELECT * FROM usuarios";
        List<Map<String, Object>> usuarios = jdbcTemplate.queryForList(sql);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", usuarios);
        return response;
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public Map<String, Object> getUsuarioById(@PathVariable int id) {
        String sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> usuario = jdbcTemplate.queryForMap(sql, id);
            response.put("status", "success");
            response.put("data", usuario);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Usuario no encontrado");
        }
        return response;
    }

    // Crear un nuevo usuario
    @PostMapping
    public Map<String, Object> createUsuario(@RequestBody Map<String, Object> request) {
        String nombreUsuario = (String) request.get("nombre_usuario");
        String rol = (String) request.get("rol");
        String password = (String) request.get("password");

        String sql = "INSERT INTO usuarios (nombre_usuario, rol, password) VALUES (?, ?, ?)";
        Map<String, Object> response = new HashMap<>();
        try {
            int rowsAffected = jdbcTemplate.update(sql, nombreUsuario, rol, password);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Usuario creado exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Error al crear el usuario");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al crear el usuario: " + e.getMessage());
        }
        return response;
    }

    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public Map<String, Object> updateUsuario(@PathVariable int id, @RequestBody Map<String, Object> request) {
        String nombreUsuario = (String) request.get("nombre_usuario");
        String rol = (String) request.get("rol");
        String password = (String) request.get("password");

        String sql = "UPDATE usuarios SET nombre_usuario = ?, rol = ?, password = ? WHERE id_usuario = ?";
        Map<String, Object> response = new HashMap<>();
        try {
            int rowsAffected = jdbcTemplate.update(sql, nombreUsuario, rol, password, id);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Usuario actualizado exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Error al actualizar el usuario");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al actualizar el usuario: " + e.getMessage());
        }
        return response;
    }

    // Eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUsuario(@PathVariable int id) {
        String sql = "DELETE FROM usuarios WHERE id_usuario = ?";
        Map<String, Object> response = new HashMap<>();
        try {
            int rowsAffected = jdbcTemplate.update(sql, id);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Usuario eliminado exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Error al eliminar el usuario");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar el usuario: " + e.getMessage());
        }
        return response;
    }


    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String username, @RequestParam String password) {
        String sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND password = ?";
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> usuario = jdbcTemplate.queryForMap(sql, username, password);
            response.put("status", "success");
            response.put("message", "Login exitoso");
            response.put("data", usuario);
        } catch (EmptyResultDataAccessException e) {
            response.put("status", "error");
            response.put("message", "Nombre de usuario o contraseña incorrectos");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al intentar iniciar sesión: " + e.getMessage());
        }
        return response;
    }
}
