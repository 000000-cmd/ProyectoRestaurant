// traerHistorico.js

export async function obtenerHistoricoPedidos() {
    try {
        const url = 'http://localhost:8080/pedidos/historico-pedidos/todos'; // URL del endpoint

        // Realiza la solicitud GET al endpoint
        const response = await fetch(url);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener el histórico de pedidos: ${response.statusText}`);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Imprimir la estructura de los datos obtenidos
        console.log('Datos obtenidos del servidor:', data);

        // Si la respuesta no es un array, ajusta cómo acceder a los datos
        const pedidos = Array.isArray(data) ? data : data.data; // Ajusta aquí si data no es un array directamente

        if (!Array.isArray(pedidos)) {
            throw new Error('La respuesta del servidor no contiene una lista de pedidos.');
        }

        // Obtener el PDF como blob para cada pedido en el histórico
        const dataConPdfBlob = await Promise.all(pedidos.map(async pedido => {
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
        console.log('Histórico de Pedidos con PDF Blob:', dataConPdfBlob);

        // Devuelve los datos obtenidos con el blob del PDF
        return dataConPdfBlob;
    } catch (error) {
        console.error('Error al obtener el histórico de pedidos:', error);
        return null; // Devuelve null o maneja el error según lo necesites
    }
}


