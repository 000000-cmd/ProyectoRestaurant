// utils.js

export function setupFormListeners() {
    const imageInput = document.getElementById('imageUpload');

    if (imageInput) {
        imageInput.addEventListener("change", (e) => {
            previewImage(e);
            imageInput.removeAttribute('data-loaded'); // Remover la bandera de imagen cargada desde el servidor
        });
    }
}

export function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.querySelector('.custom-file-upload'); // Selecciona el label
        output.style.backgroundImage = `url(${reader.result})`; // Aplica la imagen como fondo
        output.querySelector('h2').style.display = 'none'; // Oculta el texto "Añadir Plato"
    };
    reader.readAsDataURL(event.target.files[0]);
}

