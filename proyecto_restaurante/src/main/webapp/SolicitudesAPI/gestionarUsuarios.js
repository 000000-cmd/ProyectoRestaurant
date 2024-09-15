import { URLs } from "./URL.js";

/**
 * @file gestionarUsuarios.js
 * @description Módulo para gestionar la actualización de usuarios mediante la API.
 * @author Diana Marcela Chavez
 */

/**
 * Función para actualizar un usuario existente en el sistema.
 * @function actualizarUsuario
 * @param {number} id - El ID del usuario a actualizar.
 * @param {Object} usuario - Un objeto con los datos del usuario a actualizar.
 * @param {string} usuario.nombre_usuario - El nuevo nombre de usuario.
 * @param {string} usuario.rol - El nuevo rol del usuario.
 * @param {string} usuario.password - La nueva contraseña del usuario.
 * @returns {Promise<Object>} - La respuesta del servidor como un objeto JSON.
 * @throws {Error} Si ocurre un error durante la actualización del usuario o si la respuesta del servidor indica un fallo.
 * @example
 * // Ejemplo de uso:
 * const usuario = {
 *     nombre_usuario: 'nuevoNombreUsuario',
 *     rol: 'nuevoRol',
 *     password: 'nuevaContraseña'
 * };
 * 
 * actualizarUsuario(1, usuario)
 *     .then(response => console.log('Usuario actualizado exitosamente:', response))
 *     .catch(error => console.error('Error al actualizar el usuario:', error));
 */
export async function crearActualizarUsuario(usuario, action,id) {
    try {
        // Realiza la solicitud PUT al endpoint específico del usuario por su ID
        const formData = new FormData();
        console.log(usuario);
        formData.append('nombre_usuario', usuario.nombre_usuario.value);
        formData.append('rol_usuario', usuario.rol_usuario.value);
        formData.append('password_usuario', usuario.password.value);

        if(action==="edit"){
            const response = await fetch(`${URLs}/usuarios/${id}`, {
                method: 'PUT',
                body: formData,
            });
    
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`Error al actualizar el usuario con ID ${id}: ${response.statusText}`);
            }
    
            // Convierte la respuesta a JSON
            const data = await response.json();
    
            // Verifica si la respuesta contiene un estado de éxito
            if (data.status !== 'success') {
                throw new Error(`Error en la respuesta del servidor: ${data.message}`);
            }
    
            // Retorna los datos de la respuesta
            return data;
        }else{
            const response = await fetch(`${URLs}/usuarios`, {
                method: 'POST',
                body: formData,
            });
    
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`Error al actualizar el usuario con ID ${id}: ${response.statusText}`);
            }
    
            // Convierte la respuesta a JSON
            const data = await response.json();
    
            // Verifica si la respuesta contiene un estado de éxito
            if (data.status !== 'success') {
                throw new Error(`Error en la respuesta del servidor: ${data.message}`);
            }
    
            // Retorna los datos de la respuesta
            return data;
        }

    } catch (error) {
        // Maneja los errores
        console.error('Error al actualizar el usuario:', error);
        throw error; // Puedes volver a lanzar el error para manejarlo en otro lugar
    }
}


export async function obtenerUsuarioPorID(idUsuario) {
    try {
        const response = await fetch(`${URLs}/usuarios/${idUsuario}`);
        const datos = await response.json();

        return datos.data
    } catch (error) {
        console.error('Error al encontrar el usuario:', error);
        throw error; // Puedes volver a lanzar el error para manejarlo en otro lugar
    }
    
}