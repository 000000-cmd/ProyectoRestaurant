import { obtenerReporte } from "../../SolicitudesAPI/gestionarReportes.js";
import { obtenerPlatos } from "../../SolicitudesAPI/gestionarPlatos.js";

// Función para mostrar los platos más vendidos
export async function mostrarPlatosMasVendidos(tipo, fecha) {
    try {
        // Obtener el reporte de los platos más vendidos
        const reporte = await obtenerReporte(tipo, fecha);

        if (!reporte || reporte.status !== "success") {
            console.error('No se pudo obtener el reporte o los datos son incorrectos.');
            return;
        }

        // Obtener todos los platos para mostrar las imágenes y descripciones
        const platos = await obtenerPlatos();

        // Obtener los platos más vendidos del reporte
        const platosMasVendidos = reporte.platos_mas_vendidos;

        // Seleccionar el contenedor de los platos más ordenados
        const contenedor = document.querySelector('.most_ordened__conteiner .plato_list');
        if (!contenedor) {
            console.error('No se encontró el contenedor con la clase .plato_list');
            return;
        }

        // Limpiar el contenido anterior
        contenedor.innerHTML = '';

        // Renderizar los platos más vendidos
        platosMasVendidos.forEach(platoVendido => {
            const plato = platos.find(p => p.nombre_plato === platoVendido.nombre_plato);

            // Crear el elemento HTML para cada plato
            const platoItem = document.createElement('div');
            platoItem.classList.add('plato_item');

            // Crear el elemento de imagen
            const img = document.createElement('img');
            img.src = plato.img_plato ? `data:image/jpeg;base64,${plato.img_plato}` : 'resources/images/Images.png';
            img.alt = plato.nombre_plato;

            // Crear el contenedor de los detalles del plato
            const plateDetails = document.createElement('div');
            plateDetails.classList.add('plate_details');

            // Agregar el nombre del plato
            const nombrePlato = document.createElement('p');
            nombrePlato.textContent = plato.nombre_plato;

            // Agregar la descripción del plato
            const descripcionPlato = document.createElement('p');
            descripcionPlato.textContent = `Vendidos: ${platoVendido.cantidad_vendida}`;

            // Añadir los elementos al contenedor de detalles
            plateDetails.appendChild(nombrePlato);
            plateDetails.appendChild(descripcionPlato);

            // Añadir la imagen y los detalles al platoItem
            platoItem.appendChild(img);
            platoItem.appendChild(plateDetails);

            // Añadir el platoItem al contenedor principal
            contenedor.appendChild(platoItem);
        });

    } catch (error) {
        console.error('Error al mostrar los platos más vendidos:', error);
    }
}
