import { obtenerReporte } from '../../SolicitudesAPI/gestionarReportes.js';
import { obtenerPlatoPorId } from '../../SolicitudesAPI/gestionarPlatos.js';
import { renderImage } from './componentes/renderImage.js'


document.addEventListener("DOMContentLoaded", async () => {
    const { platos_mas_vendidos } = await obtenerReporte('mensual', '2024-09');

    // Selecciona el contenedor donde se agregarán los platos populares
    const platosContainer = document.getElementById('platos-populares');

    platos_mas_vendidos.forEach(async (plato, index) => {
        const platoResult = await obtenerPlatoPorId(plato.id_plato);
        console.log(platoResult);
        
        // Crear el contenedor para cada plato
        const platoElement = document.createElement('div');
        platoElement.classList.add('plato');

        // Si es el plato más vendido (primero en la lista), se destaca
        if (index === 0) {
            platoElement.classList.add('plato-destacado');

            // Añadir la corona al plato destacado
            const crownIcon = document.createElement('div');
            crownIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="crown-icon" viewBox="0 0 24 24"><path fill="#f5ba42" d="M14 5c0 .53-.206 1.012-.543 1.37l2.624 3.28a.25.25 0 0 0 .307.068l2.65-1.326A2.004 2.004 0 0 1 21 6a2 2 0 0 1 .444 3.95l-1.804 9.623A1.75 1.75 0 0 1 17.92 21H6.08a1.75 1.75 0 0 1-1.72-1.427L2.556 9.95a2 2 0 1 1 2.406-1.559l2.65 1.326a.25.25 0 0 0 .307-.068l2.624-3.28A2 2 0 1 1 14 5m-2 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/></svg>
            `;
            platoElement.appendChild(crownIcon);
        }

        // Imagen del plato usando la función renderImage
        const imgElement = document.createElement('img');
        imgElement.src = renderImage(platoResult.img_plato); // Ajusta la ruta de la imagen según corresponda
        imgElement.alt = plato.nombre_plato;

        // Contenedor de la información del plato
        const infoElement = document.createElement('div');
        infoElement.classList.add('plato-info');

        // Nombre del plato
        const nombreElement = document.createElement('div');
        nombreElement.classList.add('plato-nombre');
        nombreElement.textContent = platoResult.nombre_plato;

        // Detalles adicionales del plato
        const detalleElement = document.createElement('div');
        detalleElement.classList.add('plato-detalle');
        detalleElement.textContent = platoResult.descripcion || 'Descripción no disponible';

        // Contenedor del precio
        const precioElement = document.createElement('div');
        precioElement.classList.add('plato-precio');
        precioElement.textContent = `$${platoResult.precio}`;

        // Añadir elementos al contenedor principal
        infoElement.appendChild(nombreElement);
        infoElement.appendChild(detalleElement);
        platoElement.appendChild(imgElement);
        platoElement.appendChild(infoElement);
        platoElement.appendChild(precioElement);

        // Añadir el contenedor del plato al contenedor general
        platosContainer.appendChild(platoElement);
    });
});