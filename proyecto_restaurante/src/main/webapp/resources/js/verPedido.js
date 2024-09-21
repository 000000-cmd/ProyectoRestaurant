import { renderSidebar } from "./sideBarComponent.js";
import { buscarPedido } from "./renderTables/renderCarruselPlatos.js"; // Importa la función buscarPedido
import { cambiarEstado } from "../../../SolicitudesAPI/gestionarPedidos.js"; // Importa la función para cambiar estado

async function verificarUsuario() {
    const rolRequerido = 'Chef'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
        document.addEventListener("DOMContentLoaded", async () => {
            renderSidebar('Chef');


            // Obtiene el ID de la mesa de los parámetros de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const idMesa = urlParams.get('id-mesa');

            // Llama a buscarPedido y espera el resultado para generar las diapositivas
            try {
                const pedido = await buscarPedido(idMesa); // Espera los datos del pedido

                // No es necesario retornar el track, ya que generarDiapositivas manipula directamente el DOM
            } catch (error) {
                console.error('Error al buscar el pedido:', error);
            }

            // Maneja los botones de "Plato realizado"
            const primaryButtons = document.querySelectorAll('.primary_button');

            primaryButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const slide = event.target.closest('.carousel-slide');

                    if (!slide) {
                        console.error('No se encontró la diapositiva correspondiente.');
                        return;
                    }

                    const realizadoText = slide.querySelector('.realizado');

                    if (!realizadoText) {
                        console.error('No se encontró el elemento .realizado dentro de la diapositiva.');
                        return;
                    }

                    // Alterna la clase 'hidden' para mostrar u ocultar el texto
                    realizadoText.classList.toggle('hidden');
                });
            });

            // Maneja la funcionalidad del botón "Despachar"
            const despacharButton = document.getElementById('despachar_button');
            despacharButton.addEventListener('click', async () => {
                // Verifica si todos los elementos .realizado están visibles
                const allRealizadoTexts = document.querySelectorAll('.carousel-slide .realizado');
                const allMarked = Array.from(allRealizadoTexts).every(realizado => !realizado.classList.contains('hidden'));

                if (allMarked) {
                    // Todos los platos están marcados como realizados, proceder con la acción
                    try {
                        await cambiarEstado(idMesa, 'Preparado'); // Cambia el estado a 'Preparado'
                        alert('Todos los platos están listos para ser despachados y el estado ha sido actualizado.');
                        // Aquí puedes añadir la lógica para redirigir o actualizar la interfaz
                    } catch (error) {
                        console.error(`Error al cambiar el estado de la mesa ${idMesa} a 'Preparado':, error`);
                        alert('Error al cambiar el estado de los platos.');
                    }
                } else {
                    // Hay platos que aún no están marcados como realizados
                    alert('Aún faltan platos por marcar como realizados.');
                }
            });

            // Funciones de navegación del carrusel...
            const track = document.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const nextButton = document.querySelector('.carousel-button--right');
            const prevButton = document.querySelector('.carousel-button--left');
            const slideWidth = slides[0].getBoundingClientRect().width;

            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });

            const moveToSlide = (track, currentSlide, targetSlide) => {
                track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
                currentSlide.classList.remove('current-slide');
                targetSlide.classList.add('current-slide');
            };

            // Deshabilitar el botón izquierdo si estamos en la primera diapositiva al cargar la página
            if (slides.length > 0) {
                prevButton.disabled = true;
            }

            nextButton.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const nextSlide = currentSlide.nextElementSibling;

                if (nextSlide) {
                    moveToSlide(track, currentSlide, nextSlide);
                }

                // Deshabilitar el botón derecho si estamos en la última diapositiva
                if (!nextSlide.nextElementSibling) {
                    nextButton.disabled = true;
                }

                // Habilitar el botón izquierdo cuando se mueve del primer slide
                prevButton.disabled = false;
            });

            prevButton.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const prevSlide = currentSlide.previousElementSibling;

                if (prevSlide) {
                    moveToSlide(track, currentSlide, prevSlide);
                }

                // Deshabilitar el botón izquierdo si estamos en la primera diapositiva
                if (!prevSlide.previousElementSibling) {
                    prevButton.disabled = true;
                }

                // Habilitar el botón derecho cuando se mueve del último slide
                nextButton.disabled = false;
            });
        });


    }
}

verificarUsuario();