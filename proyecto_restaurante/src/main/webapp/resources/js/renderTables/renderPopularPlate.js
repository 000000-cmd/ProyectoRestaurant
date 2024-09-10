import { renderSidebar } from "../sideBarComponent.js";


document.addEventListener("DOMContentLoaded", ()=>{
    renderSidebar();
    const data = [
        {
            nombrePlato: "Macarrones con queso",
            pedidosHoy: { porcentaje: 18.3, total: 42 },
            pedidosSemana: { porcentaje: 16.1, total: 96 },
            precio: 16000,
            gananciaHoy: 138000,
            gananciaSemana: 260000
        },
    ];
    
    const tableBody = document.querySelector('.tabla tbody');
    
    data.forEach(plato => {
        const row = document.createElement('tr');
    
        // Crear celda de imagen y nombre del plato
        const imgCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = 'path_to_image'; // Ajusta la ruta de la imagen
        const p = document.createElement("p");
        p.textContent = plato.nombrePlato;
        imgCell.appendChild(img);
        imgCell.appendChild(p);
    
        // Crear celda para Pedidos Hoy con barra de progreso
        const pedidosHoyCell = document.createElement('td');
        const progressHoy = crearBarraProgreso(plato.pedidosHoy.porcentaje, plato.pedidosHoy.total);
        pedidosHoyCell.appendChild(progressHoy);
    
        // Crear celda para Pedidos Semana con barra de progreso
        const pedidosSemanaCell = document.createElement('td');
        const progressSemana = crearBarraProgreso(plato.pedidosSemana.porcentaje, plato.pedidosSemana.total);
        pedidosSemanaCell.appendChild(progressSemana);
    
        // Crear celdas para el precio y las ganancias
        const precioCell = document.createElement('td');
        precioCell.textContent = `$${plato.precio.toLocaleString()}`;
    
        const gananciaHoyCell = document.createElement('td');
        gananciaHoyCell.textContent = `$${plato.gananciaHoy.toLocaleString()}`;
    
        const gananciaSemanaCell = document.createElement('td');
        gananciaSemanaCell.textContent = `$${plato.gananciaSemana.toLocaleString()}`;
    
        // Añadir las celdas a la fila
        row.appendChild(imgCell);
        row.appendChild(pedidosHoyCell);
        row.appendChild(pedidosSemanaCell);
        row.appendChild(precioCell);
        row.appendChild(gananciaHoyCell);
        row.appendChild(gananciaSemanaCell);
    
        // Añadir la fila al cuerpo de la tabla
        tableBody.appendChild(row);
    });
    
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
    
    
})



