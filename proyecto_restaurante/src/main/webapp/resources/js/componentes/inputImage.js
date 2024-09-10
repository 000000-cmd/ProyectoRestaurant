document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageUpload');

    if (imageInput) {
        imageInput.addEventListener('change', previewImage);
    }
});

function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function () {
        // Establecer la imagen como fondo del label
        const label = input.closest('.custom-file-upload');
        label.style.backgroundImage = `url(${reader.result})`;
        label.style.color = 'transparent'; // Opcional: Oculta el texto si lo deseas
        label.style.border = 'none'; // Opcional: Remueve el borde
    }

    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]); // Lee el archivo seleccionado
    }
}



/*
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageUpload');
    const label = document.querySelector('.custom-file-upload');

    // Cargar una imagen existente (ej. cuando se edita un plato)
    const existingImageUrl = 'ruta/a/la/imagen/existente.jpg'; // Reemplaza con la URL real de la imagen
    if (existingImageUrl) {
        // Establecer la imagen como fondo del label al cargar la página
        label.style.backgroundImage = `url(${existingImageUrl})`;
        label.style.color = 'transparent'; // Oculta el texto si lo deseas
        label.style.border = 'none'; // Remueve el borde si lo deseas
    }

    // Configura la funcionalidad de vista previa para una nueva imagen cargada
    if (imageInput) {
        imageInput.addEventListener('change', previewImage);
    }
});

function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function () {
        // Establecer la imagen como fondo del label
        const label = input.closest('.custom-file-upload');
        label.style.backgroundImage = `url(${reader.result})`;
        label.style.color = 'transparent'; // Opcional: Oculta el texto si lo deseas
        label.style.border = 'none'; // Opcional: Remueve el borde
    }

    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]); // Lee el archivo seleccionado
    }
}
    */  