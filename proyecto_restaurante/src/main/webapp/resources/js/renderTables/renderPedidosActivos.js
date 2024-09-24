// Función para crear una fila de la tabla
function crearFila(pedido) {
    // Crear una fila
    const fila = document.createElement('tr');

    // Crear y agregar celda para Mesa
    const celdaMesa = document.createElement('td');
    celdaMesa.textContent = pedido.mesa;
    fila.appendChild(celdaMesa);

    // Crear y agregar celda para Estado con clase dinámica
    const celdaEstado = document.createElement('td');
    const estadoDiv = document.createElement('div');
    estadoDiv.textContent = pedido.estado_pedido;

    // Normalizar el texto del estado para evitar discrepancias
    const estadoNormalizado = pedido.estado_pedido;
    console.log(estadoNormalizado);
    

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

    return fila;
}

// Exportar la función para ser usada en dashboard.js
export function TablaDinamica(pedidos) {
    // Crear la tabla y sus secciones
    const tabla = document.createElement('table');
    tabla.className = 'tabla';

    const thead = document.createElement('thead');
    const encabezadoFila = document.createElement('tr');

    // Crear encabezados de la tabla
    const encabezadoMesa = document.createElement('th');
    encabezadoMesa.textContent = 'Mesa';
    encabezadoFila.appendChild(encabezadoMesa);

    const encabezadoEstado = document.createElement('th');
    encabezadoEstado.textContent = 'Estado';
    encabezadoFila.appendChild(encabezadoEstado);

    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');

    // Agregar filas al cuerpo de la tabla
    if (pedidos.length>0){
        pedidos.forEach(pedido => {
            const fila = crearFila(pedido);
            tbody.appendChild(fila);
        });
    }else{
        console.log("¡No hay pedidos pendientes");
        const texto= document.createElement('h2')
        texto.classList.add("textoTablaVacia")
        texto.textContent="No hay pedidos pendientes"
        tbody.appendChild(texto)
    }


    tabla.appendChild(tbody);

    return tabla;
}

