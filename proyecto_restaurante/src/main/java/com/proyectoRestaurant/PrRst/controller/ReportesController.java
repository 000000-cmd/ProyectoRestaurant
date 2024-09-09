package com.proyectoRestaurant.PrRst.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/reportes")
public class ReportesController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Reporte de ventas diarias
    @GetMapping("/diario")
    public Map<String, Object> reporteDiario(@RequestParam String fecha) {
        Map<String, Object> reporte = generarReporte(fecha, fecha);
        reporte.put("fecha", fecha); // Mostrar la fecha específica
        return reporte;
    }

    // Reporte de ventas mensuales
    @GetMapping("/mensual")
    public Map<String, Object> reporteMensual(@RequestParam String fecha) {
        String mesInicio = fecha + "-01";
        String mesFin = LocalDate.parse(mesInicio).withDayOfMonth(LocalDate.parse(mesInicio).lengthOfMonth()).toString();
        Map<String, Object> reporte = generarReporte(mesInicio, mesFin);
        reporte.put("mes", fecha); // Mostrar el mes al que se refiere
        reporte.put("rango", mesInicio + " al " + mesFin); // Mostrar el rango de fechas del mes
        return reporte;
    }

    // Reporte de ventas semanales
    @GetMapping("/semanal")
    public Map<String, Object> reporteSemanal(@RequestParam String fecha) {
        LocalDate endDate = LocalDate.parse(fecha);
        LocalDate startDate = endDate.minusDays(6); // Incluye los 6 días anteriores más el día actual
        Map<String, Object> reporte = generarReporte(startDate.toString(), endDate.toString());
        reporte.put("rango", startDate + " al " + endDate); // Mostrar el rango semanal
        return reporte;
    }

    // Método para generar los reportes basado en el rango de fechas
    private Map<String, Object> generarReporte(String fechaInicio, String fechaFin) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Consulta para obtener el total de ventas y el total recaudado en el rango de fechas
            String sqlTotalVentas = """
                SELECT COUNT(*) as total_ventas, COALESCE(SUM(total_facturado), 0) as total_recaudo
                FROM historico_pedidos
                WHERE DATE(fecha_hora_completado) BETWEEN ? AND ?
                """;

            Map<String, Object> totalVentasRecaudo = jdbcTemplate.queryForMap(sqlTotalVentas, fechaInicio, fechaFin);

            // Consulta para obtener los tres platos más vendidos y la cantidad vendida en el rango de fechas
            String sqlPlatosMasVendidos = """
                SELECT p.nombre_plato, pc.categoria, SUM(vd.cantidad_vendida) as cantidad_vendida
                FROM ventas_detalles vd
                JOIN platos p ON vd.id_plato = p.id_plato
                JOIN platos_categorias pc ON p.id_categoria = pc.id_categoria
                JOIN historico_pedidos hp ON vd.id_historico = hp.id_historico
                WHERE DATE(hp.fecha_hora_completado) BETWEEN ? AND ?
                GROUP BY p.nombre_plato, pc.categoria
                ORDER BY cantidad_vendida DESC
                LIMIT 3
                """;

            List<Map<String, Object>> platosMasVendidos = jdbcTemplate.queryForList(sqlPlatosMasVendidos, fechaInicio, fechaFin);

            // Consulta para obtener el total recaudado por cada plato específico en el rango de fechas
            // Incluye todos los platos incluso si no han sido vendidos
            String sqlRecaudoPorTipoPlato = """
                SELECT p.nombre_plato, pc.categoria, COALESCE(SUM(vd.subtotal), 0) as total_recaudo
                FROM platos p
                LEFT JOIN ventas_detalles vd ON vd.id_plato = p.id_plato
                LEFT JOIN historico_pedidos hp ON vd.id_historico = hp.id_historico AND DATE(hp.fecha_hora_completado) BETWEEN ? AND ?
                JOIN platos_categorias pc ON p.id_categoria = pc.id_categoria
                GROUP BY p.nombre_plato, pc.categoria
                """;

            List<Map<String, Object>> recaudoPorTipoPlato = jdbcTemplate.queryForList(sqlRecaudoPorTipoPlato, fechaInicio, fechaFin);

            // Consulta para obtener el total recaudado por cada tipo de categoría de plato en el rango de fechas
            String sqlRecaudoPorCategoria = """
                SELECT pc.categoria, SUM(vd.subtotal) as total_recaudo
                FROM ventas_detalles vd
                JOIN platos p ON vd.id_plato = p.id_plato
                JOIN platos_categorias pc ON p.id_categoria = pc.id_categoria
                JOIN historico_pedidos hp ON vd.id_historico = hp.id_historico
                WHERE DATE(hp.fecha_hora_completado) BETWEEN ? AND ?
                GROUP BY pc.categoria
                """;

            List<Map<String, Object>> recaudoPorCategoria = jdbcTemplate.queryForList(sqlRecaudoPorCategoria, fechaInicio, fechaFin);

            // Manejar correctamente los resultados nulos y construir la respuesta
            response.put("total_ventas", totalVentasRecaudo.getOrDefault("total_ventas", 0));
            response.put("total_recaudo", totalVentasRecaudo.getOrDefault("total_recaudo", 0));
            response.put("platos_mas_vendidos", platosMasVendidos.isEmpty() ? "No hay datos disponibles" : platosMasVendidos);
            response.put("recaudo_por_tipo_plato", recaudoPorTipoPlato.isEmpty() ? "No hay datos disponibles" : recaudoPorTipoPlato);
            response.put("total_recaudo_por_categoria", recaudoPorCategoria.isEmpty() ? "No hay datos disponibles" : recaudoPorCategoria);
            response.put("status", "success");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al generar el reporte: " + e.getMessage());
        }
        return response;
    }
}



