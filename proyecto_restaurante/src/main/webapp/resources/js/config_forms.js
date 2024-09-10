import { agregarPlato } from "../../SolicitudesAPI/gestionarPlatos.js";
import { URLs } from "../../SolicitudesAPI/URL.js";

document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario con la clase 'config_form'
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode'); // Obtén el valor del parámetro 'mode'
    const IdForm = urlParams.get('id'); // Obtén el ID del plato desde la URL
    const formulario = document.querySelector(".config_form");

    // Cambia el ID del formulario según el modo especificado en la URL
    if (formulario) {
        switch (mode) {
            case 'addDish':
                formulario.id = 'addDish';
                break;
            case 'editDish':
                formulario.id = 'editDish';
                if(IdForm){
                    cargarDatosDelPlato(IdForm, formulario);
                }else{
                    console.log("Datos del plato no encontrados");
                }
                break;
            case 'addRol':
                formulario.id = 'addRol';
                break;
            case 'editRol':
                formulario.id = 'editRol';
                if(IdForm){
                    cargarDatosDelRol(IdForm, formulario);
                }else{
                    console.log("Datos del Rol no encontrados");
                }
                break;
            case 'addCategoria':
                formulario.id = 'addCategoria';
                break;
            case 'editCategoria':
                formulario.id = 'editCategoria';
                if(IdForm){
                    cargarDatosDelCategoria(IdForm, formulario);
                }else{
                    console.log("Datos de la Categoria no encontrados");
                }
                break;
            case 'addUsuario':
                formulario.id = 'addUsuario';
                break;
            case 'editUsuario':
                formulario.id = 'editUsuario';
                if(IdForm){
                    cargarDatosDelUsuario(IdForm, formulario);
                }else{
                    console.log("Datos del Usuario no encontrados");
                }
                break;
            default:
                console.log('Modo no reconocido, usando ID por defecto "addDish"');
                formulario.id = 'addDish'; // Por defecto o un valor seguro
        }

        // Agrega el event listener para el submit del formulario
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); 
            manejarFormularioSubmit(e);
        });
    }
});

// Manejador general para el evento submit del formulario
function manejarFormularioSubmit(e) {
    // Previene la acción por defecto del formulario
    const formulario = e.target; // Obtiene el formulario que lanzó el evento
    const formId = formulario.id; // Obtiene el ID del formulario

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
}


async function cargarDatosDelPlato(IdPlato,formulario){
    
    const response = await fetch(`${URLs}/`)
    const data = await response.json();
    const imagenInput= formulario.querySelector("#imageUpload")
    const categoriaSelect= formulario.querySelector("#select_plate")
    const nombrePlato= formulario.querySelector("#plate_name")
    const precioPlato= formulario.querySelector("#plate_price")
    const disponiblePlato= formulario.querySelector("#plate_disponibility")
    const descripcionPlato= formulario.querySelector("#plate_details")

    imagenInput.value = datosPlato.imagen; 
    categoriaSelect.value = datosPlato.categoria;
    nombrePlato.value = datosPlato.nombre;
    precioPlato.value = datosPlato.precio;
    disponiblePlato.value = datosPlato.disponibilidad;
    descripcionPlato.value = datosPlato.descripcion;
}



// Funciones específicas para cada tipo de formulario
function AddDish(formulario) {
    const formData = new FormData(formulario);
    agregarPlato(formulario)
    console.log('Añadiendo Plato:', Object.fromEntries(formData));
}

function EditDish(formulario) {
    const formData = new FormData(formulario);
    console.log('Editando Plato:', Object.fromEntries(formData));
}

// Agrega las funciones correspondientes para Rol, Categoria, Usuario, etc.
function AddRol(formulario) {
    const formData = new FormData(formulario);
    console.log('Añadiendo Rol:', Object.fromEntries(formData));
}

function EditRol(formulario) {
    const formData = new FormData(formulario);
    console.log('Editando Rol:', Object.fromEntries(formData));
}

function AddCategoria(formulario) {
    const formData = new FormData(formulario);
    console.log('Añadiendo Categoría:', Object.fromEntries(formData));
}

function EditCategoria(formulario) {
    const formData = new FormData(formulario);
    console.log('Editando Categoría:', Object.fromEntries(formData));
}

function AddUsuario(formulario) {
    const formData = new FormData(formulario);
    console.log('Añadiendo Usuario:', Object.fromEntries(formData));
}

function EditUsuario(formulario) {
    const formData = new FormData(formulario);
    console.log('Editando Usuario:', Object.fromEntries(formData));
}

