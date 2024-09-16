import { obtenerReporte } from '../../SolicitudesAPI/gestionarReportes.js';
import { obtenerPlatoPorId } from '../../SolicitudesAPI/gestionarPlatos.js';
import { renderImage } from './componentes/renderImage.js'


document.addEventListener("DOMContentLoaded", async () => {
    const { platos_mas_vendidos } = await obtenerReporte('mensual', '2024-09');

    // Selecciona el contenedor donde se agregarán los platos populares
    const platosContainer = document.getElementById('platos-populares');

    platos_mas_vendidos.forEach(async (plato, index) => {
        const platoResult = await obtenerPlatoPorId(plato.id_plato);

        // Crear el contenedor para cada plato
        const platoElement = document.createElement('div');
        platoElement.classList.add('plato');

        // Asignar clases y añadir SVGs basadas en la posición
        if (index === 0) {
            platoElement.classList.add('plato-destacado'); // Plato más vendido

            // Añadir la corona al plato destacado
            const crownIcon = document.createElement('div');
            crownIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="crown-icon" viewBox="0 0 24 24"><path fill="#f5ba42" d="M14 5c0 .53-.206 1.012-.543 1.37l2.624 3.28a.25.25 0 0 0 .307.068l2.65-1.326A2.004 2.004 0 0 1 21 6a2 2 0 0 1 .444 3.95l-1.804 9.623A1.75 1.75 0 0 1 17.92 21H6.08a1.75 1.75 0 0 1-1.72-1.427L2.556 9.95a2 2 0 1 1 2.406-1.559l2.65 1.326a.25.25 0 0 0 .307-.068l2.624-3.28A2 2 0 1 1 14 5m-2 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/></svg>
            `;
            platoElement.appendChild(crownIcon);

        } else if (index === 1) {
            platoElement.classList.add('plato-lateral-izquierdo'); // Segundo plato

            // Añadir el SVG correspondiente al segundo puesto
            const secondPlaceIcon = document.createElement('div');
            secondPlaceIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="crown_variant" viewBox="0 0 256 256"><path fill="#f5ba42" d="M128 83.22a54 54 0 0 0-8-10.06V40h-16a8 8 0 0 1 0-16h16V8a8 8 0 0 1 16 0v16h16a8 8 0 0 1 0 16h-16v33.16a54 54 0 0 0-8 10.06M180 56c-17.74 0-33.21 6.48-44 17.16V176a8 8 0 0 1-16 0V73.16C109.21 62.48 93.74 56 76 56a60.07 60.07 0 0 0-60 60c0 29.86 14.54 48.85 26.73 59.52A90.5 90.5 0 0 0 64 189.34V208a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-18.66a90.5 90.5 0 0 0 21.27-13.82C225.46 164.85 240 145.86 240 116a60.07 60.07 0 0 0-60-60"/></svg>
            `;
            platoElement.appendChild(secondPlaceIcon);

        } else if (index === 2) {
            platoElement.classList.add('plato-lateral-derecho'); // Tercer plato

            // Añadir el SVG correspondiente al tercer puesto
            const thirdPlaceIcon = document.createElement('div');
            thirdPlaceIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="crown-icon-pawn" viewBox="0 0 768 1024"><path fill="#f5ba42" d="M704 1024H64q-27 0-45.5-18.5T0 960v-64q0-26 18.5-45T64 832q79 0 135.5-89.5T256 512q-45 0-86.5-22.5T128 448q0-21 52-38q-52-69-52-154q0-106 75-181T384 0t181 75t75 181q0 85-52 154q52 17 52 38q0 19-41.5 41.5T512 512q0 141 56.5 230.5T704 832q26 0 45 19t19 45v64q0 27-18.5 45.5T704 1024"/></svg>
            `;
            platoElement.appendChild(thirdPlaceIcon);
        }

        // Imagen del plato usando la función renderImage
        const imgElement = document.createElement('img');
        imgElement.src = renderImage(platoResult.img_plato); // Ajusta la ruta de la imagen según corresponda
        imgElement.alt = platoResult.nombre_plato;

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
        precioElement.textContent = `$${platoResult.precio.toLocaleString('es-CO')}`;

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