import { renderSidebar } from "./sideBarComponent.js"
import { renderTablaCajero } from "./renderTables/renderTablePorPagar.js";
import { cargarPedidosCajero } from "../../SolicitudesAPI/gestionarPedidos.js";
import { verificarRol } from './verificarSesion.js';

async function verificarUsuario() {
    const rolRequerido = 'Cajero'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {

            renderSidebar('Cajero');
        
            try {
                const pedidos = await cargarPedidosCajero(); // Cargar solo los pedidos en estado 'Por pagar'
                const tabla = renderTablaCajero(pedidos); // Renderizar la tabla con la función específica para cajero
                const contenedor = document.querySelector('.table-container');
        
                if (contenedor) {
                    contenedor.innerHTML = '';
                    contenedor.appendChild(tabla);
                } else {
                    console.error('No se encontró el contenedor con la clase .table-container');
                }
            } catch (error) {
                console.error('Error al cargar los pedidos:', error);
            }
    }

}

document.addEventListener('DOMContentLoaded', verificarUsuario);

