package com.proyectoRestaurant.PrRst.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/platos")
public class PlatosController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Agregar un nuevo plato con todos los datos obligatorios
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Map<String, Object> addPlato(@RequestParam("nombre_plato") String nombrePlato,
                                        @RequestParam("descripcion") String descripcion,
                                        @RequestParam("precio") BigDecimal precio,
                                        @RequestParam("disponibilidad") String disponibilidad,
                                        @RequestParam("id_categoria") Integer idCategoria,
                                        @RequestParam(value = "img_plato", required = false) MultipartFile imgPlato) {
        Map<String, Object> response = new HashMap<>();

        // Validar que la disponibilidad sea correcta
        List<String> disponibilidadPermitida = Arrays.asList("Disponible", "No Disponible");
        if (!disponibilidadPermitida.contains(disponibilidad)) {
            response.put("status", "error");
            response.put("message", "Disponibilidad no válida");
            return response;
        }

        // Preparar la consulta SQL para insertar el plato
        String sql = "INSERT INTO platos (nombre_plato, descripcion, precio, disponibilidad, id_categoria, img_plato) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            // Obtener los bytes de la imagen si se proporciona
            byte[] imagenBytes = imgPlato != null ? imgPlato.getBytes() : null;

            // Ejecutar la inserción
            int rowsAffected = jdbcTemplate.update(sql, nombrePlato, descripcion, precio, disponibilidad, idCategoria, imagenBytes);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Plato agregado exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Error al agregar el plato");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al agregar el plato: " + e.getMessage());
        }
        return response;
    }


// Modificar un plato existente con todos los datos obligatorios
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Map<String, Object> updatePlato(@PathVariable int id,
                                           @RequestParam("nombre_plato") String nombrePlato,
                                           @RequestParam("descripcion") String descripcion,
                                           @RequestParam("precio") BigDecimal precio,
                                           @RequestParam("disponibilidad") String disponibilidad,
                                           @RequestParam("id_categoria") Integer idCategoria,
                                           @RequestParam(value = "img_plato", required = false) MultipartFile imgPlato) {
        Map<String, Object> response = new HashMap<>();

        // Validar que la disponibilidad sea correcta
        List<String> disponibilidadPermitida = Arrays.asList("Disponible", "No Disponible");
        if (!disponibilidadPermitida.contains(disponibilidad)) {
            response.put("status", "error");
            response.put("message", "Disponibilidad no válida");
            return response;
        }

        // Preparar la consulta SQL para actualizar el plato
        String sql = "UPDATE platos SET nombre_plato = ?, descripcion = ?, precio = ?, disponibilidad = ?, id_categoria = ?, img_plato = ? WHERE id_plato = ?";

        try {
            // Obtener los bytes de la imagen si se proporciona
            byte[] imagenBytes = imgPlato != null ? imgPlato.getBytes() : null;

            // Ejecutar la actualización
            int rowsAffected = jdbcTemplate.update(sql, nombrePlato, descripcion, precio, disponibilidad, idCategoria, imagenBytes, id);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Plato actualizado exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Plato no encontrado");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al actualizar el plato: " + e.getMessage());
        }
        return response;
    }

    // Eliminar un plato existente
    @DeleteMapping("/{id}") // Define que este método manejará solicitudes HTTP DELETE a la ruta "/platos/{id}".
    public Map<String, Object> deletePlato(@PathVariable int id) { // Método para eliminar un plato basado en su ID.
        Map<String, Object> response = new HashMap<>(); // Mapa para almacenar y devolver la respuesta.

        String sql = "DELETE FROM platos WHERE id_plato = ?"; // Consulta SQL para eliminar un plato.

        try {
            int rowsAffected = jdbcTemplate.update(sql, id); // Ejecuta la consulta para eliminar el plato.
            if (rowsAffected > 0) { // Verifica si la eliminación fue exitosa.
                response.put("status", "success");
                response.put("message", "Plato eliminado exitosamente");
            } else {
                response.put("status", "error");
                response.put("message", "Plato no encontrado");
            }
        } catch (Exception e) { // Captura cualquier excepción que ocurra durante la ejecución.
            response.put("status", "error");
            response.put("message", "Error al eliminar el plato: " + e.getMessage()); // Añade un mensaje de error con detalles en la respuesta.
        }
        return response; // Devuelve la respuesta.
    }

    // Obtener todos los platos
    @GetMapping // Define que este método manejará solicitudes HTTP GET a la ruta "/platos".
    public Map<String, Object> getAllPlatos() { // Método para obtener todos los platos.
        Map<String, Object> response = new HashMap<>(); // Mapa para almacenar y devolver la respuesta.

        String sql = """
                        SELECT *,
                               ptc.categoria
                        FROM platos pt
                            INNER JOIN platos_categorias ptc ON pt.id_categoria = ptc.id_categoria"""; // Consulta SQL para obtener todos los platos.

        try {
            List<Map<String, Object>> platos = jdbcTemplate.queryForList(sql); // Ejecuta la consulta para obtener la lista de platos.
            response.put("status", "success"); // Añade un estado de éxito en la respuesta.
            response.put("data", platos); // Añade la lista de platos en la respuesta.
        } catch (Exception e) { // Captura cualquier excepción que ocurra durante la ejecución.
            response.put("status", "error"); // Añade un estado de error en la respuesta.
            response.put("message", "Error al obtener los platos: " + e.getMessage()); // Añade un mensaje de error con detalles en la respuesta.
        }
        return response; // Devuelve la respuesta.
    }

    // Obtener un plato por nombre con búsqueda aproximada
    @GetMapping("/buscar") // Define que este método manejará solicitudes HTTP GET a la ruta "/platos/buscar".
    public Map<String, Object> getPlatoByNombre(@RequestParam String nombre) { // Método para obtener un plato basado en un nombre aproximado.
        Map<String, Object> response = new HashMap<>(); // Mapa para almacenar y devolver la respuesta.

        String sql = "SELECT * FROM platos WHERE nombre_plato LIKE ?"; // Consulta SQL para buscar platos por nombre con coincidencias aproximadas.

        try {
            List<Map<String, Object>> platos = jdbcTemplate.queryForList(sql, "%" + nombre + "%"); // Ejecuta la consulta con un patrón de búsqueda para coincidencias aproximadas.
            if (platos.isEmpty()) { // Verifica si no se encontraron platos.
                response.put("status", "error");
                response.put("message", "No se encontraron platos que coincidan con el nombre: " + nombre);
            } else {
                response.put("status", "success"); // Añade un estado de éxito en la respuesta.
                response.put("data", platos); // Añade los platos encontrados en la respuesta.
            }
        } catch (Exception e) { // Captura cualquier excepción que ocurra durante la ejecución.
            response.put("status", "error"); // Añade un estado de error en la respuesta.
            response.put("message", "Error al buscar el plato: " + e.getMessage()); // Añade un mensaje de error con detalles en la respuesta.
        }
        return response; // Devuelve la respuesta.
    }

    @GetMapping("/{id}")
    public Map<String, Object> getPlatoById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();

        String sql = """
                     SELECT pt.id_plato, 
                            pt.nombre_plato, 
                            pt.descripcion, 
                            pt.precio, 
                            pt.disponibilidad, 
                            ptc.categoria, 
                            pt.img_plato 
                     FROM platos pt
                     LEFT JOIN platos_categorias ptc ON pt.id_categoria = ptc.id_categoria
                     WHERE pt.id_plato = ?
                     """;

        try {
            List<Map<String, Object>> platos = jdbcTemplate.queryForList(sql, id);

            if (platos.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Plato no encontrado con ID: " + id);
            } else {
                response.put("status", "success");
                response.put("data", platos.get(0)); // Retorna el primer (y único) resultado
            }

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener el plato: " + e.getMessage());
        }

        return response;
    }
}
