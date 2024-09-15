import { URLs } from "./URL.js";

export async function crearActualizarRol(rol, action, id) {
    try {
        // Verificar si rol.nombre_rol existe y es una cadena, luego aplicamos trim.
        const nombreRol = typeof rol.nombre_rol === 'string' ? rol.nombre_rol.trim() : '';

        // Valida que el campo no esté vacío después de aplicar trim.
        if (!nombreRol) {
            throw new Error('El nombre del rol no puede estar vacío.');
        }

        // Crear el payload con los datos del rol
        const payload = {
            rol: nombreRol // Usar el nombreRol procesado y validado
        };

        // Determina la URL y el método en función de la acción
        let url = `${URLs}/selects/roles`;
        let method = 'POST'; // Para agregar

        if (action === "edit") {
            url = `${URLs}/selects/roles/${id}`;
            method = 'PUT'; // Para editar
        }

        // Realiza la solicitud al endpoint correspondiente con los datos en JSON
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json' // Asegura que se envíe como JSON
            },
            body: JSON.stringify(payload) // Convertir el payload a JSON
        });

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Error al ${action === "edit" ? "actualizar" : "agregar"} el rol: ${errorDetails}`);
            throw new Error(`Error al ${action === "edit" ? "actualizar" : "agregar"} el rol: ${response.statusText}`);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Verifica si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        // Retorna los datos de la respuesta
        return data;

    } catch (error) {
        // Maneja los errores
        console.error(`Error al ${action === "edit" ? "actualizar" : "agregar"} el rol:`, error);
        throw error; // Lanza el error para manejarlo en otro lugar si es necesario
    }
}


export async function obtenerRolPorId(idrol) {
    try {
        // Realiza la solicitud GET al endpoint para obtener el rol por ID
        const response = await fetch(`${URLs}/selects/roles/${idrol}`);
        
        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al obtener el rol con ID ${idrol}: ${response.statusText}`);
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Verifica si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        // Retorna los datos del rol
        return data.data;

    } catch (error) {
        console.error(`Error al obtener el rol:`, error);
        throw error; // Puedes volver a lanzar el error para manejarlo en otro lugar si es necesario
    }
}
