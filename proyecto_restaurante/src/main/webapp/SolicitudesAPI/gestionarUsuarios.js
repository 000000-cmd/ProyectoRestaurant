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
export async function crearActualizarUsuario(usuario, action, id) {
    try {
        const payload = {
            nombre_usuario: usuario.nombre_usuario,
            id_rol: usuario.id_rol,
            password: usuario.password
        };

        let url = `${URLs}/usuarios`;
        let method = 'POST';

        if (action === "edit") {
            url = `${URLs}/usuarios/${id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error al ${action === "edit" ? "editar" : "añadir"} el usuario: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error(`Error en la respuesta del servidor: ${data.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
}

export async function obtenerUsuarioPorID(idUsuario) {
    try {
        const response = await fetch(`${URLs}/usuarios/${idUsuario}`);
        const datos = await response.json();

        return datos.data;
    } catch (error) {
        console.error('Error al encontrar el usuario:', error);
        throw error;
    }
}