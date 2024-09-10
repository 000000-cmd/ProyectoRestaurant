import { renderSidebar } from "./sideBarComponent.js";
import { TablaDinamica } from "./renderTables/renderPedidosActivos.js";
import { mostrarPlatosMasVendidos } from "./masOrdenadoComponent.js"; // Importa correctamente
import { mostrarReporte } from "./reportComponent.js"; // Asegúrate de importar esta función correctamente
import { cargarPedidos } from "../../SolicitudesAPI/gestionarPedidos.js";


// Función para cargar y mostrar la tabla en el contenedor
async function mostrarTablaEnDashboard() {
    const pedidos = await cargarPedidos();
    const tabla = TablaDinamica(pedidos);
    const contenedor = document.querySelector('.table-container');
    if (contenedor) {
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    } else {
        console.error('No se encontró el contenedor con la clase .table-container');
    }
}

// Función para mostrar el reporte dentro del contenedor del gráfico
async function mostrarReporteEnDashboard() {
    const contenedorGrafico = document.querySelector('#chart');
    if (contenedorGrafico) {
        await mostrarReporte('mensual', '2024-09');
    } else {
        console.error('No se encontró el contenedor con el id #chart');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(); // Renderizar la barra lateral
    mostrarTablaEnDashboard(); // Mostrar la tabla de pedidos
    mostrarReporteEnDashboard(); // Mostrar el reporte en el gráfico
    mostrarPlatosMasVendidos('mensual', '2024-09'); // Llama a la función para mostrar los platos más vendidos
});


