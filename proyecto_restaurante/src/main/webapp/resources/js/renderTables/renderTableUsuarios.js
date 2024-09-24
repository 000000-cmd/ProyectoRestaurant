import { eliminarUsuario, traerUsuarios } from "../../../SolicitudesAPI/gestionarUsuarios.js";
import { verificarRol } from "../verificarSesion.js";

async function verificarUsuario() {
    const rolRequerido = 'Administrador'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
        const usuarios= await traerUsuarios();
        llenarTablaUsuarios(usuarios)

    }

}
document.addEventListener('DOMContentLoaded', verificarUsuario);

function llenarTablaUsuarios(datos) {
    const tbody = document.querySelector('.tabla tbody');
    tbody.classList.add('tabla_users')
    datos.forEach(usuario => {
        // Crea una nueva fila
        const row = document.createElement('tr');
        row.setAttribute("data-usuario",usuario.id_usuario)

        // Crea y añade las celdas para cada dato del usuario
        const nombreTd = document.createElement('td');
        nombreTd.textContent = usuario.nombre_usuario;
        row.appendChild(nombreTd);

        const usuarioTd = document.createElement('td');
        usuarioTd.textContent = usuario.rol;
        row.appendChild(usuarioTd);

        const contrasenaTd = document.createElement('td');
        contrasenaTd.textContent = '***********';
        row.appendChild(contrasenaTd);

        // Crea la celda para los botones de acción
        const accionesTd = document.createElement('td');

        // Botón Editar
        const editarBtn = document.createElement('button');
        editarBtn.classList.add('primary_button');
        editarBtn.setAttribute("onclick", `window.location.href='form_users.html?mode=editUsuario&id=${usuario.id_usuario}'`);
        editarBtn.textContent = 'Editar';
        accionesTd.appendChild(editarBtn);

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('secundary_button');
        editarBtn.setAttribute("data-delete",`${usuario.id_usuario}`)
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarusuario(usuario);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}

async function eliminarusuario(usuario) {
    console.log(usuario);
    
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el usuario: ${usuario.nombre_usuario} ?`);

    if (!confirmacion) {
        return; // Cancelar la eliminación si el usuario no confirma
    }
    try {
        const response = await eliminarUsuario(usuario.id_usuario);
        console.log(response);
        
        console.log(response.status === 'success');
        
        if (response.status === 'success') {
            const fila = document.querySelector(`[data-usuario="${usuario.id_usuario}"]`)
            fila.remove();  
            alert(`El usuario ${usuario.nombre_usuario} ha sido eliminada exitosamente.`);

        } else {
            alert(`Error al eliminar la categoría: ${response.message}`)
            
            console.error(`Error al eliminar la categoría: ${response.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Ocurrió un error al intentar eliminar la categoría.');
    }
}
