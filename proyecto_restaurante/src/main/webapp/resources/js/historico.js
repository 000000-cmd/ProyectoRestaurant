import { renderSidebar } from "./sideBarComponent.js";
import { obtenerHistoricoPedidos } from "../../SolicitudesAPI/traerHistorico.js";
import { renderizarTablaHistoricoPedidos } from "./renderTables/renderTableHistorico.js";
import { verificarRol } from "./verificarSesion.js";


async function verificarUsuario() {
    const rolRequerido = 'Administrador'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
            renderSidebar('Administrador');

            // Variables globales de paginación
            let paginaActual = 1; // Página inicial
            const limit = 10; // Número de registros por página

            // Función para cargar y renderizar los pedidos de una página específica
            async function cargarPedidos(pagina) {
                // Obtiene los datos de los pedidos con paginación
                const resultado = await obtenerHistoricoPedidos(pagina, limit);

                // Verifica si se obtuvieron los pedidos correctamente
                if (resultado) {
                    const { pedidos, pagination } = resultado;
                    const { paginaActual: nuevaPaginaActual } = pagination;
                    paginaActual = nuevaPaginaActual; // Actualizar la página actual

                    // Formatear el total facturado para cada pedido antes de renderizar la tabla
                    pedidos.forEach(pedido => {
                        if (pedido.total_facturado !== undefined) {
                            const totalFacturado = Number(pedido.total_facturado);
                            pedido.total_facturado_formateado = `$${totalFacturado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                    });

                    // Limpiar el contenedor de la tabla antes de renderizar nuevos datos
                    const container = document.querySelector('.table-container');
                    container.innerHTML = '';

                    // Renderizar la tabla de pedidos
                    const tabla = renderizarTablaHistoricoPedidos(pedidos);
                    container.appendChild(tabla);

                    // Renderizar los controles de paginación
                    renderizarControlesDePaginacion(pagination);
                } else {
                    console.error('No se pudieron obtener los pedidos');
                }
            }

            // Función para renderizar los controles de paginación
            function renderizarControlesDePaginacion(pagination) {
                const { paginaActual, paginasTotales, paginaAnterior, paginaSiguiente } = pagination;

                // Seleccionar el contenedor del paginador en el HTML
                const paginationContainer = document.querySelector('nav[data-pagination]');
                paginationContainer.innerHTML = ''; // Limpiar contenido previo

                // Botón de página anterior (flecha izquierda)
                const prevLink = document.createElement('a');
                prevLink.href = '#';
                if (paginaAnterior) {
                    prevLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarPedidos(paginaAnterior);
                    });
                } else {
                    prevLink.classList.add('disabled');
                }
                const prevIcon = document.createElement('i');
                prevIcon.className = 'ion-chevron-left'; // Icono de flecha izquierda
                prevLink.appendChild(prevIcon);
                paginationContainer.appendChild(prevLink);

                // Lista de páginas
                const pageList = document.createElement('ul');

                // Rango de páginas a mostrar
                const maxPagesToShow = 7; // Número máximo de páginas a mostrar en el paginador
                let startPage = Math.max(1, paginaActual - Math.floor(maxPagesToShow / 2));
                let endPage = startPage + maxPagesToShow - 1;

                if (endPage > paginasTotales) {
                    endPage = paginasTotales;
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                }

                // Mostrar primera página y puntos suspensivos si es necesario
                if (startPage > 1) {
                    pageList.appendChild(crearElementoPagina(1, paginaActual));
                    if (startPage > 2) {
                        const ellipsis = document.createElement('li');
                        ellipsis.textContent = '…';
                        pageList.appendChild(ellipsis);
                    }
                }

                // Añadir números de página al paginador
                for (let i = startPage; i <= endPage; i++) {
                    pageList.appendChild(crearElementoPagina(i, paginaActual));
                }

                // Mostrar última página y puntos suspensivos si es necesario
                if (endPage < paginasTotales) {
                    if (endPage < paginasTotales - 1) {
                        const ellipsis = document.createElement('li');
                        ellipsis.textContent = '…';
                        pageList.appendChild(ellipsis);
                    }
                    pageList.appendChild(crearElementoPagina(paginasTotales, paginaActual));
                }

                paginationContainer.appendChild(pageList);

                // Botón de página siguiente (flecha derecha)
                const nextLink = document.createElement('a');
                nextLink.href = '#';
                if (paginaSiguiente) {
                    nextLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarPedidos(paginaSiguiente);
                    });
                } else {
                    nextLink.classList.add('disabled');
                }
                const nextIcon = document.createElement('i');
                nextIcon.className = 'ion-chevron-right'; // Icono de flecha derecha
                nextLink.appendChild(nextIcon);
                paginationContainer.appendChild(nextLink);
            }

            // Función para crear un elemento de página
            function crearElementoPagina(pagina, paginaActual) {
                const pageItem = document.createElement('li');
                if (pagina === paginaActual) {
                    pageItem.classList.add('current');
                }

                const pageLink = document.createElement('a');
                pageLink.href = `#${pagina}`;
                pageLink.textContent = pagina;

                if (pagina !== paginaActual) {
                    pageLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarPedidos(pagina);
                    });
                }

                pageItem.appendChild(pageLink);
                return pageItem;
            }

            // Cargar la página inicial
            cargarPedidos(paginaActual);
        };
}

document.addEventListener("DOMContentLoaded", verificarUsuario);