import { URLs } from "./URL.js";

// Función para cargar los pedidos desde la API
async function cargarPedidos() {
    try {
        const response = await fetch(`${URLs}/pedidos/todos-pedidos`);
        const data = await response.json();

        if (data.status !== 'success') {
            console.error('Error al obtener los pedidos:', data.message);
            return [];
        }

        // Retornar los pedidos completos
        return data.data;

    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        return [];
    }
}

export async function cargarPedidosChef() {
    const pedidos = await cargarPedidos();
    console.log('Pedidos cargados:', pedidos);
    
    // Filtrar por estado 'En preparacion' en lugar de 'Por preparar'
    const pedidosPorPreparar = pedidos.filter(pedido => pedido.estado_pedido === 'En preparacion');
    console.log('Pedidos en estado "En preparacion":', pedidosPorPreparar.map(({ estado_pedido, ...resto }) => resto));
    
    return pedidosPorPreparar.map(({ estado_pedido, ...resto }) => resto);
}

export async function cargarPedidosCajero() {
    const pedidos = await cargarPedidos();
    console.log('Pedidos cargados:', pedidos);
    
    // Filtrar por estado 'Por pagar'
    const pedidosPorPagar = pedidos.filter(pedido => pedido.estado_pedido === 'Por pagar');
    console.log('Pedidos en estado "Por pagar":', pedidosPorPagar.map(({ estado_pedido, ...resto }) => resto));
    
    return pedidosPorPagar.map(({ estado_pedido, ...resto }) => resto);
}

/*cargarPedidosMesero
cargarPedidosChef
CargarPedidoCaja
CargarPedidoAdmin*/

// Función que carga y filtra los pedidos para retornar solo id_pedido, estado_pedido, y mesa
export async function cargarPedidoAdmin() {
    const pedidos = await cargarPedidos();
    return pedidos.map(({ id_pedido, estado_pedido, mesa }) => ({
        id_pedido,
        estado_pedido,
        mesa
    }));
}


export async function cargarPedidosMesero() {
    const pedidos = await cargarPedidos();
    return pedidos.map(({ estado_pedido, ...resto }) => resto);
}





/**
 * Envía un pedido al servidor usando los datos del FormData.
 * @param {FormData} formData - Los datos del formulario que contienen la información del pedido.
 * 
 * Esta función construye el JSON usando construirJson y luego envía 
 * los datos al servidor mediante una solicitud POST usando fetch.
 */
export async function enviarPedido(formData) {
    // Construir el JSON a partir del FormData
    const pedidoJson = construirJson(formData);
    console.log(pedidoJson);
    
    console.log(pedidoJson);
    
    // Enviar el JSON al endpoint del servidor usando fetch
    try {
        const response = await fetch('http://localhost:8080/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoJson) // Convertir el objeto JSON a una cadena para enviar
        });

        // Convertir la respuesta en JSON
        const data = await response.json();

        // Verificar el estado de la respuesta y manejar errores si es necesario
        if (data.status !== 'success') {
            console.error('Error al agregar o actualizar el pedido:', data.message);
        } else {
            console.log('Pedido agregado o actualizado exitosamente:', data);
        }
    } catch (error) {
        console.error('Error al enviar el pedido:', error); // Manejo de errores en la solicitud
    }
}


/**
 * Construye un objeto JSON con los datos necesarios para crear o actualizar un pedido.
 * @param {FormData} formData - Los datos del formulario que contienen la información del pedido.
 * @returns {Object} - Un objeto JSON con la estructura requerida.
 */
function construirJson(formData) {
    // Establecer la mesa por defecto a 1, ya que no está en el formulario
    const mesa = 1;

    // Arrays para guardar los platos y sus detalles
    const platos = [];
    const detalles = [];

    // Objeto para almacenar detalles por plato ID
    const detallesPorPlato = {};

    // Recorrer todos los campos del FormData
    formData.forEach((value, key) => {
        // Manejo de campos de cantidad de platos
        if (key.startsWith('cantidad_plato')) {
            const idPlato = parseInt(key.replace('cantidad_plato', ''), 10); // Obtener ID del plato desde el nombre del campo
            const cantidadPlato = parseInt(value, 10); // Obtener cantidad

            if (!isNaN(idPlato) && !isNaN(cantidadPlato)) {
                // Añadir el plato al array 'platos'
                platos.push({
                    id_plato: idPlato,
                    cantidad_plato: cantidadPlato
                });
            }
        }

        // Manejo de campos de detalles de platos
        if (key.startsWith('detalles_plato_')) {
            // Extraer el ID del plato del nombre del campo
            const matches = key.match(/^detalles_plato_(\d+)/);
            if (matches) {
                const idPlatoDetalle = parseInt(matches[1], 10); // Obtener el ID del plato desde el campo
                const detallesPlato = value; // Texto del detalle del plato

                // Buscar el índice del detalle para la cantidad afectada
                const detalleIndex = Array.from(formData.keys()).filter(k => k === key).indexOf(key) + 1;
                const cantidadDetallesKey = `PlatosAfectadosDetalle_${idPlatoDetalle}_${detalleIndex}`;

                const cantidadDetalles = parseInt(formData.get(cantidadDetallesKey), 10); // Obtener la cantidad de modificación

                if (!isNaN(idPlatoDetalle) && !isNaN(cantidadDetalles)) {
                    // Verificar si ya existen detalles para este plato
                    if (!detallesPorPlato[idPlatoDetalle]) {
                        detallesPorPlato[idPlatoDetalle] = [];
                    }

                    // Agregar los detalles al array correspondiente al plato
                    detallesPorPlato[idPlatoDetalle].push({
                        id_plato: idPlatoDetalle,
                        cantidad_platos_modificacion: cantidadDetalles,
                        detalles_plato: detallesPlato
                    });
                }
            }
        }
    });

    // Convertir los detalles por plato a un array único de detalles
    for (const platoId in detallesPorPlato) {
        detalles.push(...detallesPorPlato[platoId]);
    }

    // Crear el objeto JSON final
    const resultado = {
        mesa: mesa,  // Mesa establecida por defecto
        platos: platos,
        detalles: detalles
    };

    // Imprimir el resultado para verificación
    console.log('JSON construido:', resultado);
    return resultado; // Devolver el JSON construido
}


export async function cambiarEstado(mesa, estado) {
    // Verifica que el estado sea válido antes de definir los datos y enviar la solicitud
    if (estado === 'En preparacion' || estado === 'Preparado' || estado === 'Por pagar' || estado === 'Completado') {
        // Datos que se enviarán en la solicitud
        const data = {
            estado: estado
        };

        // Realizar la solicitud fetch
        fetch(`${URLs}/pedidos/estado/${mesa}`, {
            method: 'PUT', // Método PUT para actualizar
            headers: {
                'Content-Type': 'application/json' // Especificar que se está enviando JSON
            },
            body: JSON.stringify(data) // Convertir los datos a formato JSON
        })
        .then(response => {
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanza un error
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(result => {
            // Manejar la respuesta
            if (result.status === 'success') {
                console.log(`Estado cambiado a "${estado}" exitosamente`);
                // Aquí puedes actualizar la interfaz o realizar otras acciones necesarias
            } else {
                console.error('Error al cambiar el estado:', result.message);
            }
        })
        .catch(error => {
            // Manejar cualquier error que ocurra durante la solicitud
            console.error('Error en la solicitud:', error);
        });
    } else {
        console.log('Estado no válido');
    }
}

/**
 * Obtiene el pedido completo para una mesa específica.
 * @param {number} mesa - El número de la mesa.
 * @returns {Object} - Los datos completos del pedido.
 */
export async function pedidoCompleto_Mesa(mesa) {
    try {
        const response = await fetch(`${URLs}/pedidos/pedidoCompleto/${mesa}`);
        const data = await response.json();

        if (data.status !== 'success') {
            console.error('Error al obtener los pedidos:', data.message);
            return null;
        }

        // Retornar solo la parte de datos
        return data.data;

    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        return null;
    }
}

/**
 * Completa el pedido para una mesa específica y mueve los datos al histórico.
 * @param {number} mesa - El número de la mesa.
 * @returns {Object} - La respuesta de la solicitud, indicando si el pedido se completó exitosamente.
 */
export async function completarPedido(mesa) {
    try {
        const response = await fetch(`${URLs}/pedidos/completar/${mesa}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al completar el pedido:', error);
        return { status: 'error', message: error.message };
    }
}

/**
 * Descarga la factura en formato PDF para un ID de histórico específico.
 * @param {number} idHistorico - El ID del histórico del pedido.
 */
export function descargarFactura(idHistorico) {
    const url = `${URLs}/reportes/factura/${idHistorico}`;
    window.open(url, '_blank');
}