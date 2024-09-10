import { obtenerPlatos, agregarPlato } from '../../SolicitudesAPI/gestionarPlatos.js'; // Asegúrate de ajustar la ruta si es necesario
import { obtenerCategorias } from '../../SolicitudesAPI/consultasSelect/gestionarCategorias.js'; // Asegúrate de ajustar la ruta si es necesario
import { renderSidebar } from "./sideBarComponent.js";

document.addEventListener('DOMContentLoaded', async () => {
    renderSidebar();
    try {
        // Obtener todas las categorías y los platos
        const categorias = await obtenerCategorias();
        const platos = await obtenerPlatos();

        // Crear las tabs para las categorías
        const tabsContainer = document.querySelector('.tabs');
        const contentContainer = document.querySelector('.tab-contents');

        if (!tabsContainer || !contentContainer) {
            console.error('Contenedores de tabs o contenido no encontrados.');
            return;
        }

        // Crear la primera tab para mostrar todos los platos
        crearTab('Todos', 'todos', tabsContainer);
        crearTabContent('todos', contentContainer, platos);

        // Crear una tab y contenido para cada categoría
        categorias.forEach(categoria => {
            crearTab(categoria.categoria, `tab-${categoria.id_categoria}`, tabsContainer);
            const platosCategoria = platos.filter(plato => plato.categoria === categoria.categoria);
            crearTabContent(`tab-${categoria.id_categoria}`, contentContainer, platosCategoria);
        });

        // Manejar la navegación de tabs
        manejarNavegacionTabs();

        // Añadir funcionalidad al botón de "Añadir nuevo plato"
        document.querySelectorAll('.new_dish').forEach(btn => {
            btn.addEventListener('click', () => {
                // Aquí podrías abrir un modal o redirigir a un formulario de creación de platos
                console.log('Abrir modal para añadir nuevo plato');
            });
        });

        // Inicializar la posición del indicador de tabs
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            const tabIndicator = document.querySelector('.tab-indicator');
            tabIndicator.style.transform = `translateX(${activeButton.offsetLeft}px)`;
            tabIndicator.style.width = `${activeButton.offsetWidth}px`;
        }
    } catch (error) {
        console.error('Error al inicializar la página:', error);
    }
});

function crearTab(nombre, id, container) {
    const button = document.createElement('button');
    button.classList.add('tab-button');
    button.dataset.tab = id;
    button.textContent = nombre;
    if (id === 'todos') {
        button.classList.add('active'); // La primera tab activa por defecto
    }
    container.appendChild(button);
}

function crearTabContent(id, container, platos) {
    const tabContent = document.createElement('div');
    tabContent.classList.add('tab-content', 'custom-scrollbar');
    tabContent.id = id;
    if (id === 'todos') {
        tabContent.classList.add('active'); // El primer contenido activo por defecto
    }

    // Crear el card "Añadir nuevo plato"
    const newDishCard = document.createElement('div');
    newDishCard.classList.add('card_container', 'new_dish');
    newDishCard.setAttribute("onclick", "window.location.href='form_plates.html?mode=add'");
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('width', '25');
    svgIcon.setAttribute('height', '25');
    svgIcon.setAttribute('viewBox', '0 0 18 18');
    svgIcon.setAttribute('fill', 'currentColor');

    const pathIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathIcon.setAttribute('d', 'M8.72266 1.66595V9.16595M8.72266 16.666V9.16595M8.72266 9.16595H16.2227M8.72266 9.16595H1.22266');
    pathIcon.setAttribute('stroke', '#FACE8D');
    pathIcon.setAttribute('stroke-width', '1.8');
    pathIcon.setAttribute('stroke-linecap', 'round');
    pathIcon.setAttribute('stroke-linejoin', 'round');

    svgIcon.appendChild(pathIcon);
    newDishCard.appendChild(svgIcon);

    const newDishText = document.createElement('div');
    const newDishHeading = document.createElement('h2');
    newDishHeading.textContent = 'Añadir nuevo plato';
    newDishText.appendChild(newDishHeading);
    newDishCard.appendChild(newDishText);
    tabContent.appendChild(newDishCard);

    // Crear cards para cada plato
    platos.forEach(plato => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card_container');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img_card__container', 'img_dish__container');
        if (plato.img_plato) {
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64,${plato.img_plato}`;
            imgElement.alt = plato.nombre_plato;
            imgContainer.appendChild(imgElement);
        }
        cardContainer.appendChild(imgContainer);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details_card__container');
        const titleElement = document.createElement('h2');
        titleElement.textContent = plato.nombre_plato;
        detailsContainer.appendChild(titleElement);
        const priceElement = document.createElement('p');
        priceElement.classList.add('small');
        priceElement.textContent = `$${plato.precio}`;
        detailsContainer.appendChild(priceElement);
        cardContainer.appendChild(detailsContainer);

        const editContainer = document.createElement('div');
        editContainer.classList.add('editButton_card__container', 'edit_dish__button');
        const editButton = document.createElement('button');
        editButton.classList.add('edit_dish__button', 'low_opacity_button');
        editButton.setAttribute("onclick", `window.location.href='formulario.html?mode=edit&id=${plato.platoId}'`);
        editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor"> <path d="M17.3415 16.2089C17.7052 16.2089 18 16.498 18 16.8545C18 17.1813 17.7523 17.4514 17.4308 17.4941L17.3415 17.5H10.471C10.1073 17.5 9.81246 17.211 9.81246 16.8545C9.81246 16.5277 10.0602 16.2576 10.3816 16.2148L10.471 16.2089H17.3415ZM10.6592 1.41662C11.906 0.194461 13.9283 0.194461 15.175 1.41662L16.4694 2.6854C17.7162 3.90755 17.7162 5.88985 16.4694 7.112L6.74061 16.6486C6.1843 17.1939 5.43007 17.4999 4.64282 17.4999H0.658541C0.288415 17.4999 -0.00901523 17.201 0.000208899 16.8383L0.100432 12.8975C0.120357 12.1526 0.43127 11.4425 0.968667 10.9157L10.6592 1.41662ZM9.906 3.979L1.89998 11.8287C1.60126 12.1215 1.42814 12.5169 1.41707 12.9305L1.33345 16.2084L4.64282 16.2088C5.03222 16.2088 5.4067 16.0745 5.70228 15.8317L5.8093 15.7357L13.855 7.849L9.906 3.979ZM14.2437 2.32953C13.5113 1.61156 12.323 1.61156 11.5905 2.32953L10.838 3.066L14.786 6.936L15.5381 6.19909C16.2298 5.52101 16.2683 4.44433 15.6534 3.72195L15.5381 3.59831L14.2437 2.32953Z" fill="currentColor"/> </svg> Editar plato';
        editContainer.appendChild(editButton);
        cardContainer.appendChild(editContainer);

        tabContent.appendChild(cardContainer);
    });

    container.appendChild(tabContent);
}

function manejarNavegacionTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Remover la clase activa de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activar la tab y contenido seleccionados
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');

            // Mover el indicador al botón activo
            tabIndicator.style.transform = `translateX(${button.offsetLeft}px)`;
            tabIndicator.style.width = `${button.offsetWidth}px`;
        });
    });
}
