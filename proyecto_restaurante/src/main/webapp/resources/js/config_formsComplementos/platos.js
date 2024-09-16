// platos.js
import { crearActualizarPlato, borrarPlato } from "../../../SolicitudesAPI/gestionarPlatos.js";
import { URLs } from "../../../SolicitudesAPI/URL.js";
import { previewImage } from "./utils.js";
import { validarPrecio, validarTexto } from "../ValidarFormularios.js";

export function handlePlatosForm(mode, IdForm, formulario) {
    if (mode === 'editDish' && IdForm) {
        cargarDatosDelPlato(IdForm, formulario);
        const tituloForm= document.querySelector(".form_title h2")
        tituloForm.textContent="Editar Plato existente"
        const buttonForm= document.querySelector(".primary_button")
        buttonForm.textContent="Editar"
    }

    formulario.id = mode;
    const imageInput = document.querySelector("#imageUpload");
    imageInput.addEventListener("change", (e) => {        
        previewImage(e);
    });

    document.addEventListener("submit",(e)=>{
        e.preventDefault()
        const result= Validarformulario(formulario) 
        if (result){
            if (mode === 'addDish') {
                AddDish(formulario);
            } else if (mode === 'editDish') {
                EditDish(formulario);
            }
        }else{
            alert("Hay campos sin llenar!")
        }
    })
    const deleteButton= document.querySelector("#deleteButton")
    deleteButton.addEventListener("click", ()=>{
        borrarplato(IdForm)
    })


}

function Validarformulario(formulario) {
    const formData = new FormData(formulario);
    const img_plato = formData.get('img_plato'); // Archivo de imagen
    const id_categoria = formData.get('id_categoria');
    const nombre_plato = formData.get('nombre_plato');
    const precio = formData.get('precio');
    const disponibilidad = formData.get('disponibilidad');
    const descripcion = formData.get('descripcion');

    let isValid = true;
    let errors = [];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

    // Validar imagen del plato
    if (!img_plato || img_plato.size === 0) {
        isValid = false;
        errors.push('Debe seleccionar una imagen para el plato.');
    } else if (img_plato.size > maxSizeInBytes) {
        isValid = false;
        errors.push(`La imagen es demasiado grande. El tamaño máximo permitido es de ${maxSizeInBytes / (1024 * 1024)} MB.`);
    }
    
    // Validar categoría del plato
    if (!id_categoria || id_categoria.trim() === '') {
        isValid = false;
        errors.push('Debe seleccionar una categoría para el plato.');
    }

    // Validar nombre del plato
    if (!nombre_plato || nombre_plato.trim() === '') {
        isValid = false;
        errors.push('El nombre del plato es obligatorio.');
    } else if (!validarTexto(nombre_plato)) {
        isValid = false;
        errors.push('El nombre del plato contiene caracteres inválidos.');
    }

    // Validar precio del plato
    if (!precio || precio.trim() === '') {
        isValid = false;
        errors.push('El precio del plato es obligatorio.');
    } else if (!validarPrecio(precio)) {
        isValid = false;
        errors.push('El precio del plato debe ser un número válido.');
    }

    // Validar disponibilidad del plato
    if (!disponibilidad || disponibilidad.trim() === '') {
        isValid = false;
        errors.push('Debe seleccionar la disponibilidad del plato.');
    } else if (disponibilidad !== 'Disponible' && disponibilidad !== 'NoDisponible') {
        isValid = false;
        errors.push('Valor de disponibilidad inválido.');
    }

    // Validar descripción del plato
    if (!descripcion || descripcion.trim() === '') {
        isValid = false;
        errors.push('La descripción del plato es obligatoria.');
    }

    // Mostrar errores si los hay
    if (!isValid) {
        alert(errors.join('\n'));
    }

    return isValid;
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

async function AddDish(formulario) {
    const formData = new FormData(formulario);
    const respuesta=  await crearActualizarPlato(formulario, "add");
    console.log(respuesta);
    
    if (respuesta.status === 'success') {
        window.location.assign('gestion_platos.html');

    }
    console.log('Añadiendo Plato:', Object.fromEntries(formData));
}

async function EditDish(formulario) {
    const formData = new FormData(formulario);
    const id = formulario.querySelector("#id-plate").value;
    const respuesta= await crearActualizarPlato(formulario, "edit", id);

    if (respuesta.status === 'success') {
        window.location.assign('gestion_platos.html');

    }

    console.log('Editando Plato:', Object.fromEntries(formData));
}
async function borrarplato(id_plato) {
    const confirmacion= confirm("¡Estas seguro de eliminar el plato?")
    if(confirmacion){
        const respuesta= await borrarPlato(id_plato)
        console.log(respuesta);
        
        if (respuesta.status === 'success') {
            window.location.assign('gestion_platos.html');
             }

    }
}

