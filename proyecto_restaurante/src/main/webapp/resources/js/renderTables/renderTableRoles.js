import { obtenerRoles, eliminarRol } from "../../../SolicitudesAPI/consultasSelect/gestionarRoles.js";

async function verificarUsuario() {
    const rolRequerido = 'Administrador'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {

        document.addEventListener('DOMContentLoaded', async () => {
            const data = await obtenerRoles();
            console.log(data);

            llenarTabla(data);
        });
    }

}



function llenarTabla(datos) {
    const tbody = document.querySelector('.tabla tbody');

    datos.forEach(rol => {
        console.log(rol);

        // Crea una nueva fila
        const row = document.createElement('tr');
        row.setAttribute("data-rol", rol.id_rol)
        // Crea y añade las celdas para cada dato del rol
        const rolTd = document.createElement('td');
        rolTd.textContent = rol.id_rol;
        row.appendChild(rolTd);
        const nombreTd = document.createElement('td');
        nombreTd.textContent = rol.rol;
        row.appendChild(nombreTd);

        // Crea la celda para los botones de acción
        const accionesTd = document.createElement('td');

        // Botón Editar
        const editarBtn = document.createElement('button');
        editarBtn.classList.add('primary_button');
        editarBtn.setAttribute("onclick", `window.location.href='form_roles.html?mode=editRol&id=${rol.id_rol}'`);
        editarBtn.textContent = 'Editar';
        accionesTd.appendChild(editarBtn);

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('secundary_button');
        editarBtn.setAttribute("data-delete", `delete${rol.id_rol}`)
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarrol(rol);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}


async function eliminarrol(rol) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el rol de ${rol.rol} ?`);

    if (!confirmacion) {
        return; // Cancelar la eliminación si el usuario no confirma
    }
    try {
        const response = await eliminarRol(rol.id_rol);
        console.log(response.status === 'success');

        if (response.status === 'success') {
            const fila = document.querySelector(`[data-rol="${rol.id_rol}"]`)
            fila.remove();
            alert(`El rol ${rol.rol} ha sido eliminada exitosamente.`);

        } else {
            alert(`Error al eliminar la categoría: ${response.message}`)

            console.error(`Error al eliminar la categoría: ${response.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Ocurrió un error al intentar eliminar la categoría.');
    }
}

verificarUsuario();
