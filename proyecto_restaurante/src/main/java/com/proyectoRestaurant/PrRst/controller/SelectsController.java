package com.proyectoRestaurant.PrRst.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/selects")
public class SelectsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Agregar una nueva categoría
    @PostMapping("/categorias")
    public Map<String, Object> addCategoria(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        String categoria = (String) request.get("categoria");

        // Validar que la categoría no esté vacía
        if (categoria == null || categoria.trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "La categoría no puede estar vacía");
            return response;
        }

        String sql = "INSERT INTO platos_categorias (categoria) VALUES (?)";
        try {
            int rowsAffected = jdbcTemplate.update(sql, categoria);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Categoría agregada exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Error al agregar la categoría");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al agregar la categoría: " + e.getMessage());
        }
        return response;
    }

    // Obtener todas las categorías
    @GetMapping("/categorias")
    public Map<String, Object> getAllCategorias() {
        Map<String, Object> response = new HashMap<>();
        String sql = "SELECT * FROM platos_categorias";

        try {
            List<Map<String, Object>> categorias = jdbcTemplate.queryForList(sql);
            response.put("status", "success");
            response.put("data", categorias);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener las categorías: " + e.getMessage());
        }
        return response;
    }

    // Obtener una categoría por ID
    @GetMapping("/categorias/{id}")
    public Map<String, Object> getCategoriaById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        String sql = "SELECT * FROM platos_categorias WHERE id_categoria = ?";

        try {
            List<Map<String, Object>> categoria = jdbcTemplate.queryForList(sql, id);
            if (categoria.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Categoría no encontrada");
            } else {
                response.put("status", "success");
                response.put("data", categoria.get(0));
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener la categoría: " + e.getMessage());
        }
        return response;
    }

    // Actualizar una categoría existente
    @PutMapping("/categorias/{id}")
    public Map<String, Object> updateCategoria(@PathVariable int id, @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        String categoria = (String) request.get("categoria");

        // Validar que la categoría no esté vacía
        if (categoria == null || categoria.trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "La categoría no puede estar vacía");
            return response;
        }

        String sql = "UPDATE platos_categorias SET categoria = ? WHERE id_categoria = ?";
        try {
            int rowsAffected = jdbcTemplate.update(sql, categoria, id);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Categoría actualizada exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Categoría no encontrada");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al actualizar la categoría: " + e.getMessage());
        }
        return response;
    }

    // Eliminar una categoría existente
    @DeleteMapping("/categorias/{id}")
    public Map<String, Object> deleteCategoria(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        String sql = "DELETE FROM platos_categorias WHERE id_categoria = ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql, id);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Categoría eliminada exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Categoría no encontrada");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al eliminar la categoría: " + e.getMessage());
        }
        return response;
    }

    // Obtener el ID de una categoría por nombre aproximado
    @GetMapping("/categorias/buscar")
    public Map<String, Object> getCategoriaByNombre(@RequestParam String nombre) {
        Map<String, Object> response = new HashMap<>();
        String sql = "SELECT id_categoria, categoria FROM platos_categorias WHERE categoria LIKE ?";

        try {
            List<Map<String, Object>> categorias = jdbcTemplate.queryForList(sql, "%" + nombre + "%");
            if (categorias.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No se encontraron categorías que coincidan con el nombre: " + nombre);
            } else {
                response.put("status", "success");
                response.put("data", categorias);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al buscar la categoría: " + e.getMessage());
        }
        return response;
    }

    // Aquí puedes agregar otros métodos para otras tablas que proporcionen opciones para selects
}

