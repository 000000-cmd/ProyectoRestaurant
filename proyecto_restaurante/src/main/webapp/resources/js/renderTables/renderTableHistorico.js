// Función para crear una fila de la tabla de histórico de pedidos
function crearFilaHistorico(pedido) {
    // Crear una fila
    const fila = document.createElement('tr');

    // Crear y agregar celda para ID Histórico
    const celdaIdHistorico = document.createElement('td');
    celdaIdHistorico.textContent = pedido.id_historico;
    fila.appendChild(celdaIdHistorico);

    // Crear y agregar celda para Fecha y Hora Completado
    const celdaFechaHora = document.createElement('td');
    celdaFechaHora.textContent = new Date(pedido.fecha_hora_completado).toLocaleString('es-CO'); // Formato de fecha
    fila.appendChild(celdaFechaHora);

    // Crear y agregar celda para Mesa
    const celdaMesa = document.createElement('td');
    celdaMesa.textContent = pedido.mesa;
    fila.appendChild(celdaMesa);

    // Crear y agregar celda para Total Facturado con formato de miles y millones
    const celdaTotal = document.createElement('td');
    if (pedido.total_facturado !== undefined) {
        // Asegurarse de que el total facturado sea un número antes de formatear
        const totalFacturado = Number(pedido.total_facturado);
        celdaTotal.textContent = `$${totalFacturado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
        celdaTotal.textContent = 'N/A'; // Manejar caso de total facturado no disponible
    }
    fila.appendChild(celdaTotal);

    // Crear y agregar celda para el botón de abrir PDF
    const celdaAccion = document.createElement('td');
    const botonPdf = document.createElement('button');
    botonPdf.classList.add('primary_button');
    botonPdf.textContent = 'Abrir PDF';
    botonPdf.onclick = () => {
        // Utilizar el blob directamente y abrirlo en una nueva pestaña
        const blob = pedido.factura_pdf; // Utilizar el blob directamente
        const url = URL.createObjectURL(blob);
        window.open(url);
    };
    celdaAccion.appendChild(botonPdf);
    fila.appendChild(celdaAccion);

    return fila;
}

// Exportar la función para renderizar la tabla de histórico de pedidos
export function renderizarTablaHistoricoPedidos(pedidos) {
    // Crear la tabla y sus secciones
    const tabla = document.createElement('table');
    tabla.className = 'tabla';

    const thead = document.createElement('thead');
    const encabezadoFila = document.createElement('tr');

    // Crear encabezados de la tabla
    const encabezadoIdHistorico = document.createElement('th');
    encabezadoIdHistorico.textContent = 'ID Histórico';
    encabezadoFila.appendChild(encabezadoIdHistorico);

    const encabezadoFechaHora = document.createElement('th');
    encabezadoFechaHora.textContent = 'Fecha y Hora Completado';
    encabezadoFila.appendChild(encabezadoFechaHora);

    const encabezadoMesa = document.createElement('th');
    encabezadoMesa.textContent = 'Mesa';
    encabezadoFila.appendChild(encabezadoMesa);

    const encabezadoTotal = document.createElement('th');
    encabezadoTotal.textContent = 'Total Facturado';
    encabezadoFila.appendChild(encabezadoTotal);

    const encabezadoAccion = document.createElement('th');
    encabezadoAccion.textContent = 'Acciones';
    encabezadoFila.appendChild(encabezadoAccion);

    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');

    // Agregar filas al cuerpo de la tabla
    pedidos.forEach(pedido => {
        const fila = crearFilaHistorico(pedido);
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    return tabla;
}


