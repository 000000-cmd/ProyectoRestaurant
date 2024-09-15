// URL del endpoint para obtener todos los platos
const endpointUrl = 'http://localhost:8080/platos'; 

// Función para obtener todos los platos
export async function obtenerPlatos() {
    try {
        // Realiza la solicitud GET al endpoint
        const response = await fetch(endpointUrl);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener los platos: ' + response.statusText);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();
        console.log(data);
        

        // Verifica si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error('Error en la respuesta del servidor: ' + data.message);
        }

        // Procesar los datos y almacenar las imágenes
        const platosConImagenes = data.data.map(plato => {
            // Si hay una imagen, convertirla a base64 para almacenarla en la respuesta

            // Devolver un objeto con los detalles del plato y la imagen en base64
            return {
                id_plato: plato.id_plato,
                nombre_plato: plato.nombre_plato,
                descripcion: plato.descripcion,
                precio: plato.precio,
                disponibilidad: plato.disponibilidad,
                categoria: plato.categoria,
                img_plato: plato.img_plato // Almacena la imagen en formato base64
            };
        });

        // Muestra los datos procesados en la consola
        console.log(platosConImagenes);

        // Aquí puedes devolver los datos procesados o manejarlos como necesites
        return platosConImagenes;
    } catch (error) {
        // Maneja los errores
        console.error('Error al procesar los platos:', error);
    }
}


export async function crearActualizarPlato(plato, action, id) {
    try {
        // Crear un objeto FormData para manejar los datos, incluyendo la imagen
        const formData = new FormData();

        formData.append('nombre_plato', plato.nombre_plato.value);
        formData.append('descripcion', plato.descripcion.value);
        formData.append('precio', parseFloat(plato.precio.value).toFixed(2));
        formData.append('disponibilidad', plato.disponibilidad.value);
        formData.append('id_categoria', plato.id_categoria.value);

        // Solo agregar la imagen si está presente y es un archivo válido
        if (plato.img_plato.files[0] instanceof File) { 
            formData.append('img_plato', plato.img_plato.files[0]);
        }

        // Verificar lo que se agregó a FormData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Configurar la URL y método según la acción
        let url = endpointUrl;
        let method = 'POST';
        if (action === "edit") {
            url += `/${id}`;
            method = 'PUT'; // Cambiar a PUT para actualizar
        }

        // Realizar la solicitud POST o PUT para agregar o actualizar el plato
        const response = await fetch(url, {
            method: method,
            body: formData,
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al ${action === 'edit' ? 'actualizar' : 'agregar'} el plato: ` + response.statusText);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Verificar si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ` + data.message);
        }

        // Muestra el mensaje de éxito
        console.log(`Plato ${action === 'edit' ? 'actualizado' : 'agregado'} exitosamente:`, data);

        // Retornar los datos recibidos si es necesario
        return data;

    } catch (error) {
        // Maneja los errores
        console.error(`Error al ${action === 'edit' ? 'actualizar' : 'agregar'} el plato:`, error);
    }
}




export async function obtenerPlatoPorId(id) {
    try {
        // Realiza la solicitud GET al endpoint específico del plato por su ID
        const response = await fetch(`${endpointUrl}/${id}`);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener el plato con ID ${id}: ${response.statusText}`);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Verifica si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        // Devuelve los datos del plato
        return data.data;
    } catch (error) {
        // Maneja los errores
        console.error('Error al obtener el plato por ID:', error);
        throw error; // Opcionalmente, puedes volver a lanzar el error para manejarlo en otro lugar
    }
}
