import { obtenerRoles, eliminarRol } from "../../../SolicitudesAPI/consultasSelect/gestionarRoles.js";

document.addEventListener('DOMContentLoaded', async () => {
    const data = await obtenerRoles();
    console.log(data);
    
    // "1": "mesero",
    // "2": "cajero",
    // "3": "chef",
    // "4": "administrador"

    llenarTabla(data);
});


function llenarTabla(datos) {
    const tbody = document.querySelector('.tabla tbody');
    
    datos.forEach(rol => {
        console.log(rol);
        
        // Crea una nueva fila
        const row = document.createElement('tr');

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
        editarBtn.setAttribute("data-delete",`delete${rol.id_rol}`)
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
    alert(`Eliminar rol: ${rol.rol} con id ${rol.id_rol}`);
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el rol de ${rol.rol} ?`);

    if (!confirmacion) {
        return; // Cancelar la eliminación si el usuario no confirma
    }
    try {
        const response = await eliminarRol(rol.id_rol);

        if (response.status === 'success') {
            alert(`El rol ${rol.rol} ha sido eliminada exitosamente.`);
            // Recargar la tabla después de eliminar
            const data = await obtenerRoles();
            llenarTabla(data);  
        } else {
            alert(`Error al eliminar la categoría: ${response.message}`)
            
            console.error(`Error al eliminar la categoría: ${response.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Ocurrió un error al intentar eliminar la categoría.');
    }
}
