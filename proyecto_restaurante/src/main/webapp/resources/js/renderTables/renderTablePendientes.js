import { cambiarEstado } from "../../../SolicitudesAPI/gestionarPedidos.js";

function crearFila(pedido) {
    // Crear una fila
    const fila = document.createElement('tr');
    fila.setAttribute("data-mesa", pedido.mesa);

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

    // Crear y agregar celda para Estado con clase dinámica
    const celdaEstado = document.createElement('td');
    const estadoDiv = document.createElement('div');
    estadoDiv.textContent = pedido.estado_pedido;

    // Normalizar el texto del estado para evitar discrepancias
    const estadoNormalizado = pedido.estado_pedido;
    console.log(estadoNormalizado);

    // Asignar clase según el estado del pedido
    switch (estadoNormalizado) {
        case 'Completado':
            estadoDiv.className = 'status_order complete';
            break;
        case 'Por pagar':
            estadoDiv.className = 'status_order porpargar';
            break;
        case 'En preparacion':
            estadoDiv.className = 'status_order preparacion';
            break;
        case 'Preparado':
            estadoDiv.className = 'status_order pendiente';
            break;
        case 'En espera':  // Nuevo estado "En espera"
            estadoDiv.className = 'status_order espera';
            break;
        default:
            console.warn(`Estado no reconocido: ${pedido.estado_pedido}`);
            estadoDiv.className = 'status_order'; // Clase genérica si no coincide
    }

    celdaEstado.appendChild(estadoDiv);
    fila.appendChild(celdaEstado);

    // Crear la celda para los botones de acción
    const accionesTd = document.createElement('td');

    // Botón Ver Pedido
    const verPedidoBtn = document.createElement('button');
    verPedidoBtn.classList.add('primary_button');
    verPedidoBtn.onclick = async () => {
        if (await cambiarEstado(pedido.mesa, 'En preparacion')) {
            window.location.href = `verPedido.html?id-mesa=${pedido.mesa}`;
        } else {
            alert('No se pudo cambiar el estado de la pagina');
        }
    };
    verPedidoBtn.textContent = 'Ver pedido';
    accionesTd.appendChild(verPedidoBtn);

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
    encabezadoMenu.textContent = 'Menú';
    encabezadoFila.appendChild(encabezadoMenu);

    const encabezadoEstado = document.createElement('th');
    encabezadoEstado.textContent = 'Estado';  // Nuevo encabezado para Estado
    encabezadoFila.appendChild(encabezadoEstado);

    const encabezadoAcciones = document.createElement('th');
    encabezadoAcciones.textContent = 'Acciones';
    encabezadoFila.appendChild(encabezadoAcciones);

    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    if (pedidos.length > 0) {
        pedidos.forEach(pedido => {
            const fila = crearFila(pedido);
            tbody.appendChild(fila);
        });
    } else {
        console.log("¡No hay pedidos pendientes!");
        const texto = document.createElement('h2');
        texto.classList.add("textoTablaVacia");
        texto.textContent = "No hay pedidos pendientes. Espera a algún cliente :)";
        tbody.appendChild(texto);
    }

    tabla.appendChild(tbody);

    return tabla;
}
