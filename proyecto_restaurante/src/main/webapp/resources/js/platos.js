// Asegúrate de ajustar la ruta si es necesario
import { obtenerCategorias } from '../../SolicitudesAPI/consultasSelect/gestionarCategorias.js'; // Asegúrate de ajustar la ruta si es necesario
import { obtenerPlatos } from '../../SolicitudesAPI/gestionarPlatos.js';
import { renderSidebar } from "./sideBarComponent.js";
import { crearTabContentAdmin } from './renderTables/renderPlatesMenu.js';
import { crearTab } from './renderTables/renderPlatesMenu.js';
import { manejarNavegacionTabs } from './renderTables/renderPlatesMenu.js';

async function verificarUsuario() {
    const rolRequerido = 'Administrador'; // Cambia esto según el rol que necesites
    const tieneAcceso = await verificarRol(rolRequerido);

    if (tieneAcceso) {
        document.addEventListener('DOMContentLoaded', async () => {
            renderSidebar('Administrador');
            try {
                // Obtener todas las categorías y los platos
                const categorias = await obtenerCategorias();
                const platos = await obtenerPlatos();
                console.log(platos);
        
                // Crear las tabs para las categorías
                const tabsContainer = document.querySelector('.tabs');
                const contentContainer = document.querySelector('.tab-contents');
        
                if (!tabsContainer || !contentContainer) {
                    console.error('Contenedores de tabs o contenido no encontrados.');
                    return;
                }
        
                // Crear la primera tab para mostrar todos los platos
                crearTab('Todos', 'todos', tabsContainer);
                crearTabContentAdmin('todos', contentContainer, platos);
        
                // Crear una tab y contenido para cada categoría
                categorias.forEach(categoria => {
                    crearTab(categoria.categoria, `tab-${categoria.id_categoria}`, tabsContainer);
                    const platosCategoria = platos.filter(plato => plato.categoria === categoria.categoria);
                    crearTabContentAdmin(`tab-${categoria.id_categoria}`, contentContainer, platosCategoria);
                });
        
                // Manejar la navegación de tabs
                manejarNavegacionTabs();
        
                // Añadir funcionalidad al botón de "Añadir nuevo plato"
                document.querySelectorAll('.new_dish').forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Aquí podrías abrir un modal o redirigir a un formulario de creación de platos
                        console.log('Abrir modal para añadir nuevo plato');
                    });
                });
        
                // Inicializar la posición del indicador de tabs
                const activeButton = document.querySelector('.tab-button.active');
                if (activeButton) {
                    const tabIndicator = document.querySelector('.tab-indicator');
                    tabIndicator.style.transform = `translateX(${activeButton.offsetLeft}px)`;
                    tabIndicator.style.width = `${activeButton.offsetWidth}px`;
                }
            } catch (error) {
                console.error('Error al inicializar la página:', error);
            }
        
        });
        
    }
}


verificarUsuario();






