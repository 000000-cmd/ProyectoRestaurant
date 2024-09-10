import { URLs } from "../../../SolicitudesAPI/URL.js";


document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${URLs}/usuarios`)
    const data = await response.json();
    console.log(data.data);
    
    
    llenarTabla(data.data);
});

function llenarTabla(datos) {
    const tbody = document.querySelector('.tabla tbody');
    datos.forEach(usuario => {
        // Crea una nueva fila
        const row = document.createElement('tr');

        // Crea y añade las celdas para cada dato del usuario
        const nombreTd = document.createElement('td');
        nombreTd.textContent = usuario.nombre_usuario;
        row.appendChild(nombreTd);

        const rolTd = document.createElement('td');
        rolTd.textContent = usuario.rol;
        row.appendChild(rolTd);

        const contrasenaTd = document.createElement('td');
        contrasenaTd.textContent = usuario.password;
        row.appendChild(contrasenaTd);

        // Crea la celda para los botones de acción
        const accionesTd = document.createElement('td');

        // Botón Editar
        const editarBtn = document.createElement('button');
        editarBtn.classList.add('primary_button');
        editarBtn.setAttribute("data-edit",`edit${usuario.id_usuario}`)
        editarBtn.textContent = 'Editar';
        editarBtn.onclick = () => editarUsuario(usuario.nombreUsuario);
        accionesTd.appendChild(editarBtn);

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('secundary_button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarUsuario(usuario.nombreUsuario);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}


// Funciones para manejar los eventos de los botones
function editarUsuario(nombreUsuario) {
    alert(`Editar usuario: ${nombreUsuario}`);
    // Aquí puedes añadir la lógica para editar el usuario
}

function eliminarUsuario(nombreUsuario) {
    alert(`Eliminar usuario: ${nombreUsuario}`);
    // Aquí puedes añadir la lógica para eliminar el usuario
}
