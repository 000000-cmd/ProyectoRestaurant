import { obtenerCategorias, eliminarCategoria } from "../../../SolicitudesAPI/consultasSelect/gestionarCategorias.js";
import { URLs } from "../../../SolicitudesAPI/URL.js";

async function verificarUsuario() {
    const rolRequerido = 'Administrador'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
        document.addEventListener('DOMContentLoaded', async () => {
            const data = await obtenerCategorias();
            console.log(data);
            llenarTabla(data);
        });
        
    }

}


function llenarTabla(datos) {
    const tbody = document.querySelector('.tabla tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla para evitar duplicados

    datos.forEach(categoria => {
        // Crea una nueva fila
        const row = document.createElement('tr');

        // Crea y añade las celdas para cada dato del categoria
        const identificadorTd = document.createElement('td');
        identificadorTd.textContent = categoria.id_categoria;
        row.appendChild(identificadorTd);

        const categoriaTd = document.createElement('td');
        categoriaTd.textContent = categoria.categoria;
        row.appendChild(categoriaTd);

        // Crea la celda para los botones de acción
        const accionesTd = document.createElement('td');

        // Botón Editar
        const editarBtn = document.createElement('button');
        editarBtn.classList.add('primary_button');
        editarBtn.setAttribute("data-edit", `edit${categoria.id_categoria}`);
        editarBtn.textContent = 'Editar';
        editarBtn.setAttribute("onclick", `window.location.href='form_categorias.html?mode=editCategoria&id=${categoria.id_categoria}'`);
        accionesTd.appendChild(editarBtn);

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('secundary_button');
        eliminarBtn.setAttribute("data-delete", `delete${categoria.id_categoria}`);
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => handleEliminarCategoria(categoria.id_categoria);
        accionesTd.appendChild(eliminarBtn);

        // Añade la celda de acciones a la fila
        row.appendChild(accionesTd);

        // Añade la fila completa al tbody
        tbody.appendChild(row);
    });
}

// Función para manejar la eliminación de categorías
async function handleEliminarCategoria(idCategoria) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta categoría?');

    if (!confirmacion) {
        return; // Cancelar la eliminación si el usuario no confirma
    }

    try {
        const response = await eliminarCategoria(idCategoria);

        if (response.status === 'success') {
            alert(`Categoría con ID ${idCategoria} eliminada exitosamente.`);
            // Recargar la tabla después de eliminar
            const data = await obtenerCategorias();
            llenarTabla(data);
        } else {
            console.error(`Error al eliminar la categoría: ${response.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Ocurrió un error al intentar eliminar la categoría.');
    }
}