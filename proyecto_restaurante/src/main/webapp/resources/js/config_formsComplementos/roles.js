// roles.js
import { crearActualizarRol, obtenerRolPorId } from "../../../SolicitudesAPI/gestionarRol.js";
import { validarNumero, validarTexto } from "../ValidarFormularios.js";
export function handleRolesForm(mode, IdForm, formulario) {
    // Cargar los datos del rol si estamos en modo edición
    if (mode === 'editRol' && IdForm) {
        cargarDatosDeRoles(IdForm, formulario);
        const tituloForm= document.querySelector(".form_title h2")
        tituloForm.textContent="Editar Rol existente"
        const buttonForm= document.querySelector(".primary_button")
        buttonForm.textContent="Editar"
    }

    formulario.id = mode;

    // Configurar el event listener para el envío del formulario
    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío del formulario por defecto
        const result= Validarformulario(formulario)
        if(result){
            if (mode === 'addRol') {
                AddRol(formulario);
            } else if (mode === 'editRol') {
                EditRol(formulario);
            }
        }

    }, { once: true }); // Agregar el event listener solo una vez
}

function Validarformulario(formulario) {
    const formData = new FormData(formulario);
    const nombre_rol = formData.get('nombre_rol');

    let isValid = true;
    let errors = [];

    // Validar nombre del rol
    if (!nombre_rol || nombre_rol.trim() === '') {
        isValid = false;
        errors.push('El nombre del rol es obligatorio.');
    } else if (!validarTexto(nombre_rol)) {
        isValid = false;
        errors.push('El nombre del rol contiene caracteres inválidos.');
    }

    // Mostrar errores si los hay
    if (!isValid) {
        alert(errors.join('\n'));
    }

    return isValid;
}

async function cargarDatosDeRoles(idRol, formulario) {
    try {
        const datos = await obtenerRolPorId(idRol);
        if (!datos || typeof datos !== 'object') {
            throw new Error('Los datos del rol son inválidos o no fueron encontrados.');
        }

        const id = formulario.querySelector("#id-rol");
        const nombre = formulario.querySelector("#nombre_rol");

        id.value = datos.id_rol || '';
        nombre.value = datos.rol || '';
    } catch (error) {
        console.error('Error al cargar datos del rol:', error);
    }
}

async function AddRol(formulario) {
    const formData = new FormData(formulario);
    const nombreRol = formData.get('nombre_rol')?.trim();

    if (!nombreRol) {
        console.error('El nombre del rol no puede estar vacío.');
        alert('El nombre del rol no puede estar vacío.');
        return;
    }
    const respuesta= await crearActualizarRol({ nombre_rol: nombreRol }, "add");

    if (respuesta.status === 'success') {
        window.location.assign('conf_roles.html');
    }

}

async function EditRol(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-rol").value;
    const nombreRol = formData.get('nombre_rol')?.trim();

    if (!nombreRol) {
        console.error('El nombre del rol no puede estar vacío.');
        alert('El nombre del rol no puede estar vacío.');
        return;
    }

    const respuesta= await crearActualizarRol({ nombre_rol: nombreRol }, "edit", id)
    if (respuesta.status === 'success') {
        window.location.assign('conf_roles.html');
    }
}
