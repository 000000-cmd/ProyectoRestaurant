import { obtenerCategorias } from "../../../SolicitudesAPI/consultasSelect/gestionarCategorias.js";
import { URLs } from "../../../SolicitudesAPI/URL.js";


document.addEventListener('DOMContentLoaded', async () => {
    
    const data=  await obtenerCategorias();
    console.log(data);
    llenarTabla(data);
 
    

});

function llenarTabla(datos) {
    const tbody = document.querySelector('.tabla tbody');
    datos.forEach(categoria => {
        // Crea una nueva fila
        const row = document.createElement('tr');

        // Crea y añade las celdas para cada dato del categoria
        const identificadorTd = document.createElement('td');
        identificadorTd.textContent = categoria.id_categoria;
        row.appendChild(identificadorTd);

        const rolTd = document.createElement('td');
        rolTd.textContent = categoria.categoria;
        row.appendChild(rolTd);
        
        // Crea la celda para los botones de acción
        const accionesTd = document.createElement('td');

        // Botón Editar
        const editarBtn = document.createElement('button');
        editarBtn.classList.add('primary_button');
        editarBtn.setAttribute("data-edit",`edit${categoria.id_categoria}`)
        editarBtn.textContent = 'Editar';
        editarBtn.onclick = () => editarcategoria(categoria.nombrecategoria);
        editarBtn.setAttribute("onclick", `window.location.href='form_categorias.html?mode=editCategoria&id=${categoria.id_categoria}'`);
        accionesTd.appendChild(editarBtn);

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('secundary_button');
        editarBtn.setAttribute("data-delete",`delete${categoria.id_categoria}`)
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarcategoria(categoria.nombrecategoria);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}

function eliminarcategoria(nombrecategoria) {
    alert(`Eliminar categoria: ${nombrecategoria}`);
    // Aquí puedes añadir la lógica para eliminar el categoria
}
