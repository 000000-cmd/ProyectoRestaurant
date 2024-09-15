import { renderSidebar } from "./sideBarComponent.js";
import { TablaDinamica } from "./renderTables/renderPedidosActivos.js";
import { mostrarPlatosMasVendidos } from "./masOrdenadoComponent.js"; // Importa correctamente
import { mostrarReporte } from "./reportComponent.js"; // Asegúrate de importar esta función correctamente
import { cargarPedidoAdmin } from "../../SolicitudesAPI/gestionarPedidos.js";
import { obtenerReporte } from "../../SolicitudesAPI/gestionarReportes.js";


// Función para cargar y mostrar la tabla en el contenedor
async function mostrarTablaEnDashboard() {

    const pedidos = await cargarPedidoAdmin();
    const tabla = TablaDinamica(pedidos);
    const contenedor = document.querySelector('.table-container');
    if (contenedor) {
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    } else {
        console.error('No se encontró el contenedor con la clase .table-container');
    }
}

// Función para mostrar el reporte dentro del contenedor del gráfico
async function mostrarReporteEnDashboard(mesActual) {
    const contenedorGrafico = document.querySelector('#chart');
    if (contenedorGrafico) {
        await mostrarReporte('mensual', mesActual);
    } else {
        console.error('No se encontró el contenedor con el id #chart');
    }
}

function escucharSelectPlatos(){
    const select = document.querySelector("#selec_time")

    select.addEventListener("change",(event)=>{
        console.log(event.target.value);
        const valor= event.target.value;
        if(valor==="dia"){
            const fecha= calcularDiaActual();
            mostrarPlatosMasVendidos('diario', fecha);
        }
        if(valor==="semana"){
            const fecha= calcularDiaActual();
            mostrarPlatosMasVendidos('semanal', fecha);
        }
        if(valor==="mes"){
            const fecha= calcularMesActual();
            mostrarPlatosMasVendidos('mensual', fecha);
        }
    })
}

function calcularDiaActual(){
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;    
}

function calcularMesActual(){
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

async function mostrarIngresosTotales() {
    const fecha = new Date();
    
    // Obtener el mes actual en formato YYYY-MM
    const mesActual = calcularMesActual();
    
    // Ajustar la fecha para obtener el mes anterior
    const fechaAnterior = new Date(fecha);
    fechaAnterior.setMonth(fecha.getMonth() - 1); // Restar un mes
    
    // Obtener el mes anterior en formato YYYY-MM
    const mesAnterior = `${fechaAnterior.getFullYear()}-${String(fechaAnterior.getMonth() + 1).padStart(2, '0')}`;
    
    // Obtener los reportes para los meses actual y anterior
    const reporteActual = await obtenerReporte('mensual', mesActual);
    const reporteAnterior = await obtenerReporte('mensual', mesAnterior);

    // Seleccionar elementos de DOM para mostrar los datos
    const $ingresosTotales = document.querySelector('#IngresosTotales');
    const $ventasTotales = document.querySelector('#VentasTotales');
    const $porcentajeIngresos = document.querySelector('.card:nth-child(1) .porcent__container p');
    const $iconPorcentajeIngresos = document.querySelectorAll('.card:nth-child(1) .porcent__container svg');
    const $porcentajeVentas = document.querySelector('.card:nth-child(2) .porcent__container p');
    const $iconPorcentajeVentas = document.querySelectorAll('.card:nth-child(2) .porcent__container svg');
    console.log($iconPorcentajeVentas);
    
    // Mostrar valores actuales
    $ventasTotales.textContent = reporteActual.total_ventas;
    $ingresosTotales.textContent = `$${reporteActual.total_recaudo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Calcular porcentajes de diferencia
    const porcentajeDiferenciaIngresos = calcularPorcentajeDiferencia(reporteActual.total_recaudo, reporteAnterior.total_recaudo);
    const porcentajeDiferenciaVentas = calcularPorcentajeDiferencia(reporteActual.total_ventas, reporteAnterior.total_ventas);

    // Mostrar porcentajes en los elementos correspondientes
    $porcentajeIngresos.textContent = `${porcentajeDiferenciaIngresos}%`;
    $porcentajeVentas.textContent = `${porcentajeDiferenciaVentas}%`;

    // Actualizar clases para indicar si es positivo o negativo
    actualizarClasePorcentaje($porcentajeIngresos,$iconPorcentajeIngresos , porcentajeDiferenciaIngresos);
    actualizarClasePorcentaje($porcentajeVentas, $iconPorcentajeVentas,porcentajeDiferenciaVentas);
    mostrarPlatosMasVendidos('mensual', mesActual); // Llama a la función para mostrar los platos más vendidos
    mostrarReporteEnDashboard(mesActual); // Mostrar el reporte en el gráfico
}

// Función para calcular la diferencia porcentual
function calcularPorcentajeDiferencia(actual, anterior) {
    if (anterior === 0) return 100; // Evitar división por 0
    const diferencia = actual - anterior;
    const porcentaje = (diferencia / anterior) * 100;
    return porcentaje.toFixed(1); // Limitar a un decimal
}

// Función para actualizar clases CSS según el valor del porcentaje
function actualizarClasePorcentaje(element,imagen, porcentaje) {
    element.classList.remove('positivo', 'negativo');
    if (porcentaje > 0) {
        element.classList.add('positivo'); // Clase para incremento positivo
        imagen[0].classList.add('positivo')
    } else if (porcentaje < 0) {
        element.classList.add('negativo'); // Clase para decremento negativo
        imagen[1].classList.add('negativo'); 
    }
}
function mostrarFechaActual() {
    const fecha = new Date(); // Obtener la fecha actual
    const opciones = { weekday: 'long', day: 'numeric', month: 'short' }; // Opciones para formatear la fecha
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones); // Formatear la fecha
    const fechaActualElemento = document.getElementById('fechaActual'); // Seleccionar el elemento con id 'fechaActual'
    if (fechaActualElemento) {
        fechaActualElemento.textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1); // Mostrar la fecha con la primera letra en mayúscula
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar('Administrador'); // Renderizar la barra lateral
    mostrarTablaEnDashboard(); // Mostrar la tabla de pedidos
    mostrarIngresosTotales(); // Mostrar ingresos y comparaciones de porcentajes
    mostrarFechaActual(); // Mostrar la fecha actual
    calcularDiaActual();
    escucharSelectPlatos();
});


