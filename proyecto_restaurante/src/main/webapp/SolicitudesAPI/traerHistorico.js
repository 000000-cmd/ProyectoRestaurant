// traerHistorico.js

/**
 * Obtiene el histórico de pedidos con paginación.
 * @param {number} page - Número de la página a obtener.
 * @param {number} limit - Cantidad de registros por página.
 * @returns {Object} - Un objeto que contiene los pedidos y la información de paginación.
 */
export async function obtenerHistoricoPedidos(page = 1, limit = 10) {
    try {
        const url = `http://localhost:8080/pedidos/historico-pedidos/todos?page=${page}&limit=${limit}`; // URL del endpoint con parámetros de paginación

        // Realiza la solicitud GET al endpoint con parámetros de paginación
        const response = await fetch(url);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener el histórico de pedidos: ${response.statusText}`);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Imprimir la estructura de los datos obtenidos
        console.log('Datos obtenidos del servidor:', data);

        // Verifica el estado de la respuesta
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        // Extraer los pedidos y la información de paginación
        const pedidos = data.data;
        const paginationInfo = {
            paginaActual: data.paginaActual,
            paginasTotales: data.paginasTotales,
            itemsTotales: data.itemsTotales,
            paginaAnterior: data.paginaAnterior,
            paginaSiguiente: data.paginaSiguiente
        };

        // Verificar que 'pedidos' sea un array
        if (!Array.isArray(pedidos)) {
            throw new Error('La respuesta del servidor no contiene una lista de pedidos.');
        }

        // Obtener el PDF como blob para cada pedido en el histórico
        const pedidosConPdf = await Promise.all(pedidos.map(async pedido => {
            try {
                // Asumiendo que cada pedido tiene un campo `id_historico`
                const pdfResponse = await fetch(`http://localhost:8080/reportes/factura/${pedido.id_historico}`, {
                    headers: {
                        'Accept': 'application/pdf'
                    }
                });

                if (!pdfResponse.ok) {
                    throw new Error(`Error al obtener el PDF para el pedido ${pedido.id_historico}: ${pdfResponse.statusText}`);
                }

                // Obtener el PDF como blob
                const pdfBlob = await pdfResponse.blob();

                // Retornar el pedido con el blob del PDF en el atributo 'factura_pdf'
                return {
                    ...pedido,
                    factura_pdf: pdfBlob // Agregar el blob del PDF bajo el atributo 'factura_pdf'
                };
            } catch (pdfError) {
                console.error(`Error al obtener el PDF para el pedido ${pedido.id_historico}:`, pdfError);
                return {
                    ...pedido,
                    error_pdf: true // Agrega un flag para indicar que hubo un error al obtener el PDF
                };
            }
        }));

        // Muestra los datos obtenidos en la consola (o maneja los datos según necesites)
        console.log('Histórico de Pedidos con PDF Blob:', pedidosConPdf);

        // Devuelve los datos obtenidos con la información de paginación
        return {
            pedidos: pedidosConPdf,
            pagination: paginationInfo
        };
    } catch (error) {
        console.error('Error al obtener el histórico de pedidos:', error);
        return null; // Devuelve null o maneja el error según lo necesites
    }
}


