// usuarios.js
import { crearActualizarUsuario, obtenerUsuarioPorID } from "../../../SolicitudesAPI/gestionarUsuarios.js";
import { obtenerRoles } from "../../../SolicitudesAPI/consultasSelect/gestionarRoles.js";


export async function handleUsuariosForm(mode, IdForm, formulario) {
    // Cargar los roles en el select
    const rolSelect = formulario.querySelector("#rol_usuario");
    await cargarRolesEnSelect(rolSelect);

    if (mode === 'editUsuario' && IdForm) {
        await cargarDatosDelUsuario(IdForm, formulario);
        const tituloForm = document.querySelector(".form_title h2")
        tituloForm.textContent = "Editar Usuario existente"
        const buttonForm = document.querySelector(".primary_button")
        buttonForm.textContent = "Editar"
    }

    formulario.id = mode;
    document.addEventListener("submit", (e) => {
        e.preventDefault()
        const result = Validarformulario(formulario)
        if (result) {
            if (mode === 'addUsuario') {
                AddUsuario(formulario);

            } else if (mode === 'editUsuario') {
                EditUsuario(formulario);

            }
        }else{
            alert("Llena los campos")
        }

    })

}
// Función para validar el formulario
function Validarformulario(formulario) {
    const formData = new FormData(formulario);
    const nombre_usuario = formData.get('nombre_usuario');
    const rol_usuario = formData.get('rol_usuario');
    const password = formData.get('password');

    let isValid = true;
    let errors = [];

    // Validar nombre del usuario
    if (!nombre_usuario || nombre_usuario.trim() === '') {
        isValid = false;
        errors.push('El nombre del usuario es obligatorio.');
    } else if (!validarTexto(nombre_usuario)) {
        isValid = false;
        errors.push('El nombre del usuario contiene caracteres inválidos.');
    }

    // Validar rol del usuario
    if (!rol_usuario || rol_usuario.trim() === '') {
        isValid = false;
        errors.push('Debe seleccionar un rol para el usuario.');
    } else if (!validarRol(rol_usuario)) {
        isValid = false;
        errors.push('El rol seleccionado es inválido.');
    }

    // Validar contraseña del usuario
    if (!password || password.trim() === '') {
        isValid = false;
        errors.push('La contraseña es obligatoria.');
    } else if (!validarPassword(password)) {
        isValid = false;
        errors.push('La contraseña debe tener al menos 8 caracteres.');
    }

    // Mostrar errores si los hay
    if (!isValid) {
        alert(errors.join('\n'));
    }

    return isValid;
}

function validarRol(rol) {

    const rolesPermitidos = ['Administrador', 'Editor', 'Usuario']; // Ajusta según tus roles
    return rolesPermitidos.includes(rol);
}


async function cargarRolesEnSelect(rolSelect) {
    try {
        const roles = await obtenerRoles();
        rolSelect.innerHTML = ''; // Limpia el select antes de llenarlo

        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.id_rol; // Usa el ID del rol como valor
            option.textContent = rol.rol; // Usa el nombre del rol
            rolSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los roles:', error);
    }
}

async function cargarDatosDelUsuario(idUsuario, formulario) {
    try {
        const datos = await obtenerUsuarioPorID(idUsuario);
        const id = formulario.querySelector("#id-usuario");
        const nombre = formulario.querySelector("#nombre_usuario");
        const rol = formulario.querySelector("#rol_usuario");
        const password = formulario.querySelector("#password");

        id.value = datos.id_usuario || '';
        nombre.value = datos.nombre_usuario || '';
        password.value = datos.password || '';

        // Ajustar el valor seleccionado del rol después de cargar los roles
        rol.value = datos.rol || '';
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

async function AddUsuario(formulario) {
    const nombreUsuario = formulario.querySelector("#nombre_usuario").value.trim();
    const rolUsuario = formulario.querySelector("#rol_usuario").value; // Extrae el valor seleccionado del select
    const password = formulario.querySelector("#password").value.trim();

    if (!nombreUsuario || !rolUsuario || !password) {
        console.error('Todos los campos de usuario son obligatorios.');
        alert('Todos los campos de usuario son obligatorios.');
        return;
    }

    const usuario = {
        nombre_usuario: nombreUsuario,
        id_rol: parseInt(rolUsuario),
        password: password
    };

    const respuesta = await crearActualizarUsuario(usuario, "add")

    if (respuesta.status === 'success') {
        window.location.assign('conf_usuarios.html');
    }
}

async function EditUsuario(formulario) {
    const id = formulario.querySelector("#id-usuario").value;
    const nombreUsuario = formulario.querySelector("#nombre_usuario").value.trim();
    const rolUsuario = formulario.querySelector("#rol_usuario").value; // Extrae el valor seleccionado del select
    const password = formulario.querySelector("#password").value.trim();

    if (!nombreUsuario || !rolUsuario || !password) {
        console.error('Todos los campos de usuario son obligatorios.');
        alert('Todos los campos de usuario son obligatorios.');
        return;
    }

    const usuario = {
        nombre_usuario: nombreUsuario,
        id_rol: parseInt(rolUsuario),
        password: password
    };

    const respuesta = await crearActualizarUsuario(usuario, "edit", id)
    if (respuesta.status === 'success') {
        window.location.assign('conf_usuarios.html');
    }
}