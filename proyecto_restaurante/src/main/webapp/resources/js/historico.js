import { renderSidebar } from "./sideBarComponent.js";
import { obtenerHistoricoPedidos } from "../../SolicitudesAPI/traerHistorico.js";
import { renderizarTablaHistoricoPedidos } from "./renderTables/renderTableHistorico.js";



document.addEventListener("DOMContentLoaded", async ()=>{
    renderSidebar();
    // Obtiene los datos de los pedidos
    const pedidos = await obtenerHistoricoPedidos();

    // Verifica si se obtuvieron los pedidos correctamente
    if (pedidos) { 
        // Llama a la función para renderizar la tabla y la inserta en el DOM
        const tabla = renderizarTablaHistoricoPedidos (pedidos)
        document.getElementById('tablaContainer').appendChild(tabla); // Asegúrate de tener un contenedor en tu HTML con este ID
    } else {
        console.error('No se pudieron obtener los pedidos');
    }
})