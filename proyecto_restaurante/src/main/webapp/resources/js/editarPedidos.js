import { cargarPedidosMesero } from "../../SolicitudesAPI/gestionarPedidos.js"
import { renderSidebar } from "./sideBarComponent.js"
import { renderTablaEditarPedidos } from "./renderTables/renderEditarPedidos.js";

document.addEventListener("DOMContentLoaded", async () => {
    const pedidos = await cargarPedidosMesero();
    console.log(pedidos);

    const tabla = await renderTablaEditarPedidos(pedidos);
    const contenedor = document.querySelector('.table-container');
    if (contenedor) {
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    } else {
        console.error('No se encontró el contenedor con la clase .table-container');
    }

    // Agregar Event Listeners a los botones "Editar Pedido"
    const editarButtons = document.querySelectorAll('button[edit-pedido]');
    editarButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mesaId = button.getAttribute('edit-pedido'); // Obtiene el ID del pedido
            if (mesaId) {
                // Redireccionar a newOrder.html con el ID del pedido como parámetro
                window.location.href = `newOrder.html?id=${mesaId}`;
            }
        });
    });
});
