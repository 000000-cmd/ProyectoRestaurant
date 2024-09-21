import { URLs } from "../URL.js";

export async function obtenerRoles() {
    try {
        const response = await fetch(`${URLs}/selects/roles`);
        if (!response.ok) {
            throw new Error('Error al obtener los roles: ' + response.statusText);
        }
        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error('Error en la respuesta del servidor: ' + data.message);
        }
        return data.data;
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        throw error;
    }
}

export async function eliminarRol(idRol) {
    try {
        console.log('Eliminando rol con ID:', idRol);
        
        const response = await fetch(`${URLs}/selects/roles/${idRol}`, {
            method: 'DELETE', // Cambiar el método a DELETE
            headers: {
                'Content-Type': 'application/json', // Opcional, dependiendo de tu configuración
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el rol: ' + response.statusText);
        }

        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error('Error en la respuesta del servidor: ' + data.message);
        }

        console.log('Rol eliminado correctamente:', data);
        return data;

    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        throw error; // Lanza el error para que pueda ser manejado en otro lugar
    }
}


/**
 * Función para crear o actualizar un rol.
 * @param {Object} rolData - Los datos del rol, incluyendo el nombre del rol.
 * @param {string} action - Acción a realizar: "add" para agregar, "edit" para actualizar.
 * @param {number} [id] - ID del rol a actualizar (solo requerido si action es "edit").
 * @returns {Promise<Object>} - Un objeto con el resultado de la operación.
 */
export async function crearActualizarRol(rolData, action, id) {
    try {
        // Validar que el nombre del rol no esté vacío
        const nombreRol = rolData.nombre_rol?.trim();
        if (!nombreRol) {
            throw new Error('El nombre del rol es inválido o está vacío.');
        }

        // Configurar el payload con el nombre del rol
        const payload = {
            rol: nombreRol
        };

        let url = `${URLs}/roles`; // URL base para roles
        let method = 'POST'; // Método por defecto para agregar

        // Si la acción es editar, ajustar la URL y el método
        if (action === "edit" && id) {
            url = `${URLs}/roles/${id}`;
            method = 'PUT';
        }

        // Realizar la solicitud fetch al endpoint correspondiente
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Convertir el objeto a JSON
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error al ${action === "edit" ? "actualizar" : "agregar"} el rol: ${response.statusText}`);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Verificar si la respuesta contiene un estado de éxito
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        console.log(`Rol ${action === "edit" ? "actualizado" : "agregado"} exitosamente:`, data);
        return data; // Retornar los datos de la respuesta

    } catch (error) {
        console.error(`Error al ${action === "edit" ? "actualizar" : "agregar"} el rol:`, error);
        throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
    }
}