import { pedidoCompleto_Mesa } from "../../../SolicitudesAPI/gestionarPedidos.js";
import { renderImage } from "../componentes/renderImage.js";
import { obtenerPlatos } from "../../../SolicitudesAPI/gestionarPlatos.js";



// Función para buscar el pedido basado en el ID de la mesa
export async function buscarPedido(id_mesa) {
    try {
        const pedido = await pedidoCompleto_Mesa(id_mesa); // Asume que esta función obtiene los datos correctamente
        const platos = await obtenerPlatos();

        // Llama a generarDiapositivas con los datos obtenidos del pedido
        generarDiapositivas(pedido, platos);

    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        throw error; // Lanzar el error para manejarlo en el archivo 1 si es necesario
    }
}

export async function generarDiapositivas(pedido, platos) {
    // Selecciona el contenedor de la pista del carrusel
    const track = document.querySelector('.carousel-track');
   
    // Limpia cualquier contenido existente en el track
    track.innerHTML = '';

    // Verifica que los contenidos del pedido sean un array antes de iterar
    if (!pedido || !Array.isArray(pedido.contenidos)) {
        console.error('El pedido no contiene los datos esperados:', pedido);
        return;
    }

// Iterar sobre los contenidos del pedido para generar las diapositivas
pedido.contenidos.forEach((contenido, index) => {
    // Crear elementos HTML para cada diapositiva
    const slide = document.createElement('li');
    slide.classList.add('carousel-slide');
    if (index === 0) {
        slide.classList.add('current-slide'); // Añade la clase 'current-slide' solo a la primera diapositiva
    }

    // Contenedor de contenido de la diapositiva
    const slideContent = document.createElement('div');
    slideContent.classList.add('slide-content');

    // Título de la diapositiva
    const slideTitle = document.createElement('div');
    slideTitle.classList.add('slide_title');

    // Título y mesa del plato
    const titlePlate = document.createElement('div');
    titlePlate.classList.add('title_plate');
    const nombrePlato = document.createElement('h3');
    nombrePlato.textContent = contenido.nombre_plato; // Ajusta al dato real del contenido
    const mesaInfo = document.createElement('span');
    mesaInfo.textContent = `Mesa# ${pedido.mesa}`; // Usa la información de la mesa del pedido
    titlePlate.appendChild(nombrePlato);
    titlePlate.appendChild(mesaInfo);

    // Elemento "Marcado como realizado"
    const realizadoText = document.createElement('h2');
    realizadoText.classList.add('realizado', 'hidden');
    realizadoText.textContent = 'Marcado como realizado';

    // Añadir título y realizado al contenedor de título
    slideTitle.appendChild(titlePlate);
    slideTitle.appendChild(realizadoText);

    // Contenedor de detalles y la imagen del plato
    const detailsContent = document.createElement('div');
    const img_container = document
    detailsContent.classList.add('details_content');
    const img = document.createElement('img');

    const plato = platos.find(plato => contenido.id_plato === plato.id_plato);
    
    img.src = renderImage(plato.img_plato); // Placeholder si no hay imagen real
    img.alt = contenido.nombre_plato;
    const details = document.createElement('div');
    details.classList.add('details');
    const detallesPedidos = document.createElement('h2');
    detallesPedidos.textContent = 'Detalles pedidos';

    // Filtrar los detalles específicos para este plato
    const detallesPlato = pedido.detalles.filter(detalle => detalle.id_plato === contenido.id_plato);

    // Crear los elementos para mostrar los detalles específicos del plato
    detallesPlato.forEach(detalle => {
        const detalleTexto = document.createElement('p');
        detalleTexto.textContent = ` ${detalle.cantidad_platos_modificacion}X  - ${detalle.detalles_plato}`;
        details.appendChild(detalleTexto);
    });

    detailsContent.appendChild(img);
    detailsContent.appendChild(details);

    // Contenedor de cantidad
    const cantidad = document.createElement('h2');
    cantidad.textContent = `Cantidad: ${contenido.cantidad_plato}`; // Usa la cantidad del contenido

    // Contenedor del botón "Plato realizado"
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button_container');
    const primaryButton = document.createElement('button');
    primaryButton.classList.add('primary_button');
    primaryButton.textContent = 'Plato realizado';

    buttonContainer.appendChild(primaryButton);

    // Añadir todos los elementos al contenido de la diapositiva
    slideContent.appendChild(slideTitle);
    slideContent.appendChild(detailsContent);
    slideContent.appendChild(cantidad);
    slideContent.appendChild(buttonContainer);

    // Añadir el contenido al slide
    slide.appendChild(slideContent);

    // Añadir la diapositiva al track del carrusel
    track.appendChild(slide);
});

}

