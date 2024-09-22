import { renderSidebar } from "./sideBarComponent.js";
import { cargarPedidosCajero, completarPedido, descargarFactura, pedidoCompleto_Mesa } from "../../SolicitudesAPI/gestionarPedidos.js";
import { obtenerPlatoPorId } from '../../SolicitudesAPI/gestionarPlatos.js';
import { verificarRol } from './verificarSesion.js';

async function verificarUsuario() {
    const rolRequerido = 'Cajero'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
            renderSidebar('Cajero');
            
            const urlParams = new URLSearchParams(window.location.search);
            const mesa = urlParams.get('mesa');
        
            try {
                const pedidos = await cargarPedidosCajero();
                const pedido = pedidos.find(p => p.mesa === parseInt(mesa, 10));
                
                if (!pedido) {
                    console.error('No se encontró el pedido para la mesa:', mesa);
                    return;
                }
        
                await renderFactura(pedido);
        
            } catch (error) {
                console.error('Error al cargar los pedidos:', error);
            }
    }
}
document.addEventListener("DOMContentLoaded", verificarUsuario);

async function renderFactura(pedido) {
    const facturarContainer = document.querySelector('.facturar-container');
    facturarContainer.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.textContent = `Pedido A Facturar`;
    facturarContainer.appendChild(titulo);

    const tabla = document.createElement('table');
    tabla.className = 'factura-tabla';

    const thead = document.createElement('thead');
    const encabezadoFila = document.createElement('tr');

    const encabezados = ['Platos a facturar', 'Cantidad', 'Precio Unitario', 'Detalles', 'Precio Total'];
    encabezados.forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        encabezadoFila.appendChild(th);
    });

    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    let subtotal = 0;

    for (const contenido of pedido.contenidos) {
        const plato = await obtenerPlatoPorId(contenido.id_plato);
        const precio = plato.precio;
        const subtotalItem = precio * contenido.cantidad_plato;
        subtotal += subtotalItem;

        const fila = document.createElement('tr');

        // Crear la celda del nombre y la imagen del plato
        const celdaNombre = document.createElement('td');
        const imgPlato = document.createElement('img');
        imgPlato.src = `data:image/png;base64,${plato.img_plato}`;
        imgPlato.alt = contenido.nombre_plato;
        imgPlato.style.width = '50px';
        imgPlato.style.height = '50px';
        imgPlato.style.marginRight = '10px';

        const nombrePlato = document.createElement('span');
        nombrePlato.textContent = contenido.nombre_plato;

        celdaNombre.appendChild(imgPlato);
        celdaNombre.appendChild(nombrePlato);
        fila.appendChild(celdaNombre);

        const celdaCantidad = document.createElement('td');
        celdaCantidad.textContent = contenido.cantidad_plato;
        fila.appendChild(celdaCantidad);

        const celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = `$${precio.toFixed(2)}`;
        fila.appendChild(celdaPrecio);

        const celdaDetalles = document.createElement('td');
        const detalles = pedido.detalles.filter(detalle => detalle.id_plato === contenido.id_plato)
            .map(detalle => `${detalle.cantidad_platos_modificacion} - ${detalle.detalles_plato}`)
            .join(', ');
        celdaDetalles.textContent = detalles || 'Sin detalles';
        fila.appendChild(celdaDetalles);

        const celdaSubtotal = document.createElement('td');
        celdaSubtotal.textContent = `$${subtotalItem.toFixed(2)}`;
        fila.appendChild(celdaSubtotal);

        tbody.appendChild(fila);
    }

    tabla.appendChild(tbody);
    facturarContainer.appendChild(tabla);

    // Crear el footer para mostrar los totales
    const facturaFooter = document.createElement('div');
    facturaFooter.className = 'factura-footer';

    const totalesContainer = document.createElement('div');
    totalesContainer.className = 'totales-container';

    const subtotalText = document.createElement('p');
    subtotalText.innerHTML = `SubTotal: <span class="subtotal-valor">$${subtotal.toFixed(2)}</span>`;
    totalesContainer.appendChild(subtotalText);

    const totalText = document.createElement('p');
    totalText.innerHTML = `Total a pagar: <span class="total-valor">$${subtotal.toFixed(2)}</span>`;
    totalesContainer.appendChild(totalText);

    facturaFooter.appendChild(totalesContainer);
    facturarContainer.appendChild(facturaFooter);

    // Botones para Regresar y Facturar Pago
    const existingButtons = document.querySelector('.factura-buttons');
    if (existingButtons) {
        existingButtons.remove();
    }

    const botonesContainer = document.createElement('div');
    botonesContainer.className = 'factura-buttons';

    const regresarButton = document.createElement('button');
    regresarButton.className = 'secundary_button';
    regresarButton.textContent = 'Regresar';
    regresarButton.onclick = () => window.history.go(-1);

    const facturarButton = document.createElement('button');
    facturarButton.className = 'primary_button facturar-button';
    facturarButton.textContent = 'Facturar Pago';

    facturarButton.onclick = async () => {
        // Completar el pedido y luego descargar la factura
        try {
            // Llama a pedidoCompleto_Mesa para obtener el ID del pedido completo
            const pedidoCompleto = await pedidoCompleto_Mesa(pedido.mesa);
            if (!pedidoCompleto) {
                alert('Error al obtener los detalles completos del pedido.');
                return;
            }
            const idHistorico = pedidoCompleto.id_pedido; // Ajusta para obtener el ID correcto
            
            const completarResponse = await completarPedido(pedido.mesa);
            if (completarResponse.status === 'success') {
                descargarFactura(idHistorico);
                window.location.href = "porPagarFactura.html";
            } else {
                alert('Error al completar el pedido: ' + completarResponse.message);
            }
        } catch (error) {
            console.error('Error al completar el pedido:', error);
        }
    };

    botonesContainer.appendChild(regresarButton);
    botonesContainer.appendChild(facturarButton);

    facturarContainer.parentElement.appendChild(botonesContainer);
}