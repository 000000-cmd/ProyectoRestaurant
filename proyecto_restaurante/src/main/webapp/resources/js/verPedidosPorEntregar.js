import { cambiarEstado, cargarPedidosMesero } from "../../SolicitudesAPI/gestionarPedidos.js"
import { renderSidebar } from "./sideBarComponent.js"
import { renderTablaEditarPedidos } from "./renderTables/renderEditarPedidos.js";
import { renderPedidosPorEntregar } from "./renderTables/renderPedidosPorEntregar.js";

document.addEventListener("DOMContentLoaded", async () => {
    renderSidebar("Mesero");

    const pedidos = await cargarPedidosMesero();
    console.log(pedidos);

    const tabla = await renderPedidosPorEntregar(pedidos);
    const contenedor = document.querySelector('.table-container');
    if (contenedor) {
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    } else {
        console.error('No se encontró el contenedor con la clase .table-container');
    }

    // Agregar Event Listeners a los botones "Editar Pedido"
    const editarButtons = document.querySelectorAll('button[change-estado]');
    editarButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mesaId = button.getAttribute('change-estado'); // Obtiene el ID del pedido
            if (mesaId) {
                console.log(mesaId);
                cambiarEstado(mesaId,'Por pagar')
                // Redireccionar a newOrder.html con el ID del pedido como parámetro
            }
        });
    });
});
