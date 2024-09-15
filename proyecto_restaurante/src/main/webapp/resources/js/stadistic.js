import { renderSidebar } from "./sideBarComponent.js"
import { mostrarReporte } from "./reportComponent.js";
import { mostrarPlatosMasVendidos } from "./masOrdenadoComponent.js";

async function mostrarIngresosTotales() {
    const fecha = new Date();
    
    const mesActual = calcularMesActual();

    mostrarReporteEnDashboard(mesActual);
    mostrarPlatosMasVendidos('mensual', mesActual) // Mostrar el reporte en el gráfico
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


async function mostrarReporteEnDashboard(mesActual) {
    const contenedorGrafico = document.querySelector('#chart');
    if (contenedorGrafico) {
        await mostrarReporte('mensual', mesActual);
    } else {
        console.error('No se encontró el contenedor con el id #chart');
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    renderSidebar('Administrador');
    mostrarIngresosTotales();
   
})