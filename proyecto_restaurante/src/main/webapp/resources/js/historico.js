import { renderSidebar } from "./sideBarComponent.js";
import { obtenerHistoricoPedidos } from "../../SolicitudesAPI/traerHistorico.js";
import { renderizarTablaHistoricoPedidos } from "./renderTables/renderTableHistorico.js";


document.addEventListener("DOMContentLoaded", async () => {
    renderSidebar('Administrador');

    // Obtiene los datos de los pedidos
    const pedidos = await obtenerHistoricoPedidos();

    // Verifica si se obtuvieron los pedidos correctamente
    if (pedidos) {
        // Formatear el total facturado para cada pedido antes de renderizar la tabla
        pedidos.forEach(pedido => {
            // Asegurarse de que el total_facturado sea un número y luego formatearlo
            if (pedido.total_facturado !== undefined) {
                // Convertir a número si es necesario y formatear
                const totalFacturado = Number(pedido.total_facturado);
                pedido.total_facturado_formateado = `$${totalFacturado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        });

        // Llama a la función para renderizar la tabla y la inserta en el DOM
        const tabla = renderizarTablaHistoricoPedidos(pedidos);
        document.getElementById('tablaContainer').appendChild(tabla); // Asegúrate de tener un contenedor en tu HTML con este ID
    } else {
        console.error('No se pudieron obtener los pedidos');
    }
});