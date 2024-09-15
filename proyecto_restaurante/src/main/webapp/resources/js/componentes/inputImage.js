
export function previewImage(event) {
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
