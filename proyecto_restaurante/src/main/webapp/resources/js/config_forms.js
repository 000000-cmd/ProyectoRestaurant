import { crearActualizarCategoria, obtenerCategoriaPorID } from "../../SolicitudesAPI/consultasSelect/gestionarCategorias.js";
import { crearActualizarPlato } from "../../SolicitudesAPI/gestionarPlatos.js";
import { crearActualizarRol, obtenerRolPorId } from "../../SolicitudesAPI/gestionarRol.js";
import { crearActualizarUsuario, obtenerUsuarioPorID } from "../../SolicitudesAPI/gestionarUsuarios.js";
import { URLs } from "../../SolicitudesAPI/URL.js";
import { previewImage } from "./componentes/inputImage.js";


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const IdForm = urlParams.get('id');
    const formulario = document.querySelector(".config_form");

    if (formulario) {
        formulario.addEventListener('submit', manejarFormularioSubmit, { once: true });
    }

    const imageInput = document.getElementById('imageUpload');

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            previewImage(e);
        });
    }

    if (formulario) {
        switch (mode) {
            case 'addDish':
                formulario.id = 'addDish';
                break;
            case 'editDish':
                formulario.id = 'editDish';
                if (IdForm) {
                    cargarDatosDelPlato(IdForm, formulario);
                } else {
                    console.log("Datos del plato no encontrados");
                }
                break;
            case 'addRol':
                formulario.id = 'addRol';
                break;
            case 'editRol':
                formulario.id = 'editRol';
                if (IdForm) {
                    cargarDatosDeRoles(IdForm, formulario);
                } else {
                    console.log("Datos del Rol no encontrados");
                }
                break;
            case 'addCategoria':
                formulario.id = 'addCategoria';
                break;
            case 'editCategoria':
                formulario.id = 'editCategoria';
                if (IdForm) {
                    cargarDatosDelCategoria(IdForm, formulario);
                } else {
                    console.log("Datos de la Categoria no encontrados");
                }
                break;
            case 'addUsuario':
                formulario.id = 'addUsuario';
                break;
            case 'editUsuario':
                formulario.id = 'editUsuario';
                if (IdForm) {
                    cargarDatosDelUsuario(IdForm, formulario);
                } else {
                    console.log("Datos del Usuario no encontrados");
                }
                break;
            default:
                console.log('Modo no reconocido, usando ID por defecto "addDish"');
                formulario.id = 'addDish';
        }
    }
});

function manejarFormularioSubmit(e) {
    e.preventDefault();
    const formulario = e.target;
    const submitButton = formulario.querySelector('button[type="submit"]');

    if (submitButton) {
        submitButton.disabled = true;
    }

    const formId = formulario.id;

    switch (formId) {
        case "addDish":
            AddDish(formulario);
            break;
        case "editDish":
            EditDish(formulario);
            break;
        case "addRol":
            AddRol(formulario);
            break;
        case "editRol":
            EditRol(formulario);
            break;
        case "addCategoria":
            AddCategoria(formulario);
            break;
        case "editCategoria":
            EditCategoria(formulario);
            break;
        case "addUsuario":
            AddUsuario(formulario);
            break;
        case "editUsuario":
            EditUsuario(formulario);
            break;
        default:
            console.log('Formulario no reconocido');
    }

    if (submitButton) {
        submitButton.disabled = false;
    }
}

async function cargarDatosDelPlato(IdPlato, formulario) {
    try {
        const response = await fetch(`${URLs}/platos/${IdPlato}`);
        const datos = await response.json();
        const data = datos.data;

        const id = formulario.querySelector("#id-plate");
        const imagenInput = formulario.querySelector("#imageUpload");
        const categoriaSelect = formulario.querySelector("#select_plate");
        const nombrePlato = formulario.querySelector("#plate_name");
        const precioPlato = formulario.querySelector("#plate_price");
        const disponiblePlato = formulario.querySelector("#plate_disponibility");
        const descripcionPlato = formulario.querySelector("#plate_details");

        id.value = data.id_plato;
        categoriaSelect.value = data.categoria;
        nombrePlato.value = data.nombre_plato;
        precioPlato.value = data.precio;
        disponiblePlato.value = data.disponibilidad;
        descripcionPlato.value = data.descripcion;

        if (data.img_plato) {
            const label = imagenInput.closest('.custom-file-upload');
            const base64Image = `data:image/jpeg;base64,${data.img_plato}`;
            label.style.backgroundImage = `url(${base64Image})`;
            label.style.color = 'transparent';
            label.style.border = 'none';
        }
    } catch (error) {
        console.error('Error al cargar datos del plato:', error);
    }
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

async function cargarDatosDelUsuario(idUsuario, formulario) {
    try {
        const datos = await obtenerUsuarioPorID(idUsuario);
        const id = formulario.querySelector("#id-usuario");
        const nombre = formulario.querySelector("#nombre_usuario");
        const rol = formulario.querySelector("#rol_usuario");
        const password = formulario.querySelector("#password");

        id.value = datos.id_usuario;
        nombre.value = datos.nombre_usuario;
        rol.value = datos.rol;
        password.value = datos.password;
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

async function cargarDatosDeRoles(idRol, formulario) {
    try {
        const datos = await obtenerRolPorId(idRol);

        // Verifica que los datos existan y que sean un objeto válido
        if (!datos || typeof datos !== 'object') {
            throw new Error('Los datos del rol son inválidos o no fueron encontrados.');
        }

        // Verifica que los elementos del formulario existan antes de intentar asignar valores
        const id = formulario.querySelector("#id-rol");
        const nombre = formulario.querySelector("#nombre_rol");

        if (id) {
            id.value = datos.id_rol || ''; // Asigna el valor o un string vacío por defecto
        } else {
            console.warn('Elemento con ID "id-rol" no encontrado en el formulario.');
        }

        if (nombre) {
            nombre.value = datos.rol || ''; // Asigna el valor o un string vacío por defecto
        } else {
            console.warn('Elemento con ID "nombre_rol" no encontrado en el formulario.');
        }

    } catch (error) {
        console.error('Error al cargar datos del rol:', error);
    }
}

function AddDish(formulario) {
    const formData = new FormData(formulario);
    crearActualizarPlato(formulario, "add");
    console.log('Añadiendo Plato:', Object.fromEntries(formData));
}

function EditDish(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-plate").value;
    crearActualizarPlato(formulario, "edit", id);
    console.log('Editando Plato:', Object.fromEntries(formData));
}

function AddRol(formulario) {
    const formData = new FormData(formulario);
    const nombreRol = formData.get('nombre_rol')?.trim();

    if (!nombreRol) {
        console.error('El nombre del rol no puede estar vacío.');
        alert('El nombre del rol no puede estar vacío.');
        return;
    }

    crearActualizarRol({ nombre_rol: nombreRol }, "add")
        .then(response => console.log('Rol añadido:', response))
        .catch(error => console.error('Error al añadir el rol:', error));
}


function EditRol(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-rol").value;
    const nombreRol = formData.get('nombre_rol')?.trim();

    if (!nombreRol) {
        console.error('El nombre del rol no puede estar vacío.');
        alert('El nombre del rol no puede estar vacío.');
        return;
    }

    crearActualizarRol({ nombre_rol: nombreRol }, "edit", id)
        .then(response => console.log('Rol editado:', response))
        .catch(error => console.error('Error al editar el rol:', error));
}


function AddCategoria(formulario) {
    const formData = new FormData(formulario);
    const categoriaName = formData.get('categoria_name')?.trim();

    if (!categoriaName) {
        console.error('El nombre de la categoría no puede estar vacío.');
        alert('El nombre de la categoría no puede estar vacío.');
        return;
    }

    crearActualizarCategoria({ categoria_name: categoriaName }, "add")
        .then(response => console.log('Categoría añadida:', response))
        .catch(error => console.error('Error al añadir la categoría:', error));
}

function EditCategoria(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-categoria").value;
    const categoriaName = formData.get('categoria_name')?.trim();

    if (!categoriaName) {
        console.error('El nombre de la categoría no puede estar vacío.');
        alert('El nombre de la categoría no puede estar vacío.');
        return;
    }

    crearActualizarCategoria({ categoria_name: categoriaName }, "edit", id)
        .then(response => console.log('Categoría editada:', response))
        .catch(error => console.error('Error al editar la categoría:', error));
}

function AddUsuario(formulario) {
    const formData = new FormData(formulario);
    const nombreUsuario = formData.get('nombre_usuario')?.trim();
    const rolUsuario = formData.get('rol_usuario')?.trim();
    const password = formData.get('password')?.trim();

    if (!nombreUsuario || !rolUsuario || !password) {
        console.error('Todos los campos de usuario son obligatorios.');
        alert('Todos los campos de usuario son obligatorios.');
        return;
    }

    crearActualizarUsuario({
        nombre_usuario: nombreUsuario,
        rol: rolUsuario,
        password: password
    }, "add")
        .then(response => console.log('Usuario añadido:', response))
        .catch(error => console.error('Error al añadir el usuario:', error));
}


function EditUsuario(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-usuario").value;
    const nombreUsuario = formData.get('nombre_usuario')?.trim();
    const rolUsuario = formData.get('rol_usuario')?.trim();
    const password = formData.get('password')?.trim();

    if (!nombreUsuario || !rolUsuario || !password) {
        console.error('Todos los campos de usuario son obligatorios.');
        alert('Todos los campos de usuario son obligatorios.');
        return;
    }

    crearActualizarUsuario({
        nombre_usuario: nombreUsuario,
        rol: rolUsuario,
        password: password
    }, "edit", id)
        .then(response => console.log('Usuario editado:', response))
        .catch(error => console.error('Error al editar el usuario:', error));
}
