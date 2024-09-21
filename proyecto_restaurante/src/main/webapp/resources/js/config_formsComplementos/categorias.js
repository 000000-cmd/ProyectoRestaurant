// categorias.js
import { crearActualizarCategoria, obtenerCategoriaPorID } from "../../../SolicitudesAPI/consultasSelect/gestionarCategorias.js";
import{validarTexto} from "../ValidarFormularios.js";

export function handleCategoriasForm(mode, IdForm, formulario) {
    if (mode === 'editCategoria' && IdForm) {
        cargarDatosDelCategoria(IdForm, formulario);
        const tituloForm = document.querySelector(".form_title h2")
        tituloForm.textContent = "Editar Categoria existente"
        const buttonForm = document.querySelector(".primary_button")
        buttonForm.textContent = "Editar"
    }

    formulario.id = mode;
    document.addEventListener("submit", (e) => {
        e.preventDefault()
        const result = Validarformulario(formulario)
        if (result) {
            if (mode === 'addCategoria') {
                AddCategoria(formulario);
            } else if (mode === 'editCategoria') {
                EditCategoria(formulario);
            }
        }else{
            alert("Hay campos sin llenar!")
        }

    })
}


function Validarformulario(formulario) {
    const formData = new FormData(formulario);
    const categoria_name = formData.get('categoria_name');

    let isValid = true;
    let errors = [];

    // Validar nombre de la categoría
    if (!categoria_name || categoria_name.trim() === '') {
        isValid = false;
        errors.push('El nombre de la categoría es obligatorio.');
    } else if (!validarTexto(categoria_name)) {
        isValid = false;
        errors.push('El nombre de la categoría contiene caracteres inválidos.');
    }

    // Mostrar errores si los hay
    if (!isValid) {
        alert(errors.join('\n'));
    }

    return isValid;
}

async function cargarDatosDelCategoria(idCategoria, formulario) {
    try {
        const datos = await obtenerCategoriaPorID(idCategoria);

        if (!datos || typeof datos !== 'object') {
            throw new Error('Los datos de la categoría son inválidos o no fueron encontrados.');
        }

        const id = formulario.querySelector("#id-categoria");
        const nombre = formulario.querySelector("#categoria_name");

        id.value = datos.id_categoria || '';
        nombre.value = datos.categoria || '';
    } catch (error) {
        console.error('Error al cargar datos de la categoría:', error);
    }
}

async function AddCategoria(formulario) {
    const formData = new FormData(formulario);
    const categoriaName = formData.get('categoria_name')?.trim();

    if (!categoriaName) {
        console.error('El nombre de la categoría no puede estar vacío.');
        alert('El nombre de la categoría no puede estar vacío.');
        return;
    }

    const respuesta = await crearActualizarCategoria({ categoria_name: categoriaName }, "add")

    if (respuesta.status === 'success') {
        window.location.assign('conf_categorias.html');
    }
}

async function EditCategoria(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-categoria").value;
    const categoriaName = formData.get('categoria_name')?.trim();

    if (!categoriaName) {
        console.error('El nombre de la categoría no puede estar vacío.');
        return;
    }

    const respuesta = await crearActualizarCategoria({ categoria_name: categoriaName }, "edit", id)
    if (respuesta.status === 'success') {
        window.location.assign('conf_categorias.html');
    }
}
