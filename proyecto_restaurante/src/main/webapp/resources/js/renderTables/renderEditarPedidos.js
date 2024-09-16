import { obtenerPlatoPorId } from "../../../SolicitudesAPI/gestionarPlatos.js";


export async function renderTablaEditarPedidos(pedidos){
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
    
    const totalApagar = document.createElement('th');
    totalApagar.textContent = 'Total A Pagar';
    encabezadoFila.appendChild(totalApagar);

    const encabezadoAcciones = document.createElement('th');
    encabezadoAcciones.textContent = 'Acciones';
    encabezadoFila.appendChild(encabezadoAcciones);
    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    if(pedidos.length>0){
        for (const pedido of pedidos) {
            const fila = await crearFila(pedido); // Espera a que la fila sea creada
            tbody.appendChild(fila);
        }
    }else{
        console.log("¡No hay pedidos pendientes");
        const texto= document.createElement('h2')
        texto.classList.add("textoTablaVacia")
        texto.textContent="No hay pedidos por editar. Que raro o.0?"
        tbody.appendChild(texto)
    }

    tabla.appendChild(tbody);

    return tabla;
}

// Función para crear una fila de la tabla
async function crearFila(pedido) {
    console.log(pedido);
    
    // Crear una fila
    const fila = document.createElement('tr');

    // Crear y agregar celda para Mesa
    const celdaMesa = document.createElement('td');
    celdaMesa.textContent = pedido.mesa;
    fila.appendChild(celdaMesa);

    // Crear y agregar celda para Estado con clase dinámica
    const celdaMenu = document.createElement('td');    
    if (pedido.contenidos.length > 0) {
        pedido.contenidos.forEach(element => {
            console.log(element.nombre_plato);
            celdaMenu.textContent += `${element.nombre_plato}, `;
        });
        // Elimina la última coma y espacio agregado
        celdaMenu.textContent = celdaMenu.textContent.slice(0, -2);
        fila.appendChild(celdaMenu);
    } else {
        celdaMenu.textContent = "*Menu Vacio*";
        fila.appendChild(celdaMenu);
    }


    // Crear la celda para el total y calcular el precio acumulado
    const celdaTotal = document.createElement('td');
    let precioAcumulado = 0;

    // Usa un bucle for...of para manejar await dentro de las iteraciones
    for (const plato of pedido.contenidos) {
        console.log(plato.id_plato);
        const objetoPlato = await obtenerObjetoPlato(plato.id_plato); // Maneja la promesa correctamente
        console.log(objetoPlato);
        if (objetoPlato && objetoPlato.precio) {
            precioAcumulado += objetoPlato.precio * plato.cantidad_plato; // Asegúrate de que precio esté definido
        }
    }

    celdaTotal.textContent = `$${precioAcumulado.toFixed(2)}`; // Formatea el total a dos decimales
    fila.appendChild(celdaTotal);


    // Crea la celda para los botones de acción
    const accionesTd = document.createElement('td');
    // Botón Editar
    const editarBtn = document.createElement('button');
    editarBtn.classList.add('primary_button');
    editarBtn.setAttribute("edit-pedido", `mesa${pedido.mesa}`);
    editarBtn.textContent = 'Editar Pedido';
    accionesTd.appendChild(editarBtn);

    // Botón Eliminar
    const eliminarBtn = document.createElement('button');
    eliminarBtn.classList.add('secundary_button');
    eliminarBtn.setAttribute("eliminar-pedido",`mesa${pedido.mesa}`)
    eliminarBtn.textContent = 'Eliminar Pedido';
    accionesTd.appendChild(eliminarBtn);

    // Añade la celda de acciones a la fila

    fila.appendChild(accionesTd);
    return fila;
}

async function obtenerObjetoPlato(id) {
    return await obtenerPlatoPorId(id);
}
