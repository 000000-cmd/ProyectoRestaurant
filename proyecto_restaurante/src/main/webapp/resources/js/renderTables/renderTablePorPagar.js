// Función para crear una fila de la tabla
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

    // Botón Facturar
    const facturarBtn = document.createElement('button');
    facturarBtn.classList.add('primary_button');
    facturarBtn.textContent = 'Facturar';

    // Añadir el evento para redirigir a 'facturar.html' pasando la mesa asociada
    facturarBtn.onclick = () => {
        // Redirige a facturar.html y pasa el número de mesa como parámetro
        window.location.href = `facturar.html?mesa=${pedido.mesa}`;
    };

    accionesTd.appendChild(facturarBtn);
    fila.appendChild(accionesTd);

    return fila;
}

// Función para renderizar la tabla de pedidos para el cajero
export function renderTablaCajero(pedidos) {
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
    if(pedidos.length>0){
        pedidos.forEach(pedido => {
            const fila = crearFila(pedido);
            tbody.appendChild(fila);
        });
    }else{
        console.log("¡No hay pedidos por pagar");
        const texto= document.createElement('h2')
        texto.classList.add("textoTablaVacia")
        texto.textContent="No hay pedidos por pagar. ¡Buscalos!"
        tbody.appendChild(texto)
    }
  

    tabla.appendChild(tbody);

    return tabla;
}
