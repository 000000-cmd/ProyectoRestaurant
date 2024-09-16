import { crearTabContentMesero, crearTab, manejarNavegacionTabs } from "./renderTables/renderPlatesMenu.js";
import { renderSidebar } from "./sideBarComponent.js";
import { obtenerCategorias } from '../../SolicitudesAPI/consultasSelect/gestionarCategorias.js'; // Asegúrate de ajustar la ruta si es necesario
import { obtenerPlatos } from '../../SolicitudesAPI/gestionarPlatos.js';
import { renderImage } from "./componentes/renderImage.js";
import { enviarPedido, pedidoCompleto_Mesa } from "../../SolicitudesAPI/gestionarPedidos.js";

document.addEventListener("DOMContentLoaded", async ()=>{
    renderSidebar('Mesero');
    const $submitButton = document.querySelector('#enviar-pedido');

    const urlParams = new URLSearchParams(window.location.search);
    const mesaId = urlParams.get('id'); // Obtén el ID del pedido desde la URL
    if (mesaId) {
        // Lógica para cargar el pedido existente utilizando el ID del pedido
        const numero = parseInt(mesaId.replace('mesa', ''), 10); // Reemplaza "mesa" por una cadena vacía
        const result= await pedidoCompleto_Mesa(numero); // Asegúrate de implementar esta función    
        renderOrderItem(result); // Llama a la función para renderizar las órdenes en el aside
    }

    try {

        // Obtener todas las categorías y los platos
        const categorias = await obtenerCategorias();
        const platos = await obtenerPlatos();
        console.log(platos);
        
        // Crear las tabs para las categorías
        const tabsContainer = document.querySelector('.tabs');
        const contentContainer = document.querySelector('.tab-contents');

        if (!tabsContainer || !contentContainer) {
            console.error('Contenedores de tabs o contenido no encontrados.');
            return;
        }

        // Crear la primera tab para mostrar todos los platos
        crearTab('Todos', 'todos', tabsContainer);
        crearTabContentMesero('todos', contentContainer, platos);
        document.querySelectorAll('.card_container').forEach(card => {
            card.addEventListener('click', () => {
                const plateId = card.getAttribute('data-plate').split('-')[1]; // Obtiene el ID del plato
                const selectedPlate = platos.find(plato => plato.id_plato == plateId); // Encuentra el plato correspondiente
                if (selectedPlate) {
                    addOrderItem(selectedPlate); // Llama a la función para agregar el item de pedido
                }
            });
        });

        // Crear una tab y contenido para cada categoría
        categorias.forEach(categoria => {
            crearTab(categoria.categoria, `tab-${categoria.id_categoria}`, tabsContainer);
            const platosCategoria = platos.filter(plato => plato.categoria === categoria.categoria);
            crearTabContentMesero(`tab-${categoria.id_categoria}`, contentContainer, platosCategoria);
        });

        // Manejar la navegación de tabs
        manejarNavegacionTabs();

        // Añadir funcionalidad al botón de "Añadir nuevo plato"
        document.querySelectorAll('.card_container').forEach(btn => {
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

    // Delegación de eventos para manejar clicks en botones dentro de cada order-item
    document.querySelector('.order_items').addEventListener('click', (event) => {
        const target = event.target;

        // Maneja el clic en el botón "Añadir Detalle"
        const addDetailButton = target.closest('.add-detail-button');
        if (addDetailButton) {
            event.preventDefault();
            addDetailToOrderItem(addDetailButton);
        }
    
        // Maneja el clic en el botón "Mostrar Detalles"
        const showDetailsButton = target.closest('.show-details-list');
        if (showDetailsButton) {
            event.preventDefault();
            mostrarListaDetalles(showDetailsButton);
        }
    });

    $submitButton.addEventListener('click', async (e) => {
        console.log('Botón clicado');
        e.preventDefault();
    
        const form = document.querySelector('#pedido-form');
        if (!form) {
            console.error('Formulario no encontrado');
            return;
        }
    
        console.log('Elementos del formulario:', form.elements);
    
        try {
            const formData = new FormData(form);
            console.log('Contenido inicial de FormData:', [...formData.entries()]);
    
            // Selecciona el input fuera del formulario
            const extraInput = document.querySelector('#numero-mesa');
    
            if (extraInput) {
                // Añade el input al FormData
                formData.append(extraInput.name, extraInput.value);
                console.log(`Añadido ${extraInput.name}: ${extraInput.value} a FormData`);
            } else {
                console.error('Input adicional no encontrado');
            }
    
            console.log('Contenido de FormData después de añadir el extra input:', [...formData.entries()]);
            console.log(formData);
            
            // Llamada a la función de envío
            await enviarPedido(formData);
            alert('Pedido enviado exitosamente!');
            
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al enviar el pedido. Por favor, intente de nuevo.');
        }
    });
    
    
})


async function renderOrderItem(pedido) {
    const orderItemsContainer = document.querySelector('.order_items');

    // Obtener todos los platos para acceder a su información completa
    const platos = await obtenerPlatos();

    // Crear un mapa para agrupar los detalles por id_plato
    const detallesPorPlato = {};
    pedido.detalles.forEach(detalle => {
        if (!detallesPorPlato[detalle.id_plato]) {
            detallesPorPlato[detalle.id_plato] = [];
        }
        detallesPorPlato[detalle.id_plato].push(detalle);
    });

    pedido.contenidos.forEach(contenido => {
        const plato = platos.find(p => p.id_plato == contenido.id_plato);
        if (!plato) {
            console.error(`Plato con id ${contenido.id_plato} no encontrado.`);
            return;
        }

        // Crear el elemento de orden de la misma manera que en addOrderItem
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        // Contenedor de imagen
        const itemImage = document.createElement('div');
        itemImage.classList.add('item-image');
        const imgElement = document.createElement('img');
        imgElement.src = renderImage(plato.img_plato);
        imgElement.alt = plato.nombre_plato;
        itemImage.appendChild(imgElement);

        // Contenedor de nombre y precio
        const itemName = document.createElement('div');
        itemName.classList.add('item-name');
        itemName.id = `id_plato${plato.id_plato}`;
        const titleElement = document.createElement('h4');
        titleElement.textContent = plato.nombre_plato;
        const priceElement = document.createElement('p');
        priceElement.classList.add('item-price');
        priceElement.textContent = `$${plato.precio}`;
        itemName.appendChild(titleElement);
        itemName.appendChild(priceElement);

        // Contenedor de cantidad
        const itemQuantity = document.createElement('div');
        itemQuantity.classList.add('item-quantity', 'form_input', 'input_mini');
        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.name = `cantidad_plato${plato.id_plato}`;
        quantityInput.value = contenido.cantidad_plato;
        quantityInput.id = `cantidad_plato${plato.id_plato}`;
        itemQuantity.appendChild(quantityInput);

        // Actualizar el precio total al cambiar la cantidad
        const itemTotalPrice = document.createElement('div');
        itemTotalPrice.classList.add('item-total-price');
        const totalPriceElement = document.createElement('p');
        const updateTotalPrice = () => {
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const totalPrice = (plato.precio * quantity).toFixed(2);
            totalPriceElement.textContent = `$${totalPrice}`;
        };
        quantityInput.addEventListener('input', updateTotalPrice);
        updateTotalPrice(); // Inicializar el precio total
        itemTotalPrice.appendChild(totalPriceElement);

        // Botón de eliminación
        const itemDelete = document.createElement('div');
        itemDelete.classList.add('item-delete');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('orden-button', 'delete-button');
        // SVG para el botón de eliminar (omitido por brevedad)

        // Crear el SVG para el botón de eliminar
        const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        deleteIcon.setAttribute('width', '16');
        deleteIcon.setAttribute('height', '18');
        deleteIcon.setAttribute('viewBox', '0 0 16 18');
        deleteIcon.setAttribute('fill', 'none');

        // Crear la ruta del SVG
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M13.7325 6.26552L13.8153 6.26665C14.1229 6.29208 14.3587 6.54747 14.375 6.85488L14.3671 7.02629L14.105 10.2357L13.8301 13.3676C13.7719 13.9929 13.7198 14.5202 13.6749 14.9354C13.5187 16.3821 12.5796 17.2768 11.1638 17.3033C8.95781 17.344 6.83731 17.3436 4.7781 17.2991C3.40331 17.2702 2.47805 16.3659 2.32462 14.9412L2.21858 13.8916L2.03328 11.8557L1.84347 9.62156L1.62643 6.93973C1.59946 6.59565 1.84959 6.2943 2.18512 6.26664C2.49269 6.24128 2.76525 6.4547 2.82932 6.75548L2.85426 7.00128L3.05805 9.51543L3.28057 12.1214C3.38038 13.2495 3.46695 14.1625 3.53622 14.8038C3.62365 15.6157 4.05115 16.0335 4.80343 16.0493C6.84654 16.0935 8.95123 16.0939 11.1417 16.0534C11.9398 16.0385 12.374 15.6248 12.4633 14.7976L12.5689 13.7536C12.5998 13.4319 12.6328 13.0767 12.6678 12.6909L12.8905 10.128L13.1588 6.83942C13.1836 6.52402 13.4327 6.28226 13.7325 6.26552ZM1.10949 4.82416C0.772879 4.82416 0.5 4.54432 0.5 4.19913C0.5 3.88271 0.729294 3.6212 1.02679 3.57982L1.10949 3.57411H3.76476C4.0803 3.57411 4.35654 3.3659 4.45535 3.06591L4.47953 2.97328L4.68587 1.92094C4.86759 1.22398 5.45767 0.727748 6.14916 0.67178L6.27993 0.666504H9.7199C10.4229 0.666504 11.0436 1.12173 11.2826 1.82516L11.3228 1.95991L11.5203 2.97303C11.5822 3.29044 11.8354 3.5275 12.1417 3.56798L12.2351 3.57411H14.8905C15.2271 3.57411 15.5 3.85394 15.5 4.19913C15.5 4.51556 15.2707 4.77706 14.9732 4.81845L14.8905 4.82416H1.10949ZM9.7199 1.91655H6.27993C6.10892 1.91655 5.95691 2.01919 5.89377 2.14819L5.87235 2.20487L5.67483 3.21849C5.65067 3.34221 5.61566 3.46134 5.57093 3.57493L10.429 3.57509C10.4011 3.50422 10.377 3.43119 10.3569 3.35624L10.325 3.21824L10.1364 2.24384C10.0923 2.07477 9.95612 1.95099 9.79185 1.92269L9.7199 1.91655Z');
        path.setAttribute('fill', 'currentColor');
        // Añadir los elementos SVG al botón

        deleteIcon.appendChild(path);
        deleteButton.appendChild(deleteIcon);
        
        // Añadir el botón al contenedor
        itemDelete.appendChild(deleteButton);
        
        // Añadir funcionalidad para eliminar el plato
        deleteButton.addEventListener('click', () => {
            orderItem.remove();
        });
        itemDelete.appendChild(deleteButton);

        // Contenedor de detalles
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('item-details', 'form_input');
        itemDetails.id = `id_plato_detalles${plato.id_plato}`;
        const detailsInput = document.createElement('input');
        detailsInput.type = 'text';
        detailsInput.name = `Adddetalles_plato_${plato.id_plato}`;
        detailsInput.id = `Adddetalles_plato_${plato.id_plato}`;
        itemDetails.appendChild(detailsInput);

        // Contenedor de platos afectados
        const platesAffected = document.createElement('div');
        platesAffected.classList.add('plates-afected', 'form_input', 'input_mini');
        const affectedInput = document.createElement('input');
        affectedInput.type = 'text';
        affectedInput.name = `Addplatos_afectados${plato.id_plato}`;
        affectedInput.value = '1';
        affectedInput.id = `Addplatos_afectados${plato.id_plato}`;
        platesAffected.appendChild(affectedInput);

        // Botón para añadir detalle
        const addDetailButton = document.createElement('div');
        addDetailButton.classList.add('add-detail-button');
        const addButton = document.createElement('button');
        addButton.classList.add('orden-button', 'add-button');
        addButton.type = 'button';
        // SVG para el botón de añadir detalle (omitido por brevedad)
        addDetailButton.appendChild(addButton);
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('width', '1em');
        svgIcon.setAttribute('height', '1em');
        svgIcon.setAttribute('viewBox', '0 0 24 24');
    
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('fill', 'currentColor');
        path1.setAttribute('stroke', 'currentColor');
        path1.setAttribute('stroke-linecap', 'round');
        path1.setAttribute('stroke-linejoin', 'round');
        path1.setAttribute('stroke-width', '2');
        path1.setAttribute('d', 'M12 5v14m-7-7h14');
    
        // Añadir el path al SVG
        svgIcon.appendChild(path1);
    
        // Añadir el SVG al botón
        addButton.appendChild(svgIcon);
    
        // Añadir el botón al contenedor
        addDetailButton.appendChild(addButton);
        // Botón para mostrar lista de detalles
        const showDetailsList = document.createElement('div');
        showDetailsList.classList.add('show-details-list');
        const showButton = document.createElement('button');
        showButton.classList.add('orden-button', 'show-button');
        showButton.type = 'button';
        // SVG para el botón (omitido por brevedad)
        
        // Crear el SVG y añadirlo al botón
        const svgIcon1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon1.setAttribute('width', '1em');
        svgIcon1.setAttribute('height', '1em');
        svgIcon1.setAttribute('viewBox', '0 0 512 512');

        const path11 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path11.setAttribute('d', 'M113.7 304C86.2 304 64 282.6 64 256c0-26.5 22.2-48 49.7-48 27.6 0 49.8 21.5 49.8 48 0 26.6-22.2 48-49.8 48z');
        path11.setAttribute('fill', 'currentColor');

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M256 304c-27.5 0-49.8-21.4-49.8-48 0-26.5 22.3-48 49.8-48 27.5 0 49.7 21.5 49.7 48 0 26.6-22.2 48-49.7 48z');
        path2.setAttribute('fill', 'currentColor');

        const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path3.setAttribute('d', 'M398.2 304c-27.5 0-49.8-21.4-49.8-48 0-26.5 22.2-48 49.8-48 27.5 0 49.8 21.5 49.8 48 0 26.6-22.2 48-49.8 48z');
        path3.setAttribute('fill', 'currentColor');

        // Añadir los elementos path al SVG
        svgIcon1.appendChild(path11);
        svgIcon1.appendChild(path2);
        svgIcon1.appendChild(path3);

        // Añadir el SVG al botón
        showButton.appendChild(svgIcon1);
        showDetailsList.appendChild(showButton);

        // Contenedor para los detalles añadidos
        const addedDetails = document.createElement('div');
        addedDetails.classList.add('added-details');
        addedDetails.id = `id-plato${plato.id_plato}`;

        // Si hay detalles para este plato, agregarlos
        const detallesDelPlato = detallesPorPlato[plato.id_plato] || [];
        detallesDelPlato.forEach((detalle, index) => {
            const detailItem = document.createElement('div');
            detailItem.classList.add('detail-item');

            const titleDetail = document.createElement('div');
            titleDetail.classList.add('header_details-item');
            const detalleLabel = document.createElement('p');
            detalleLabel.textContent = `Detalle ${index + 1}`;
            const cantidadLabel = document.createElement('p');
            cantidadLabel.textContent = 'Platos afectados';
            titleDetail.appendChild(detalleLabel);
            titleDetail.appendChild(cantidadLabel);

            const inputsContainer = document.createElement('div');
            inputsContainer.classList.add('form_input', 'editDetails_input');

            const detailText = document.createElement('input');
            detailText.type = 'text';
            detailText.name = `detalles_plato_${plato.id_plato}`;
            detailText.id = `detalles_plato_${plato.id_plato}`;
            detailText.value = detalle.detalles_plato;
            detailText.readOnly = true;

            const cantAfectedContainer = document.createElement('div');
            cantAfectedContainer.classList.add('form_input', 'input_mini');

            const affectedPlates = document.createElement('input');
            affectedPlates.type = 'text';
            affectedPlates.name = `PlatosAfectadosDetalle_${plato.id_plato}_${index + 1}`;
            affectedPlates.id = `PlatosAfectadosDetalle_${plato.id_plato}_${index + 1}`;
            affectedPlates.value = detalle.cantidad_platos_modificacion;
            affectedPlates.readOnly = true;

            // Botón para eliminar detalle
            const deleteDetailButton = document.createElement('button');
            deleteDetailButton.classList.add('orden-button', 'delete-button');
            // SVG para el botón de eliminar detalle (omitido por brevedad)
            
            deleteDetailButton.addEventListener('click', () => {
                detailItem.remove();
                updateDetailNumbers(addedDetails);
            });

            cantAfectedContainer.appendChild(affectedPlates);
            cantAfectedContainer.appendChild(deleteDetailButton);
            inputsContainer.appendChild(detailText);
            inputsContainer.appendChild(cantAfectedContainer);
            detailItem.appendChild(titleDetail);
            detailItem.appendChild(inputsContainer);

            addedDetails.appendChild(detailItem);
        });

        // Añadir todos los elementos al orderItem
        orderItem.appendChild(itemImage);
        orderItem.appendChild(itemName);
        orderItem.appendChild(itemQuantity);
        orderItem.appendChild(itemTotalPrice);
        orderItem.appendChild(itemDelete);
        orderItem.appendChild(itemDetails);
        orderItem.appendChild(platesAffected);
        orderItem.appendChild(addDetailButton);
        orderItem.appendChild(showDetailsList);
        orderItem.appendChild(addedDetails);

        // Añadir el orderItem al contenedor principal
        orderItemsContainer.appendChild(orderItem);
    });
}


function addDetailToOrderItem(button){
    const orderItem = button.closest('.order-item'); // Encuentra el contenedor de orden actual
    const detailInput = orderItem.querySelector('input[id^="Adddetalles_plato_"]'); // Selecciona el input de detalle específico
    const affectedPlatesInput = orderItem.querySelector('input[id^="Addplatos_afectados"]'); // Selecciona el input de platos afectados específico
    const addedDetailsContainer = orderItem.querySelector('.added-details'); // Selecciona el contenedor de detalles añadidos
    const quantityInput = orderItem.querySelector('input[id^="cantidad_plato"]'); // Selecciona el input de cantidad de platos específico
    const idPlato = orderItem.querySelector('.item-name').id.replace('id_plato', ''); // Obtiene el ID del plato desde el contenedor de nombre

    
    let detailCount = addedDetailsContainer.children.length; // Cuenta los detalles ya añadidos

    // Verifica si se puede añadir otro detalle
    const maxPlates = parseInt(quantityInput.value, 10); // Convierte el valor a número
    if (detailCount >= maxPlates) {
        alert('No puedes añadir más detalles que el número de platos disponibles.');
        return; // Sale de la función sin añadir más detalles
    }

    detailCount++; // Incrementa el contador de detalles

    // Crear un contenedor para el nuevo detalle
    const detailItem = document.createElement('div');
    detailItem.classList.add('detail-item');

    const titleDetail = document.createElement("div");
    titleDetail.classList.add("header_details-item");

    const detalleLabel = document.createElement("p");
    detalleLabel.textContent = `Detalle ${detailCount}`; // Asigna el número del detalle
    const cantidadLabel = document.createElement("p");
    cantidadLabel.textContent = "Platos afectados";
    titleDetail.appendChild(detalleLabel);
    titleDetail.appendChild(cantidadLabel);

    // Crear y configurar los inputs para mostrar los detalles añadidos
    const inputsContainer = document.createElement("div");
    inputsContainer.classList.add("form_input", "editDetails_input");

    const detailText = document.createElement('input');
    detailText.type = 'text';
    detailText.name = `detalles_plato_${idPlato}`; // Asegura un nombre único para cada detalle
    detailText.id = `detalles_plato_${idPlato}`; // Actualiza el ID
    detailText.value = detailInput.value;
    detailText.readOnly = true;

    const cantAfectedContainer = document.createElement("div");
    cantAfectedContainer.classList.add("form_input", "input_mini");

    const affectedPlates = document.createElement('input');
    affectedPlates.type = 'text';
    affectedPlates.name = `PlatosAfectadosDetalle_${idPlato}_${detailCount}`; // Asegura un nombre único que refleje el ID de plato y el detalle
    affectedPlates.id = `PlatosAfectadosDetalle_${idPlato}_${detailCount}`; // Actualiza el ID
    affectedPlates.value = affectedPlatesInput.value;
    affectedPlates.readOnly = true;

    // Crear el botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('orden-button','delete-button');
    
    // Crear el SVG para el botón de eliminar
    const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    deleteIcon.setAttribute('width', '16');
    deleteIcon.setAttribute('height', '18');
    deleteIcon.setAttribute('viewBox', '0 0 16 18');
    deleteIcon.setAttribute('fill', 'none');

    // Crear la ruta del SVG
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M13.7325 6.26552L13.8153 6.26665C14.1229 6.29208 14.3587 6.54747 14.375 6.85488L14.3671 7.02629L14.105 10.2357L13.8301 13.3676C13.7719 13.9929 13.7198 14.5202 13.6749 14.9354C13.5187 16.3821 12.5796 17.2768 11.1638 17.3033C8.95781 17.344 6.83731 17.3436 4.7781 17.2991C3.40331 17.2702 2.47805 16.3659 2.32462 14.9412L2.21858 13.8916L2.03328 11.8557L1.84347 9.62156L1.62643 6.93973C1.59946 6.59565 1.84959 6.2943 2.18512 6.26664C2.49269 6.24128 2.76525 6.4547 2.82932 6.75548L2.85426 7.00128L3.05805 9.51543L3.28057 12.1214C3.38038 13.2495 3.46695 14.1625 3.53622 14.8038C3.62365 15.6157 4.05115 16.0335 4.80343 16.0493C6.84654 16.0935 8.95123 16.0939 11.1417 16.0534C11.9398 16.0385 12.374 15.6248 12.4633 14.7976L12.5689 13.7536C12.5998 13.4319 12.6328 13.0767 12.6678 12.6909L12.8905 10.128L13.1588 6.83942C13.1836 6.52402 13.4327 6.28226 13.7325 6.26552ZM1.10949 4.82416C0.772879 4.82416 0.5 4.54432 0.5 4.19913C0.5 3.88271 0.729294 3.6212 1.02679 3.57982L1.10949 3.57411H3.76476C4.0803 3.57411 4.35654 3.3659 4.45535 3.06591L4.47953 2.97328L4.68587 1.92094C4.86759 1.22398 5.45767 0.727748 6.14916 0.67178L6.27993 0.666504H9.7199C10.4229 0.666504 11.0436 1.12173 11.2826 1.82516L11.3228 1.95991L11.5203 2.97303C11.5822 3.29044 11.8354 3.5275 12.1417 3.56798L12.2351 3.57411H14.8905C15.2271 3.57411 15.5 3.85394 15.5 4.19913C15.5 4.51556 15.2707 4.77706 14.9732 4.81845L14.8905 4.82416H1.10949ZM9.7199 1.91655H6.27993C6.10892 1.91655 5.95691 2.01919 5.89377 2.14819L5.87235 2.20487L5.67483 3.21849C5.65067 3.34221 5.61566 3.46134 5.57093 3.57493L10.429 3.57509C10.4011 3.50422 10.377 3.43119 10.3569 3.35624L10.325 3.21824L10.1364 2.24384C10.0923 2.07477 9.95612 1.95099 9.79185 1.92269L9.7199 1.91655Z');
    path.setAttribute('fill', 'currentColor');
    // Añadir los elementos SVG al botón

    deleteIcon.appendChild(path);
    deleteButton.appendChild(deleteIcon);
    

    // Añadir funcionalidad para eliminar el detalle
    deleteButton.addEventListener('click', () => {
        detailItem.remove(); // Elimina el contenedor del detalle
        updateDetailNumbers(addedDetailsContainer); // Actualiza la numeración de los detalles y los IDs
    });

    // Añadir los inputs y el botón de eliminar al contenedor de detalle
    cantAfectedContainer.appendChild(affectedPlates);
    cantAfectedContainer.appendChild(deleteButton); // Añadir el botón al contenedor
    inputsContainer.appendChild(detailText);
    inputsContainer.appendChild(cantAfectedContainer);
    detailItem.appendChild(titleDetail);
    detailItem.appendChild(inputsContainer);

    // Añadir el contenedor de detalle al contenedor principal de detalles añadidos
    addedDetailsContainer.appendChild(detailItem);

    // Limpiar los inputs originales
    detailInput.value = '';
    affectedPlatesInput.value = '1'; // Reinicia el valor a 1
}
// Función para mostrar u ocultar la lista de detalles y añadir la clase
function mostrarListaDetalles(button){
    const orderItem = button.closest('.order-item'); // Encuentra el contenedor de orden actual
    console.log(orderItem);
    
    const addedDetailsContainer = orderItem.querySelector('.added-details'); // Selecciona el contenedor de detalles añadidos

    // Alterna la visibilidad del contenedor de detalles añadidos
    const isHidden = addedDetailsContainer.style.display === 'none' || addedDetailsContainer.style.display === '';
    addedDetailsContainer.style.display = isHidden ? 'block' : 'none';

    // Añadir o quitar la clase .pressed-button al botón
    if (isHidden) {
        button.classList.add('pressed-button'); // Añade la clase si el contenedor se muestra
    } else {
        button.classList.remove('pressed-button'); // Remueve la clase si el contenedor se oculta
    }
}


// Función para actualizar la numeración y los IDs de los detalles después de eliminar alguno
function updateDetailNumbers(container) {
    const detailItems = container.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
        const titleDetail = item.querySelector('.header_details-item p:first-child');
        titleDetail.textContent = `Detalle ${index + 1}`; // Actualiza el número del detalle

        // Actualiza los IDs de los inputs para mantener la consistencia
    });
}

// Función para crear el item de pedido en order_items
function addOrderItem(plato) {
    const orderItemsContainer = document.querySelector('.order_items');

    const orderItem = document.createElement('div');
    orderItem.classList.add('order-item');

    // Contenedor de imagen
    const itemImage = document.createElement('div');
    itemImage.classList.add('item-image');
    const imgElement = document.createElement('img');
    imgElement.src = renderImage(plato.img_plato);
    imgElement.alt = plato.nombre_plato;
    itemImage.appendChild(imgElement);

    // Contenedor de nombre y precio
    const itemName = document.createElement('div');
    itemName.classList.add('item-name');
    itemName.id = `id_plato${plato.id_plato}`;
    const titleElement = document.createElement('h4');
    titleElement.textContent = plato.nombre_plato;
    const priceElement = document.createElement('p');
    priceElement.classList.add('item-price');
    priceElement.textContent = `$${plato.precio}`;
    itemName.appendChild(titleElement);
    itemName.appendChild(priceElement);

    // Contenedor de cantidad
    const itemQuantity = document.createElement('div');
    itemQuantity.classList.add('item-quantity', 'form_input', 'input_mini');
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.name = `cantidad_plato${plato.id_plato}`; // Añade el atributo name
    quantityInput.value = '1';
    quantityInput.id = `cantidad_plato${plato.id_plato}`; // Mantén el ID
    itemQuantity.appendChild(quantityInput);
    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value, 10) || 1; // Asegura un valor mínimo de 1
        const totalPrice = (plato.precio * quantity).toFixed(2);
        totalPriceElement.textContent = `$${totalPrice}`;
    });
    // Contenedor de precio total
    const itemTotalPrice = document.createElement('div');
    itemTotalPrice.classList.add('item-total-price');
    const totalPriceElement = document.createElement('p');
    totalPriceElement.textContent = `$${(plato.precio * 1).toFixed(2)}`; // Multiplicado por la cantidad inicial de 1
    itemTotalPrice.appendChild(totalPriceElement);

    // Botón de eliminación
    const itemDelete = document.createElement('div');
    itemDelete.classList.add('item-delete');

    itemDelete.addEventListener('click', () => {
        orderItem.remove();
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('orden-button','delete-button');
    
    // Crear el SVG para el botón de eliminar
    const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    deleteIcon.setAttribute('width', '16');
    deleteIcon.setAttribute('height', '18');
    deleteIcon.setAttribute('viewBox', '0 0 16 18');
    deleteIcon.setAttribute('fill', 'none');

    // Crear la ruta del SVG
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M13.7325 6.26552L13.8153 6.26665C14.1229 6.29208 14.3587 6.54747 14.375 6.85488L14.3671 7.02629L14.105 10.2357L13.8301 13.3676C13.7719 13.9929 13.7198 14.5202 13.6749 14.9354C13.5187 16.3821 12.5796 17.2768 11.1638 17.3033C8.95781 17.344 6.83731 17.3436 4.7781 17.2991C3.40331 17.2702 2.47805 16.3659 2.32462 14.9412L2.21858 13.8916L2.03328 11.8557L1.84347 9.62156L1.62643 6.93973C1.59946 6.59565 1.84959 6.2943 2.18512 6.26664C2.49269 6.24128 2.76525 6.4547 2.82932 6.75548L2.85426 7.00128L3.05805 9.51543L3.28057 12.1214C3.38038 13.2495 3.46695 14.1625 3.53622 14.8038C3.62365 15.6157 4.05115 16.0335 4.80343 16.0493C6.84654 16.0935 8.95123 16.0939 11.1417 16.0534C11.9398 16.0385 12.374 15.6248 12.4633 14.7976L12.5689 13.7536C12.5998 13.4319 12.6328 13.0767 12.6678 12.6909L12.8905 10.128L13.1588 6.83942C13.1836 6.52402 13.4327 6.28226 13.7325 6.26552ZM1.10949 4.82416C0.772879 4.82416 0.5 4.54432 0.5 4.19913C0.5 3.88271 0.729294 3.6212 1.02679 3.57982L1.10949 3.57411H3.76476C4.0803 3.57411 4.35654 3.3659 4.45535 3.06591L4.47953 2.97328L4.68587 1.92094C4.86759 1.22398 5.45767 0.727748 6.14916 0.67178L6.27993 0.666504H9.7199C10.4229 0.666504 11.0436 1.12173 11.2826 1.82516L11.3228 1.95991L11.5203 2.97303C11.5822 3.29044 11.8354 3.5275 12.1417 3.56798L12.2351 3.57411H14.8905C15.2271 3.57411 15.5 3.85394 15.5 4.19913C15.5 4.51556 15.2707 4.77706 14.9732 4.81845L14.8905 4.82416H1.10949ZM9.7199 1.91655H6.27993C6.10892 1.91655 5.95691 2.01919 5.89377 2.14819L5.87235 2.20487L5.67483 3.21849C5.65067 3.34221 5.61566 3.46134 5.57093 3.57493L10.429 3.57509C10.4011 3.50422 10.377 3.43119 10.3569 3.35624L10.325 3.21824L10.1364 2.24384C10.0923 2.07477 9.95612 1.95099 9.79185 1.92269L9.7199 1.91655Z');
    path.setAttribute('fill', 'currentColor');
    // Añadir los elementos SVG al botón

    deleteIcon.appendChild(path);
    deleteButton.appendChild(deleteIcon);
    
    // Añadir el botón al contenedor
    itemDelete.appendChild(deleteButton);

    // Contenedor de detalles
    const itemDetails = document.createElement('div');
    itemDetails.classList.add('item-details', 'form_input');
    itemDetails.id = `id_plato_detalles${plato.id_plato}`;
    const detailsInput = document.createElement('input');
    detailsInput.type = 'text';
    detailsInput.name = `Adddetalles_plato_${plato.id_plato}`; // Añade el atributo name
    detailsInput.value = '1. Sin queso';
    detailsInput.id = `Adddetalles_plato_${plato.id_plato}`; // Mantén el ID
    itemDetails.appendChild(detailsInput);

    // Contenedor de platos afectados
    const platesAffected = document.createElement('div');
    platesAffected.classList.add('plates-afected', 'form_input', 'input_mini');
    const affectedInput = document.createElement('input');
    affectedInput.type = 'text';
    affectedInput.name = `Addplatos_afectados${plato.id_plato}`; // Añade el atributo name
    affectedInput.value = '1';
    affectedInput.id = `Addplatos_afectados${plato.id_plato}`; // Mantén el ID
    platesAffected.appendChild(affectedInput);

    // Botones adicionales

    // Crear el contenedor del botón
    const addDetailButton = document.createElement('div');
    addDetailButton.classList.add('add-detail-button');
    const addButton = document.createElement('button');
    addButton.classList.add('orden-button','add-button');
    addButton.type = 'button';

    // Crear el SVG y añadirlo al botón
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('width', '1em');
    svgIcon.setAttribute('height', '1em');
    svgIcon.setAttribute('viewBox', '0 0 24 24');

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('fill', 'currentColor');
    path1.setAttribute('stroke', 'currentColor');
    path1.setAttribute('stroke-linecap', 'round');
    path1.setAttribute('stroke-linejoin', 'round');
    path1.setAttribute('stroke-width', '2');
    path1.setAttribute('d', 'M12 5v14m-7-7h14');

    // Añadir el path al SVG
    svgIcon.appendChild(path1);

    // Añadir el SVG al botón
    addButton.appendChild(svgIcon);

    // Añadir el botón al contenedor
    addDetailButton.appendChild(addButton);

        // Crear el contenedor del botón
    const showDetailsList = document.createElement('div');
    showDetailsList.classList.add('show-details-list');

    // Crear el botón
    const showButton = document.createElement('button');
    showButton.classList.add('orden-button','show-button');
    showButton.type = 'button'; // Asegura que no envíe el formulario

    // Crear el SVG y añadirlo al botón
    const svgIcon1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon1.setAttribute('width', '1em');
    svgIcon1.setAttribute('height', '1em');
    svgIcon1.setAttribute('viewBox', '0 0 512 512');

    const path11 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path11.setAttribute('d', 'M113.7 304C86.2 304 64 282.6 64 256c0-26.5 22.2-48 49.7-48 27.6 0 49.8 21.5 49.8 48 0 26.6-22.2 48-49.8 48z');
    path11.setAttribute('fill', 'currentColor');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M256 304c-27.5 0-49.8-21.4-49.8-48 0-26.5 22.3-48 49.8-48 27.5 0 49.7 21.5 49.7 48 0 26.6-22.2 48-49.7 48z');
    path2.setAttribute('fill', 'currentColor');

    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path3.setAttribute('d', 'M398.2 304c-27.5 0-49.8-21.4-49.8-48 0-26.5 22.2-48 49.8-48 27.5 0 49.8 21.5 49.8 48 0 26.6-22.2 48-49.8 48z');
    path3.setAttribute('fill', 'currentColor');

    // Añadir los elementos path al SVG
    svgIcon1.appendChild(path11);
    svgIcon1.appendChild(path2);
    svgIcon1.appendChild(path3);

    // Añadir el SVG al botón
    showButton.appendChild(svgIcon1);

    // Añadir el botón al contenedor
    showDetailsList.appendChild(showButton);

    // Contenedor para los detalles añadidos
    const addedDetails = document.createElement('div');
    addedDetails.classList.add('added-details');
    addedDetails.id=`id-plato${plato.idPlato}`

    // Añadir todos los elementos al orderItem
    orderItem.appendChild(itemImage);
    orderItem.appendChild(itemName);
    orderItem.appendChild(itemQuantity);
    orderItem.appendChild(itemTotalPrice);
    orderItem.appendChild(itemDelete);
    orderItem.appendChild(itemDetails);
    orderItem.appendChild(platesAffected);
    orderItem.appendChild(addDetailButton);
    orderItem.appendChild(showDetailsList);
    orderItem.appendChild(addedDetails);

    // Añadir el orderItem al contenedor principal
    orderItemsContainer.appendChild(orderItem);
}

