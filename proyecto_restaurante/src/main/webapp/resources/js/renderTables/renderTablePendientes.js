import { cambiarEstado } from "../../../SolicitudesAPI/gestionarPedidos.js";



function crearFila(pedido) {
    // Crear una fila
    const fila = document.createElement('tr');

    // Crear y agregar celda para Mesa
    const celdaMesa = document.createElement('td');
    celdaMesa.textContent = pedido.mesa;
    fila.appendChild(celdaMesa);

    // Crear y agregar celda para el menú
    const celdaMenu = document.createElement('td');

    if (pedido.contenidos.length > 0) {
        pedido.contenidos.forEach(element => {
            celdaMenu.textContent += `${element.nombre_plato}, `;
        });
        // Elimina la última coma y espacio agregado
        celdaMenu.textContent = celdaMenu.textContent.slice(0, -2);
    } else {
        celdaMenu.textContent = "*Menu Vacio*";
    }
    fila.appendChild(celdaMenu);

    // Crear la celda para los botones de acción
    const accionesTd = document.createElement('td');

    // Botón Ver Pedido
    const verPedidoBtn = document.createElement('button');
    verPedidoBtn.classList.add('primary_button');
    verPedidoBtn.setAttribute("onclick", `window.location.href='verPedido.html?id-mesa=${pedido.mesa}'`);
    verPedidoBtn.textContent = 'Ver pedido';
    accionesTd.appendChild(verPedidoBtn);

    // Botón Marcar Para Entregar
    const marcarEntregarBtn = document.createElement('button');
    marcarEntregarBtn.classList.add('secundary_button');
    marcarEntregarBtn.textContent = 'Marcar Para Entregar';

    // Añadir el evento para cambiar el estado del pedido
    marcarEntregarBtn.onclick = () => {
        cambiarEstado(pedido.mesa, 'Preparado') // Llama a la función con la mesa y el estado 'Preparado'
            .then(response => {
                console.log(`Pedido de la mesa ${pedido.mesa} marcado como preparado.`, response);
                // Aquí podrías agregar lógica adicional, como actualizar la tabla o mostrar una notificación
            })
            .catch(error => {
                console.error(`Error al marcar el pedido de la mesa ${pedido.mesa} como preparado:`, error);
                alert(`Error al marcar el pedido como preparado: ${error.message}`);
            });
    };

    accionesTd.appendChild(marcarEntregarBtn);
    fila.appendChild(accionesTd);

    return fila;
}

export function renderTablaPendientes(pedidos) {
    const tabla = document.createElement('table');
    tabla.className = 'tabla';

    const thead = document.createElement('thead');
    const encabezadoFila = document.createElement('tr');

    // Crear encabezados de la tabla
    const encabezadoMesa = document.createElement('th');
    encabezadoMesa.textContent = 'Mesa';
    encabezadoFila.appendChild(encabezadoMesa);

    const encabezadoMenu = document.createElement('th');
    encabezadoMenu.textContent = 'Menu';
    encabezadoFila.appendChild(encabezadoMenu);

    const encabezadoAcciones = document.createElement('th');
    encabezadoAcciones.textContent = 'Acciones';
    encabezadoFila.appendChild(encabezadoAcciones);
    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);
    
    const tbody = document.createElement('tbody');

    pedidos.forEach(pedido => {
        const fila = crearFila(pedido);
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    return tabla;
}