const endpointUrl = 'http://localhost:8080/selects/categorias'; // Asegúrate de ajustar la URL a la dirección correcta de tu servidor

// Función para obtener todas las categorías
export async function obtenerCategorias() {
    try {
        // Realiza la solicitud GET al endpoint
        const response = await fetch(endpointUrl);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener las categorías: ' + response.statusText);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Verifica si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error('Error en la respuesta del servidor: ' + data.message);
        }

        // Muestra las categorías en la consola
        console.log(data.data);

        // Aquí puedes procesar las categorías como necesites, por ejemplo, llenar un select en HTML
        data.data.forEach(categoria => {
            console.log(`ID: ${categoria.id_categoria}, Nombre: ${categoria.categoria}`);
        });

        // Retornar los datos si es necesario
        return data.data;
    } catch (error) {
        // Maneja los errores
        console.error('Error al procesar las categorías:', error);
    }
}