import { obtenerRoles } from "../../../SolicitudesAPI/consultasSelect/gestionarRoles.js";

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
        eliminarBtn.onclick = () => eliminarrol(rol.rol);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}


function eliminarrol(nombrerol) {
    alert(`Eliminar rol: ${nombrerol}`);
    // Aquí puedes añadir la lógica para eliminar el rol
}
