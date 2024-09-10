import { URLs } from "../../../SolicitudesAPI/URL.js";


document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${URLs}/categorias`)
    const data = await response.json();
    console.log(data.data);
    
    
    llenarTabla(data.data);
});

function llenarTabla(datos) {
    const tbody = document.querySelector('.tabla tbody');
    datos.forEach(categoria => {
        // Crea una nueva fila
        const row = document.createElement('tr');

        // Crea y añade las celdas para cada dato del categoria
        const identificadorTd = document.createElement('td');
        identificadorTd.textContent = categoria.nombre_categoria;
        row.appendChild(identificadorTd);

        const rolTd = document.createElement('td');
        rolTd.textContent = categoria.rol;
        row.appendChild(rolTd);
        
        // Crea la celda para los botones de acción
        const accionesTd = document.createElement('td');

        // Botón Editar
        const editarBtn = document.createElement('button');
        editarBtn.classList.add('primary_button');
        editarBtn.setAttribute("data-edit",`edit${categoria.id_categoria}`)
        editarBtn.textContent = 'Editar';
        editarBtn.onclick = () => editarcategoria(categoria.nombrecategoria);
        accionesTd.appendChild(editarBtn);

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('secundary_button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarcategoria(categoria.nombrecategoria);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}


// Funciones para manejar los eventos de los botones
function editarcategoria(nombrecategoria) {
    alert(`Editar categoria: ${nombrecategoria}`);
    // Aquí puedes añadir la lógica para editar el categoria
}

function eliminarcategoria(nombrecategoria) {
    alert(`Eliminar categoria: ${nombrecategoria}`);
    // Aquí puedes añadir la lógica para eliminar el categoria
}
