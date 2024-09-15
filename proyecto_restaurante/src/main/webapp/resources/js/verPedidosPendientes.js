import { renderSidebar } from "./sideBarComponent.js"
import { renderTablaPendientes } from "./renderTables/renderTablePendientes.js";
import { cargarPedidosChef } from "../../SolicitudesAPI/gestionarPedidos.js";


document.addEventListener("DOMContentLoaded", async () => {
    renderSidebar('Chef');
    const pedidos = await cargarPedidosChef();
    const tabla = renderTablaPendientes(pedidos);
    const contenedor = document.querySelector('.table-container');

    if (contenedor) {
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    } else {
        console.error('No se encontró el contenedor con la clase .table-container');
    }
});