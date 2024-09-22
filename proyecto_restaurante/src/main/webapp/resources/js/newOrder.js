import { crearTabContentMesero, crearTab, manejarNavegacionTabs } from "./renderTables/renderPlatesMenu.js";
import { renderSidebar } from "./sideBarComponent.js";
import { obtenerCategorias } from '../../SolicitudesAPI/consultasSelect/gestionarCategorias.js'; // Asegúrate de ajustar la ruta si es necesario
import { obtenerPlatos } from '../../SolicitudesAPI/gestionarPlatos.js';
import { renderImage } from "./componentes/renderImage.js";
import { enviarPedido, pedidoCompleto_Mesa } from "../../SolicitudesAPI/gestionarPedidos.js";
import { validarTextoDetalles, validarNumero } from "./ValidarFormularios.js";
import { verificarRol } from "./verificarSesion.js";

async function verificarUsuario() {
    const rolRequerido = 'Mesero'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if(tieneAcceso){
            renderSidebar('Mesero');
            const $submitButton = document.querySelector('#enviar-pedido');
        
            const urlParams = new URLSearchParams(window.location.search);
            const mesaId = urlParams.get('id'); // Obtén el ID del pedido desde la URL
            if (mesaId) {
                // Lógica para cargar el pedido existente utilizando el ID del pedido
                const numero = parseInt(mesaId.replace('mesa', ''), 10); // Reemplaza "mesa" por una cadena vacía
                const result = await pedidoCompleto_Mesa(numero); // Asegúrate de implementar esta función    
                renderOrderItem(result); // Llama a la función para renderizar las órdenes en el aside
                const numeroMesa = document.querySelector("#numero-mesa");
                numeroMesa.value = numero
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
                e.preventDefault()
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
                    const result = Validarformulario(formData)
                    if (result) {
                        const response = await enviarPedido(formData);
        
                        if (response) {
                            //Se vacia el formulario si todo salio bien.
                            const numeroMesa = document.querySelector("#numero-mesa");
                            const listaPedido = document.querySelector(".order_items");
                            console.log(numeroMesa);
                            console.log(listaPedido);
                            numeroMesa.value = ""
                            listaPedido.innerHTML = ""
                            alert('Pedido enviado exitosamente!');
                        }
                    }
                    // Llamada a la función de envío
                } catch (error) {
                    console.error('Error al enviar el pedido:', error);
                    alert('Hubo un error al enviar el pedido. Por favor, intente de nuevo.');
                }
            });
    }
}


document.addEventListener("DOMContentLoaded", verificarUsuario);




function Validarformulario(formData) {
    console.log('FormData recibido:', [...formData.entries()]);

    let isValid = true;
    let errors = [];

    // Validar 'numeroMesa' (obligatorio, solo números)
    const numeroMesa = formData.get('numeroMesa');
    if (!numeroMesa || numeroMesa.trim() === '') {
        isValid = false;
        errors.push('El número de mesa es obligatorio.');
    } else if (!validarNumero(numeroMesa)) {
        isValid = false;
        errors.push('El número de mesa debe contener solo números.');
    }

    // Obtener todos los campos 'cantidad_plato<ID>'
    const cantidadPlatoKeys = [];
    for (let key of formData.keys()) {
        if (key.startsWith('cantidad_plato')) {
            cantidadPlatoKeys.push(key);
        }
    }

    // Verificar si no se encontró ningún plato
    if (cantidadPlatoKeys.length === 0) {
        isValid = false;
        errors.push('Debe agregar al menos un plato con cantidad válida.');
    }

    let platosEncontrados = 0;

    for (let key of cantidadPlatoKeys) {
        const cantidadPlato = formData.get(key);
        const platoID = key.replace('cantidad_plato', ''); // Extraer el ID del plato

        if (cantidadPlato.trim() === '') {
            isValid = false;
            errors.push(`La cantidad del plato es obligatoria.`);
        } else if (!validarNumero(cantidadPlato)) {
            isValid = false;
            errors.push(`La cantidad del plato debe contener solo números.`);
        } else if (cantidadPlato <= 0) {
            isValid = false;
            errors.push(`La cantidad del plato debe ser mayor que 0.`);
        } else {
            // Si la cantidad es válida, incrementamos el contador
            platosEncontrados++;
        }

        // Validar detalles del plato (opcional)
        const detallesPlatoKey = `detalles_plato_${platoID}`;
        const detallesPlato = formData.get(detallesPlatoKey);

        if (detallesPlato !== null && detallesPlato.trim() !== '') {  // Verificamos si 'detallesPlato' existe
            if (!validarTextoDetalles(detallesPlato)) {
                isValid = false;
                errors.push(`Los detalles del plato con ID ${platoID} contienen caracteres inválidos.`);
            }
        }

        // Validar 'PlatosAfectadosDetalle' (opcional)
        const platosAfectadosKey = `PlatosAfectadosDetalle_${platoID}_1`;
        const platosAfectadosDetalle = formData.get(platosAfectadosKey);

        if (platosAfectadosDetalle !== null && platosAfectadosDetalle.trim() !== '') { // Verificamos si 'platosAfectadosDetalle' existe
            if (!validarNumero(platosAfectadosDetalle)) {
                isValid = false;
                errors.push(`PlatosAfectadosDetalle_${platoID}_1 debe contener solo números.`);
            }
        }
    }

    // Mostrar errores si los hay
    if (!isValid) {
        alert(errors.join('\n'));
    }

    return isValid;
}


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

        // Obtener el template del item de orden
        const template = document.getElementById('order-item-template');
        const orderItemClone = template.content.cloneNode(true);

        // Actualizar los elementos en el clon con los datos del plato y contenido
        // Imagen del plato
        const itemImage = orderItemClone.querySelector('.item-image img');
        itemImage.src = renderImage(plato.img_plato);
        itemImage.alt = plato.nombre_plato;

        // Nombre y precio del plato
        const itemName = orderItemClone.querySelector('.item-name');
        itemName.id = `id_plato${plato.id_plato}`;
        const titleElement = itemName.querySelector('h4');
        titleElement.textContent = plato.nombre_plato;
        const priceElement = itemName.querySelector('.item-price');
        priceElement.textContent = `$${plato.precio}`;

        // Cantidad del plato
        const quantityInput = orderItemClone.querySelector('.item-quantity input');
        quantityInput.name = `cantidad_plato${plato.id_plato}`;
        quantityInput.value = contenido.cantidad_plato;
        quantityInput.id = `cantidad_plato${plato.id_plato}`;

        // Precio total
        const totalPriceElement = orderItemClone.querySelector('.item-total-price p');
        const updateTotalPrice = () => {
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const totalPrice = (plato.precio * quantity).toFixed(2);
            totalPriceElement.textContent = `$${totalPrice}`;
        };
        quantityInput.addEventListener('input', updateTotalPrice);
        updateTotalPrice(); // Inicializar el precio total

        // Botón de eliminar
        const deleteButton = orderItemClone.querySelector('.item-delete .delete-button');
        deleteButton.addEventListener('click', () => {
            // Seleccionar el elemento correcto para eliminar
            const orderItemElement = orderItemClone.querySelector('.order-item');
            orderItemElement.remove();
        });

        // Input de detalles
        const itemDetails = orderItemClone.querySelector('.item-details');
        itemDetails.id = `id_plato_detalles${plato.id_plato}`;
        const detailsInput = itemDetails.querySelector('input');
        detailsInput.name = `Adddetalles_plato_${plato.id_plato}`;
        detailsInput.id = `Adddetalles_plato_${plato.id_plato}`;
        detailsInput.value = ''; // Puedes inicializar con algún valor si es necesario

        // Input de platos afectados
        const platesAffected = orderItemClone.querySelector('.plates-afected input');
        platesAffected.name = `Addplatos_afectados${plato.id_plato}`;
        platesAffected.value = '1';
        platesAffected.id = `Addplatos_afectados${plato.id_plato}`;

        // Botón para añadir detalle
        const addButton = orderItemClone.querySelector('.add-detail-button .add-button');
        addButton.addEventListener('click', () => {
            addDetailToOrderItem(addButton);
        });

        // Botón para mostrar detalles (si tienes funcionalidad para esto)
        const showButton = orderItemClone.querySelector('.show-details-list .show-button');
        // Añade event listener si es necesario

        // Contenedor de detalles añadidos
        const addedDetails = orderItemClone.querySelector('.added-details');
        addedDetails.id = `id-plato${plato.id_plato}`;

        // Si hay detalles para este plato, agregarlos
        const detallesDelPlato = detallesPorPlato[plato.id_plato] || [];
        detallesDelPlato.forEach((detalle, index) => {
            // Obtener el template del detalle
            const detailTemplate = document.getElementById('detail-item-template');
            const detailItemClone = detailTemplate.content.cloneNode(true);

            // Seleccionar el elemento correcto dentro del fragmento
            const detailItemElement = detailItemClone.querySelector('.detail-item');

            // Actualizar los elementos en el clon del detalle
            const detalleLabel = detailItemElement.querySelector('.detalle-label');
            detalleLabel.textContent = `Detalle ${index + 1}`;

            const detailText = detailItemElement.querySelector('.detail-text');
            detailText.name = `detalles_plato_${plato.id_plato}`;
            detailText.id = `detalles_plato_${plato.id_plato}_${index + 1}`;
            detailText.value = detalle.detalles_plato;

            const affectedPlates = detailItemElement.querySelector('.affected-plates');
            affectedPlates.name = `PlatosAfectadosDetalle_${plato.id_plato}_${index + 1}`;
            affectedPlates.id = `PlatosAfectadosDetalle_${plato.id_plato}_${index + 1}`;
            affectedPlates.value = detalle.cantidad_platos_modificacion;

            // Botón de eliminar detalle
            const deleteDetailButton = detailItemElement.querySelector('.delete-button');
            deleteDetailButton.addEventListener('click', () => {
                detailItemElement.remove();
                updateDetailNumbers(addedDetails);
            });

            // Añadir el detalle clonado al contenedor de detalles añadidos
            addedDetails.appendChild(detailItemElement);
        });

        // Añadir el item de orden clonado al contenedor principal
        orderItemsContainer.appendChild(orderItemClone);
    });
}

function addDetailToOrderItem(button) {
    const orderItem = button.closest('.order-item');
    const detailInput = orderItem.querySelector('input[id^="Adddetalles_plato_"]');
    const affectedPlatesInput = orderItem.querySelector('input[id^="Addplatos_afectados"]');
    const addedDetailsContainer = orderItem.querySelector('.added-details');
    const quantityInput = orderItem.querySelector('input[id^="cantidad_plato"]');
    const idPlato = orderItem.querySelector('.item-name').id.replace('id_plato', '');

    let detailCount = addedDetailsContainer.children.length;

    // Verify if another detail can be added
    const maxPlates = parseInt(quantityInput.value, 10);
    if (detailCount >= maxPlates) {
        alert('No puedes añadir más detalles que el número de platos disponibles.');
        return;
    }

    // Validar que el detalle sea texto alfanumérico (solo letras y números)
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/; // Permite letras, números y espacios
    if (!alphanumericRegex.test(detailInput.value.trim())) {
        alert('Los detalles solo deben contener texto y números.');
        return;
    }

    // Validar que los platos afectados sean un número válido
    if (isNaN(affectedPlatesInput.value) || affectedPlatesInput.value <= 0) {
        alert('La cantidad de platos afectados debe ser un número positivo.');
        return;
    }

    detailCount++;

    // Get the template
    const template = document.getElementById('detail-item-template');

    // Clone the template content
    const detailItemClone = template.content.cloneNode(true);
    
    // Encuentra el elemento que contiene la clase .detail-item dentro del fragmento
    const detailItemElement = detailItemClone.querySelector('.detail-item');

    // Update the detail label
    const detalleLabel = detailItemElement.querySelector('.detalle-label');
    detalleLabel.textContent = `Detalle ${detailCount}`;

    // Update the detail text input
    const detailText = detailItemElement.querySelector('.detail-text');
    detailText.name = `detalles_plato_${idPlato}`;
    detailText.id = `detalles_plato_${idPlato}_${detailCount}`;
    detailText.value = detailInput.value;

    // Update the affected plates input
    const affectedPlates = detailItemElement.querySelector('.affected-plates');
    affectedPlates.name = `PlatosAfectadosDetalle_${idPlato}_${detailCount}`;
    affectedPlates.id = `PlatosAfectadosDetalle_${idPlato}_${detailCount}`;
    affectedPlates.value = affectedPlatesInput.value;

    // Set up delete button
    const deleteButton = detailItemElement.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        detailItemElement.remove();  // Ahora se elimina correctamente el elemento del DOM
        updateDetailNumbers(addedDetailsContainer);
    });

    // Append the cloned detail item to the container
    addedDetailsContainer.appendChild(detailItemElement);

    // Clear the original inputs
    detailInput.value = '';
    affectedPlatesInput.value = '1';
}

// Función para mostrar u ocultar la lista de detalles y añadir la clase
function mostrarListaDetalles(button) {
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

function addOrderItem(plato) {
    const orderItemsContainer = document.querySelector('.order_items');

    // Get the template
    const template = document.getElementById('order-item-template');

    // Clone the template content
    const orderItemClone = template.content.cloneNode(true);

    // Encuentra el elemento .order-item en el fragmento clonado
    const orderItemElement = orderItemClone.querySelector('.order-item');

    // Update the item-image
    const itemImage = orderItemElement.querySelector('.item-image img');
    itemImage.src = renderImage(plato.img_plato);
    itemImage.alt = plato.nombre_plato;

    // Update the item-name
    const itemName = orderItemElement.querySelector('.item-name');
    itemName.id = `id_plato${plato.id_plato}`;
    const titleElement = itemName.querySelector('h4');
    titleElement.textContent = plato.nombre_plato;
    const priceElement = itemName.querySelector('.item-price');
    priceElement.textContent = `$${plato.precio}`;

    // Update the item-quantity
    const quantityInput = orderItemElement.querySelector('.item-quantity input');
    quantityInput.name = `cantidad_plato${plato.id_plato}`;
    quantityInput.id = `cantidad_plato${plato.id_plato}`;
    quantityInput.value = '1';

    // Update the total price
    const totalPriceElement = orderItemElement.querySelector('.item-total-price p');
    totalPriceElement.textContent = `$${(plato.precio * 1).toFixed(2)}`;

    // Add event listener to quantity input
    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value, 10) || 1;
        const totalPrice = (plato.precio * quantity).toFixed(2);
        totalPriceElement.textContent = `$${totalPrice}`;
        updateSubtotal(); // Actualizar el subtotal general
    });

    // Set up delete button
    const deleteButton = orderItemElement.querySelector('.item-delete .delete-button');
    deleteButton.addEventListener('click', () => {
        console.log("Se presionó eliminar");

        // Ahora puedes eliminar el elemento
        orderItemElement.remove();
    });

    // Update item-details
    const itemDetails = orderItemElement.querySelector('.item-details');
    itemDetails.id = `id_plato_detalles${plato.id_plato}`;
    const detailsInput = itemDetails.querySelector('input');
    detailsInput.name = `Adddetalles_plato_${plato.id_plato}`;
    detailsInput.id = `Adddetalles_plato_${plato.id_plato}`;
    detailsInput.value = '';

    // Update plates-affected
    const platesAffected = orderItemElement.querySelector('.plates-afected input');
    platesAffected.name = `Addplatos_afectados${plato.id_plato}`;
    platesAffected.id = `Addplatos_afectados${plato.id_plato}`;
    platesAffected.value = '1';

    // Add event listeners to additional buttons if needed
    const addButton = orderItemElement.querySelector('.add-detail-button .add-button');
    const showButton = orderItemElement.querySelector('.show-details-list .show-button');

    // Example event listener
    addButton.addEventListener('click', () => {
        // Tu código aquí
    });

    showButton.addEventListener('click', () => {
        // Tu código aquí
    });

    // Update added-details
    const addedDetails = orderItemElement.querySelector('.added-details');
    addedDetails.id = `id-plato${plato.id_plato}`;

    // Append the cloned order item to the container
    orderItemsContainer.appendChild(orderItemElement); // Añadimos el elemento clonado
}

function updateSubtotal() {
    // Obtener todos los elementos con clase '.item-total-price p'
    const totalPriceElements = document.querySelectorAll('.item-total-price p');
    let subtotal = 0;

    // Sumar los precios de todos los artículos
    totalPriceElements.forEach((priceElement) => {
        const price = parseFloat(priceElement.textContent.replace(/[^0-9.-]+/g, "")) || 0; // Extraer solo números del precio
        subtotal += price;
    });

    // Actualizar el valor en el elemento .subTotal
    const subtotalElement = document.querySelector('.subTotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
}