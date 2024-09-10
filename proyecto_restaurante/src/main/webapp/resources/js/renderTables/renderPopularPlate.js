import { renderSidebar } from "../sideBarComponent.js";
import { obtenerPlatoPorId } from "../../../SolicitudesAPI/gestionarPlatos.js";
import { obtenerReporte } from "../../../SolicitudesAPI/gestionarReportes.js";
import { renderImage } from "../componentes/renderImage.js";

document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
    mostrarTablaHistorico();
});

async function mostrarTablaHistorico() {
    try {
        // Obtener el reporte mensual del mes actual
        const fechaActual = new Date();
        const mesActual = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}`;
        const reporte = await obtenerReporte('mensual', mesActual);

        // Calcular los totales base para pedidos diarios y mensuales
        const totalPedidosMes = reporte.platos_mas_vendidos.reduce((total, plato) => total + plato.cantidad_vendida, 0);
        const totalPedidosDia = totalPedidosMes / 30; // Asumiendo 30 días en el mes

        // Procesar cada plato del reporte para obtener sus detalles
        const data = await Promise.all(reporte.platos_mas_vendidos.map(async plato => {
            // Obtener detalles del plato por su ID
            const detalles = await obtenerPlatoPorId(plato.id_plato);
            const recaudo = reporte.recaudo_por_tipo_plato.find(rec => rec.id_plato === plato.id_plato);

            // Calcular los porcentajes y otros valores
            return {
                nombrePlato: plato.nombre_plato,
                pedidosHoy: { 
                    porcentaje: calcularPorcentaje(plato.cantidad_vendida / 30, totalPedidosDia), // Promedio diario
                    total: Math.round(plato.cantidad_vendida / 30) // Ajuste para pedidos promedio diario
                },
                pedidosMes: { 
                    porcentaje: calcularPorcentaje(plato.cantidad_vendida, totalPedidosMes), // Total mensual
                    total: plato.cantidad_vendida // Total de pedidos del mes
                },
                precio: detalles ? detalles.precio : 0,
                gananciaHoy: (recaudo ? recaudo.total_recaudo / 30 : 0).toFixed(2), // Promedio de ganancias diario
                gananciaMes: recaudo ? recaudo.total_recaudo.toFixed(2) : 0, // Ganancia total mensual
                img: detalles ? detalles.img_plato : 'default_image.png' // Ajustar con una imagen predeterminada si no está disponible
            };
        }));

        // Llenar la tabla con los datos obtenidos
        llenarTabla(data);
    } catch (error) {
        console.error('Error al mostrar el historial:', error);
    }
}

// Función para calcular el porcentaje de pedidos
function calcularPorcentaje(cantidad, totalBase) {
    if (totalBase === 0) return 0; // Evita división por cero
    return ((cantidad / totalBase) * 100).toFixed(1); // Calcula el porcentaje y limita a un decimal
}

// Función para rellenar la tabla con los datos obtenidos
function llenarTabla(data) {
    const tableBody = document.querySelector('.tabla tbody');

    data.forEach(plato => {
        const row = document.createElement('tr');

        // Crear celda de imagen y nombre del plato
        const imgCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = renderImage(plato.img);

        img.classList.add('img-plato'); // Añade una clase para estilos CSS si es necesario
        const p = document.createElement("p");
        p.textContent = plato.nombrePlato;
        imgCell.appendChild(img);
        imgCell.appendChild(p);

        // Crear celda para Pedidos promedio diario con barra de progreso
        const pedidosHoyCell = document.createElement('td');
        const progressHoy = crearBarraProgreso(plato.pedidosHoy.porcentaje, plato.pedidosHoy.total);
        pedidosHoyCell.appendChild(progressHoy);

        // Crear celda para Pedidos promedio mensual con barra de progreso
        const pedidosMesCell = document.createElement('td');
        const progressMes = crearBarraProgreso(plato.pedidosMes.porcentaje, plato.pedidosMes.total);
        pedidosMesCell.appendChild(progressMes);

        // Crear celdas para el precio y las ganancias
        const precioCell = document.createElement('td');
        precioCell.textContent = `$${plato.precio.toLocaleString()}`;

        const gananciaHoyCell = document.createElement('td');
        gananciaHoyCell.textContent = `$${plato.gananciaHoy.toLocaleString()}`;

        const gananciaMesCell = document.createElement('td');
        gananciaMesCell.textContent = `$${plato.gananciaMes.toLocaleString()}`;

        // Añadir las celdas a la fila
        row.appendChild(imgCell);
        row.appendChild(pedidosHoyCell);
        row.appendChild(pedidosMesCell);
        row.appendChild(precioCell);
        row.appendChild(gananciaHoyCell);
        row.appendChild(gananciaMesCell);

        // Añadir la fila al cuerpo de la tabla
        tableBody.appendChild(row);
    });
}

// Función para crear una barra de progreso
function crearBarraProgreso(porcentaje, texto) {
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar-container');

    const fullProgressBar = document.createElement('div');
    fullProgressBar.classList.add('full-progress-bar');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.style.width = `${porcentaje}%`; // Ajustar el ancho de la barra según el porcentaje

    fullProgressBar.appendChild(progressBar);
    progressBarContainer.appendChild(fullProgressBar);

    // Crear un nodo de texto para el porcentaje y el total
    const textNode = document.createElement('span');
    textNode.textContent = ` ${porcentaje}% / ${texto}`;
    progressBarContainer.appendChild(textNode);

    return progressBarContainer;
}

