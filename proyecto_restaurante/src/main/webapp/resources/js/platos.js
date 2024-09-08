document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabIndicator = document.querySelector('.tab-indicator');

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remover la clase activa de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Mover el indicador al botón activo
            tabIndicator.style.transform = `translateX(${button.offsetLeft}px)`;
            tabIndicator.style.width = `${button.offsetWidth}px`; // Ajusta el ancho del indicador al ancho del botón

            // Mostrar el contenido correspondiente
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Inicializar la posición del indicador
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) {
        tabIndicator.style.transform = `translateX(${activeButton.offsetLeft}px)`;
        tabIndicator.style.width = `${activeButton.offsetWidth}px`;
    }
});
