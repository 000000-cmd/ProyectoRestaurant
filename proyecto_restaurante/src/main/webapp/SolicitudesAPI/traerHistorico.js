// gestionarHistorico.js

// Función para obtener todo el histórico de pedidos
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

        // Muestra los datos obtenidos en la consola (o maneja los datos según necesites)
        console.log('Histórico de Pedidos:', data);

        // Devuelve los datos obtenidos
        return data;
    } catch (error) {
        console.error('Error al obtener el histórico de pedidos:', error);
        return null; // Devuelve null o maneja el error según lo necesites
    }
}
