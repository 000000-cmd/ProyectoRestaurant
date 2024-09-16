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

export async function crearActualizarCategoria(categoria, action, id) {
    try {
        const categoriaNombre = categoria.categoria_name?.trim();
        console.log('Valor capturado de categoría:', categoriaNombre);

        if (!categoriaNombre) {
            throw new Error('El nombre de la categoría no puede estar vacío.');
        }

        const payload = { categoria: categoriaNombre };

        let url = endpointUrl;
        let method = 'POST'; // Para agregar

        if (action === "edit") {
            url = `${endpointUrl}/${id}`;
            method = 'PUT'; // Para editar
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(`Error al ${action === "edit" ? "actualizar" : "agregar"} la categoría: ${errorMessage}`);
        }

        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        return data;

    } catch (error) {
        console.error(`Error al ${action === "edit" ? "actualizar" : "agregar"} la categoría:`, error);
        throw error;
    }
}


export async function obtenerCategoriaPorID(idCategoria) {
    try {
        const response = await fetch(`${endpointUrl}/${idCategoria}`);
        
        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener la categoría con ID ${idCategoria}: ${response.statusText}`);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Verifica si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        // Retorna los datos de la categoría
        return data.data;

    } catch (error) {
        console.error(`Error al obtener la categoría:`, error);
        throw error; // Lanza el error para manejarlo en otro lugar si es necesario
    }
}

export async function eliminarCategoria(idCategoria) {
    try {
        const response = await fetch(`${endpointUrl}/${idCategoria}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText;
            throw new Error(`Error al eliminar la categoría: ${errorMessage}`);
        }

        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        console.log(`Categoría con ID ${idCategoria} eliminada exitosamente.`);
        return data;
        
    } catch (error) {
        console.error(`Error al eliminar la categoría:`, error);
        throw error;
    }
}