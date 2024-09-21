import { renderSidebar } from "./sideBarComponent.js"
import { renderTablaPendientes } from "./renderTables/renderTablePendientes.js";
import { cargarPedidosChef } from "../../SolicitudesAPI/gestionarPedidos.js";
import { cambiarEstado } from "../../../SolicitudesAPI/gestionarPedidos.js";
async function verificarUsuario() {
    const rolRequerido = 'Chef'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
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
        
        
            const entregarButtons = document.querySelectorAll('button[change-estado]');
            entregarButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const mesaId = button.getAttribute('change-estado'); // Obtiene el ID del pedido
                    if (mesaId) {
                        console.log(mesaId);
                        const result = cambiarEstado(mesaId, 'Preparado')
                        if (result) {
                            alert("Pedido Preparado")
                            const fila = document.querySelector(`[data-mesa="${mesaId}"]`);
                            fila.remove();
                        }
                    }
                });
            });
        
        
        });



    }
}

verificarUsuario();

