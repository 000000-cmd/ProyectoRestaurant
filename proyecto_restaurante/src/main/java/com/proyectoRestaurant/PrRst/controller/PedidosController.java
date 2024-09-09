package com.proyectoRestaurant.PrRst.controller;


import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.awt.Desktop;

import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidosController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public Map<String, Object> addOrUpdatePedido(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> platos = (List<Map<String, Object>>) request.get("platos");
        Integer mesa = (Integer) request.get("mesa");

        // Verificar si ya existe un pedido para la mesa
        String checkPedidoSql = "SELECT COUNT(*) FROM pedidos WHERE mesa = ?";
        Integer pedidoExists = jdbcTemplate.queryForObject(checkPedidoSql, new Object[]{mesa}, Integer.class);

        try {
            // Si ya existe un pedido para la mesa, eliminarlo antes de insertar el nuevo
            if (pedidoExists > 0) {
                // Primero elimina los registros relacionados en contenido_pedidos
                String deleteContenidoSql = "DELETE FROM contenido_pedidos WHERE id_pedido = (SELECT id_pedido FROM pedidos WHERE mesa = ?)";
                jdbcTemplate.update(deleteContenidoSql, mesa);

                // Si también tienes detalles en detalle_pedido, elimina esos registros
                String deleteDetalleSql = "DELETE FROM detalle_pedido WHERE id_pedido = (SELECT id_pedido FROM pedidos WHERE mesa = ?)";
                jdbcTemplate.update(deleteDetalleSql, mesa);

                // Ahora elimina el pedido de la tabla pedidos
                String deletePedidoSql = "DELETE FROM pedidos WHERE mesa = ?";
                jdbcTemplate.update(deletePedidoSql, mesa);
            }

            // Insertar un nuevo pedido
            String insertPedidoSql = "INSERT INTO pedidos (mesa, estado_pedido) VALUES (?, 'En preparacion')";
            jdbcTemplate.update(insertPedidoSql, mesa);

            // Obtener el ID del pedido recién insertado
            Integer idPedido = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

            // Insertar contenido de pedido para cada plato
            for (Map<String, Object> plato : platos) {
                Integer idPlato = (Integer) plato.get("id_plato");
                Integer cantidadPlato = (Integer) plato.getOrDefault("cantidad_plato", 1);

                // Verificar si el plato existe en la tabla platos
                String checkPlatoSql = "SELECT COUNT(*) FROM platos WHERE id_plato = ?";
                Integer platoExists = jdbcTemplate.queryForObject(checkPlatoSql, new Object[]{idPlato}, Integer.class);

                if (platoExists == 0) {
                    response.put("status", "error");
                    response.put("message", "Plato con id " + idPlato + " no encontrado");
                    return response;
                }

                // Insertar en contenido_pedidos con referencia al pedido
                String insertContenidoSql = "INSERT INTO contenido_pedidos (id_pedido, id_plato, cantidad_plato) VALUES (?, ?, ?)";
                jdbcTemplate.update(insertContenidoSql, idPedido, idPlato, cantidadPlato);
            }

            // Manejar detalles de pedido si existen
            if (request.containsKey("detalles")) {
                List<Map<String, Object>> detalles = (List<Map<String, Object>>) request.get("detalles");

                for (Map<String, Object> detalle : detalles) {
                    Integer idPlatoDetalle = (Integer) detalle.get("id_plato");
                    Integer cantidadModificacion = (Integer) detalle.getOrDefault("cantidad_platos_modificacion", 1);
                    String detallesPlato = (String) detalle.get("detalles_plato");

                    // Insertar en detalle_pedido con referencia al pedido
                    String insertDetalleSql = "INSERT INTO detalle_pedido (id_pedido, id_plato, cantidad_platos_modificacion, detalles_plato) VALUES (?, ?, ?, ?)";
                    jdbcTemplate.update(insertDetalleSql, idPedido, idPlatoDetalle, cantidadModificacion, detallesPlato);
                }
            }

            response.put("status", "success");
            response.put("message", "Pedido agregado o actualizado exitosamente");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al agregar o actualizar el pedido: " + e.getMessage());
        }
        return response;
    }

    @PutMapping("/estado/{mesa}")
    public Map<String, Object> updateEstadoPedido(@PathVariable int mesa, @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        String nuevoEstado = (String) request.get("estado");

        // Validar que el estado sea uno de los permitidos
        List<String> estadosPermitidos = Arrays.asList("En preparacion", "Preparado", "Por pagar", "Completado");
        if (!estadosPermitidos.contains(nuevoEstado)) {
            response.put("status", "error");
            response.put("message", "Estado no válido");
            return response;
        }

        // Actualizar el estado del pedido en la base de datos usando la mesa
        String sql = "UPDATE pedidos SET estado_pedido = ? WHERE mesa = ?";
        try {
            int rowsAffected = jdbcTemplate.update(sql, nuevoEstado, mesa);
            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Estado del pedido actualizado");
            } else {
                response.put("status", "error");
                response.put("message", "Pedido no encontrado para la mesa " + mesa);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al actualizar el estado: " + e.getMessage());
        }
        return response;
    }

    @DeleteMapping("/completar/{mesa}")
    public Map<String, Object> completarPedido(@PathVariable int mesa) {
        Map<String, Object> response = new HashMap<>();

        // SQL para actualizar el estado del pedido a 'Completado'
        String updateEstadoSql = "UPDATE pedidos SET estado_pedido = 'Completado' WHERE mesa = ? AND estado_pedido = 'Por pagar'";

        // SQL para obtener los IDs de los pedidos que están en estado 'Completado'
        String selectPedidoIdsSql = "SELECT id_pedido FROM pedidos WHERE mesa = ? AND estado_pedido = 'Completado'";

        // SQL para mover el pedido a la tabla de histórico, con el ID del pedido como id_historico
        String moveHistoricoSql = "INSERT INTO historico_pedidos (id_historico, factura_pdf, fecha_hora_completado, mesa, total_facturado) " +
                "VALUES (?, ?, ?, ?, ?)";

        // SQL para insertar en ventas_detalles
        String moveVentasDetallesSql = "INSERT INTO ventas_detalles (id_historico, id_plato, cantidad_vendida, precio_unitario, subtotal) " +
                "VALUES (?, ?, ?, ?, ?)";

        // SQL para eliminar de la tabla pedidos
        String deletePedidoSql = "DELETE FROM pedidos WHERE id_pedido = ?";

        // SQL para eliminar los detalles asociados al pedido
        String deleteDetallesSql = "DELETE FROM detalle_pedido WHERE id_pedido = ?";

        // SQL para eliminar los contenidos asociados al pedido
        String deleteContenidosSql = "DELETE FROM contenido_pedidos WHERE id_pedido = ?";

        try {
            // Primero, intenta actualizar el estado del pedido a 'Completado'
            int updateCount = jdbcTemplate.update(updateEstadoSql, mesa);

            if (updateCount == 0) {
                response.put("status", "error");
                response.put("message", "No se encontraron pedidos 'Por pagar' para la mesa " + mesa);
                return response;
            }

            // Obtener los IDs de los pedidos para la mesa
            List<Integer> pedidoIds = jdbcTemplate.queryForList(selectPedidoIdsSql, Integer.class, mesa);

            if (pedidoIds.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No se pudo encontrar el ID del pedido para la mesa " + mesa);
                return response;
            }

            // Procesar cada pedido
            for (Integer pedidoId : pedidoIds) {
                // Obtener los detalles del pedido completo
                Map<String, Object> pedidoCompletoResponse = getPedidoCompletoPorMesa(mesa);
                Map<String, Object> pedidoCompleto = (Map<String, Object>) pedidoCompletoResponse.get("data");

                // Generar la factura PDF para el pedido
                byte[] facturaPdf = generarFacturaPdf(pedidoCompleto);

                // Fecha y hora actual para el campo fecha_hora_completado
                Timestamp fechaHoraCompletado = Timestamp.valueOf(LocalDateTime.now());

                // Inicializar el total facturado
                double totalFacturado = 0.0;

                // Procesar los contenidos para calcular el total
                List<Map<String, Object>> contenidos = (List<Map<String, Object>>) pedidoCompleto.get("contenidos");
                for (Map<String, Object> contenido : contenidos) {
                    int idPlato = (int) contenido.get("id_plato");
                    int cantidadVendida = (int) contenido.get("cantidad_plato");

                    // Obtener el precio del plato usando el método existente
                    Double precioUnitario = obtenerPrecioPlato(idPlato);
                    if (precioUnitario == null) {
                        response.put("status", "error");
                        response.put("message", "No se pudo obtener el precio para el plato con ID " + idPlato);
                        return response;
                    }

                    // Calcular el subtotal
                    double subtotal = cantidadVendida * precioUnitario;
                    totalFacturado += subtotal;
                }

                // Mover el pedido al histórico usando el id_pedido como id_historico
                int rowsAffected = jdbcTemplate.update(moveHistoricoSql, pedidoId, facturaPdf, fechaHoraCompletado, mesa, totalFacturado);

                if (rowsAffected > 0) {
                    // Insertar los detalles de las ventas en ventas_detalles
                    for (Map<String, Object> contenido : contenidos) {
                        int idPlato = (int) contenido.get("id_plato");
                        int cantidadVendida = (int) contenido.get("cantidad_plato");

                        // Obtener el precio del plato usando el método existente
                        Double precioUnitario = obtenerPrecioPlato(idPlato);
                        if (precioUnitario == null) {
                            response.put("status", "error");
                            response.put("message", "No se pudo obtener el precio para el plato con ID " + idPlato);
                            return response;
                        }

                        // Calcular el subtotal
                        double subtotal = cantidadVendida * precioUnitario;

                        // Insertar el detalle de la venta en ventas_detalles
                        jdbcTemplate.update(moveVentasDetallesSql,
                                pedidoId,
                                idPlato,
                                cantidadVendida,
                                precioUnitario,
                                subtotal
                        );
                    }

                    // Eliminar los detalles y contenidos asociados al pedido utilizando la relación correcta
                    jdbcTemplate.update(deleteDetallesSql, pedidoId);
                    jdbcTemplate.update(deleteContenidosSql, pedidoId);

                    // Eliminar de la tabla pedidos
                    jdbcTemplate.update(deletePedidoSql, pedidoId);
                } else {
                    response.put("status", "error");
                    response.put("message", "Error al mover el pedido a histórico para la mesa " + mesa);
                    return response;
                }
            }

            response.put("status", "success");
            response.put("message", "Pedidos completados y movidos a histórico");

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al mover el pedido a histórico: " + e.getMessage());
            e.printStackTrace(); // Imprimir la traza completa del error en los logs para diagnóstico
        }
        return response;
    }




    private byte[] generarFacturaPdf(Map<String, Object> pedidoCompleto) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Configurar el formato para moneda en pesos colombianos
            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));

            // Título del Documento
            document.add(new Paragraph("Factura del Pedido"));
            document.add(new Paragraph("Mesa: " + pedidoCompleto.get("mesa")));
            document.add(new Paragraph("Estado: " + pedidoCompleto.get("estado_pedido")));
            document.add(new Paragraph(" ")); // Espacio

            // Sección 1: Resumen de Platos
            document.add(new Paragraph("Resumen de Platos"));
            PdfPTable tableResumen = new PdfPTable(4);
            tableResumen.addCell("Plato");
            tableResumen.addCell("Cantidad");
            tableResumen.addCell("Precio Unitario");
            tableResumen.addCell("Precio Total");

            List<Map<String, Object>> contenidos = (List<Map<String, Object>>) pedidoCompleto.get("contenidos");
            List<Map<String, Object>> detalles = (List<Map<String, Object>>) pedidoCompleto.get("detalles");

            double totalResumen = 0.0;
            Map<Integer, Double> preciosMap = new HashMap<>();

            for (Map<String, Object> contenido : contenidos) {
                int idPlato = (Integer) contenido.get("id_plato");
                String nombrePlato = (String) contenido.get("nombre_plato");
                int cantidadPlato = ((Number) contenido.get("cantidad_plato")).intValue();

                // Obtener el precio del plato desde la base de datos si no está en el mapa
                Double precioPlato = preciosMap.get(idPlato);
                if (precioPlato == null) {
                    precioPlato = obtenerPrecioPlato(idPlato);
                    if (precioPlato == null) {
                        throw new DocumentException("El precio del plato " + nombrePlato + " no está disponible.");
                    }
                    preciosMap.put(idPlato, precioPlato);
                }

                // Calcular total para el plato sin modificaciones
                double totalPlato = cantidadPlato * precioPlato;
                totalResumen += totalPlato;

                // Agregar los datos a la tabla de resumen con formato de moneda
                tableResumen.addCell(nombrePlato);
                tableResumen.addCell(String.valueOf(cantidadPlato));
                tableResumen.addCell(currencyFormatter.format(precioPlato));
                tableResumen.addCell(currencyFormatter.format(totalPlato));
            }

            document.add(tableResumen);
            document.add(new Paragraph(" ")); // Espacio

            // Sección 2: Detalle Individual por Plato
            document.add(new Paragraph("Detalle Individual por Plato"));
            PdfPTable tableDetalles = new PdfPTable(5);
            tableDetalles.addCell("Plato");
            tableDetalles.addCell("Modificación");
            tableDetalles.addCell("Cantidad");
            tableDetalles.addCell("Precio Unitario");
            tableDetalles.addCell("Precio Final");

            // Contabilizar las cantidades de platos para evitar duplicaciones
            Map<Integer, Integer> cantidadSinModificaciones = new HashMap<>();
            for (Map<String, Object> contenido : contenidos) {
                int idPlato = (Integer) contenido.get("id_plato");
                cantidadSinModificaciones.put(idPlato, ((Number) contenido.get("cantidad_plato")).intValue());
            }

            // Procesar detalles para restar de los platos sin modificaciones
            if (detalles != null) {
                for (Map<String, Object> detalle : detalles) {
                    int idPlatoDetalle = (Integer) detalle.get("id_plato");
                    String nombrePlato = (String) detalle.get("nombre_plato");
                    String detallesPlato = detalle.get("detalles_plato") != null ? (String) detalle.get("detalles_plato") : "Ninguna";
                    int cantidadModificacion = ((Number) detalle.get("cantidad_platos_modificacion")).intValue();

                    Double precioPlato = preciosMap.get(idPlatoDetalle);
                    if (precioPlato == null) {
                        throw new DocumentException("El precio del plato " + nombrePlato + " no está disponible.");
                    }

                    double precioFinal = cantidadModificacion * precioPlato;

                    // Actualizar cantidad sin modificaciones
                    cantidadSinModificaciones.put(idPlatoDetalle, cantidadSinModificaciones.get(idPlatoDetalle) - cantidadModificacion);

                    // Agregar los datos a la tabla de detalles con formato de moneda
                    tableDetalles.addCell(nombrePlato);
                    tableDetalles.addCell(detallesPlato);
                    tableDetalles.addCell(String.valueOf(cantidadModificacion));
                    tableDetalles.addCell(currencyFormatter.format(precioPlato));
                    tableDetalles.addCell(currencyFormatter.format(precioFinal));
                }
            }

            // Agregar los platos sin modificaciones restantes
            for (Map.Entry<Integer, Integer> entry : cantidadSinModificaciones.entrySet()) {
                int idPlato = entry.getKey();
                int cantidadRestante = entry.getValue();
                if (cantidadRestante > 0) {
                    String nombrePlato = contenidos.stream()
                            .filter(c -> c.get("id_plato").equals(idPlato))
                            .findFirst()
                            .map(c -> (String) c.get("nombre_plato"))
                            .orElse("Plato Desconocido");

                    Double precioPlato = preciosMap.get(idPlato);
                    double precioFinal = cantidadRestante * precioPlato;

                    // Agregar los datos a la tabla de detalles con formato de moneda
                    tableDetalles.addCell(nombrePlato);
                    tableDetalles.addCell("Ninguna");
                    tableDetalles.addCell(String.valueOf(cantidadRestante));
                    tableDetalles.addCell(currencyFormatter.format(precioPlato));
                    tableDetalles.addCell(currencyFormatter.format(precioFinal));
                }
            }

            document.add(tableDetalles);
            document.add(new Paragraph(" ")); // Espacio

            // Sección 3: Total del Pedido con formato de moneda
            document.add(new Paragraph("Total del Pedido: " + currencyFormatter.format(totalResumen)));

            document.close();
        } catch (Exception e) {
            throw new DocumentException("Error al generar la factura PDF: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    // Método auxiliar para obtener el precio de un plato desde la base de datos
    private Double obtenerPrecioPlato(int idPlato) {
        String sql = "SELECT precio FROM platos WHERE id_plato = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{idPlato}, Double.class);
        } catch (Exception e) {
            // Manejo del error si no se puede obtener el precio
            return null;
        }
    }



    @GetMapping("/historico-pedidos/pdf")
    public ResponseEntity<byte[]> getPdfByFechaHora(@RequestParam String fechaHoraCompletado) {
        try {
            String sql = "SELECT factura_pdf FROM historico_pedidos WHERE fecha_hora_completado = ?";
            byte[] pdfBytes = jdbcTemplate.queryForObject(sql, new Object[]{fechaHoraCompletado}, byte[].class);

            if (pdfBytes == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "factura.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/pedidoCompleto/{mesa}")
    public Map<String, Object> getPedidoCompletoPorMesa(@PathVariable int mesa) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Obtener la información del pedido usando la mesa
            String sqlPedido = "SELECT p.id_pedido, p.mesa, p.estado_pedido " +
                    "FROM pedidos p " +
                    "WHERE p.mesa = ?";
            List<Map<String, Object>> pedidos = jdbcTemplate.queryForList(sqlPedido, mesa);

            if (pedidos.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No se encontraron pedidos para la mesa " + mesa);
                return response;
            }

            Map<String, Object> pedidoCompleto = pedidos.get(0); // Asume un solo pedido por mesa

            // 2. Obtener todos los contenidos del pedido (platos) usando id_pedido
            String sqlContenidos = "SELECT cp.id_contenido_pedidos, cp.id_plato, pl.nombre_plato, cp.cantidad_plato " +
                    "FROM contenido_pedidos cp " +
                    "JOIN platos pl ON cp.id_plato = pl.id_plato " +
                    "WHERE cp.id_pedido IN (SELECT id_pedido FROM pedidos WHERE mesa = ?)";
            List<Map<String, Object>> contenidos = jdbcTemplate.queryForList(sqlContenidos, mesa);

            // Asegúrate de que se están recuperando todos los contenidos
            if (contenidos.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No se encontraron contenidos para la mesa " + mesa);
                return response;
            }

            pedidoCompleto.put("contenidos", contenidos);

            // 3. Obtener todos los detalles de los platos si existen usando id_pedido
            String sqlDetalles = "SELECT dp.id_detalle, dp.id_plato, pl.nombre_plato, dp.cantidad_platos_modificacion, dp.detalles_plato " +
                    "FROM detalle_pedido dp " +
                    "JOIN platos pl ON dp.id_plato = pl.id_plato " +
                    "WHERE dp.id_pedido IN (SELECT id_pedido FROM pedidos WHERE mesa = ?)";
            List<Map<String, Object>> detalles = jdbcTemplate.queryForList(sqlDetalles, mesa);

            // Asegúrate de que se están recuperando todos los detalles
            if (detalles.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No se encontraron detalles para la mesa " + mesa);
                return response;
            }

            pedidoCompleto.put("detalles", detalles);

            response.put("status", "success");
            response.put("data", pedidoCompleto);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener el pedido completo: " + e.getMessage());
        }
        return response;
    }


    @GetMapping("/estado/{mesa}") // Define que este método manejará solicitudes HTTP GET a la ruta "/estado/{mesa}".
    public Map<String, Object> getEstadoPedidoPorMesa(@PathVariable int mesa) { // Método para obtener el estado del pedido basado en la mesa.
        Map<String, Object> response = new HashMap<>(); // Mapa para almacenar y devolver la respuesta.

        String sql = "SELECT estado_pedido FROM pedidos WHERE mesa = ?"; // Consulta SQL para obtener el estado del pedido basado en la mesa.

        try {
            String estadoPedido = jdbcTemplate.queryForObject(sql, new Object[]{mesa}, String.class); // Ejecuta la consulta para obtener el estado del pedido.
            response.put("status", "success"); // Añade un estado de éxito en la respuesta.
            response.put("estado_pedido", estadoPedido); // Añade el estado del pedido en la respuesta.
        } catch (Exception e) { // Captura cualquier excepción que ocurra durante la ejecución.
            response.put("status", "error");
            response.put("message", "Error al obtener el estado del pedido para la mesa " + mesa + ": " + e.getMessage()); // Añade un mensaje de error con detalles en la respuesta.
        }
        return response; // Devuelve la respuesta.
    }


    // Obtener los contenidos y detalles de los platos por número de mesa
    @GetMapping("/platos-detalles/{mesa}") // Define que este método manejará solicitudes HTTP GET a la ruta "/platos-detalles/{mesa}".
    public Map<String, Object> getPlatosYDetallesPorMesa(@PathVariable int mesa) { // Método para obtener los contenidos y detalles de los platos basado en la mesa.
        Map<String, Object> response = new HashMap<>(); // Mapa para almacenar y devolver la respuesta.

        // Consulta para obtener los contenidos de los platos
        String sqlContenidos = "SELECT cp.id_contenido_pedidos, cp.id_plato, pl.nombre_plato, cp.cantidad_plato " +
                "FROM contenido_pedidos cp " +
                "JOIN platos pl ON cp.id_plato = pl.id_plato " +
                "WHERE cp.id_contenido_pedidos IN (SELECT id_contenido_pedido FROM pedidos WHERE mesa = ?)"; // Consulta SQL para obtener los contenidos de los platos.

        // Consulta para obtener los detalles (modificaciones) de los platos
        String sqlDetalles = "SELECT dp.id_detalle, dp.id_plato, pl.nombre_plato, dp.cantidad_platos_modificacion, dp.detalles_plato " +
                "FROM detalle_pedido dp " +
                "JOIN platos pl ON dp.id_plato = pl.id_plato " +
                "WHERE dp.id_detalle IN (SELECT id_detalle_pedido FROM pedidos WHERE mesa = ?)"; // Consulta SQL para obtener los detalles de los platos.

        try {
            // Ejecutar consultas para obtener contenidos y detalles
            List<Map<String, Object>> contenidos = jdbcTemplate.queryForList(sqlContenidos, mesa); // Ejecuta la consulta para obtener los contenidos de los platos.
            List<Map<String, Object>> detalles = jdbcTemplate.queryForList(sqlDetalles, mesa); // Ejecuta la consulta para obtener los detalles de los platos.

            // Combinar resultados en la respuesta
            Map<String, Object> resultado = new HashMap<>(); // Crea un mapa para almacenar los resultados combinados.
            resultado.put("contenidos", contenidos); // Añade los contenidos al resultado.
            resultado.put("detalles", detalles); // Añade los detalles al resultado.

            response.put("status", "success"); // Añade un estado de éxito en la respuesta.
            response.put("data", resultado); // Añade los datos combinados de contenidos y detalles en la respuesta.
        } catch (Exception e) { // Captura cualquier excepción que ocurra durante la ejecución.
            response.put("status", "error");
            response.put("message", "Error al obtener los platos y detalles para la mesa " + mesa + ": " + e.getMessage()); // Añade un mensaje de error con detalles en la respuesta.
        }
        return response; // Devuelve la respuesta.
    }

    @GetMapping("/todos-pedidos")
    public Map<String, Object> getTodosPedidosCompletos() {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Obtener todas las mesas con pedidos
            String sqlMesas = "SELECT DISTINCT mesa FROM pedidos";
            List<Integer> mesas = jdbcTemplate.queryForList(sqlMesas, Integer.class);

            if (mesas.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No se encontraron pedidos");
                return response;
            }

            // Lista para almacenar todos los pedidos completos
            List<Map<String, Object>> pedidosCompletos = new ArrayList<>();

            // 2. Iterar sobre cada mesa y usar el método existente para obtener el pedido completo
            for (Integer mesa : mesas) {
                Map<String, Object> pedidoCompleto = getPedidoCompletoPorMesa(mesa);

                // Verificar si la respuesta fue exitosa y agregar solo los pedidos completos
                if ("success".equals(pedidoCompleto.get("status"))) {
                    pedidosCompletos.add((Map<String, Object>) pedidoCompleto.get("data"));
                } else {
                    // Si algún pedido no se pudo obtener, agregar un mensaje de error específico para esa mesa
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("mesa", mesa);
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "No se pudo obtener el pedido para la mesa " + mesa);
                    pedidosCompletos.add(errorResponse);
                }
            }

            response.put("status", "success");
            response.put("data", pedidosCompletos);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al obtener todos los pedidos completos: " + e.getMessage());
        }
        return response;
    }

}
