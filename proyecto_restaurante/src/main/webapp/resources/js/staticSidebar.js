function addSidebarItemListeners() {
    // Seleccionar todos los items del sidebar después de que se hayan renderizado
    document.querySelectorAll('.sidebar_item').forEach((item, index, items) => {
        console.log(item);
        
        item.addEventListener('click', function() {
            // Remueve las clases 'active', 'icon_selected', 'prev' y 'next' de todos los elementos
            items.forEach(i => {
                i.classList.remove('active', 'prev', 'next');
                const iconWrapper = i.querySelector('.icon_wraper');
                if (iconWrapper) {
                    iconWrapper.classList.remove('icon_selected');
                }
            });
            console.log(event.target);
            
            // Añade la clase 'active' al elemento seleccionado
            this.classList.add('active');

            // Añade la clase 'icon_selected' al .icon_wraper del elemento seleccionado
            const iconWrapper = this.querySelector('.icon_wraper');
            if (iconWrapper) {
                iconWrapper.classList.add('icon_selected');
            }

            // Añade la clase 'prev' al hermano anterior si existe
            if (items[index - 1]) {
                items[index - 1].classList.add('prev');
            }

            // Añade la clase 'next' al hermano siguiente si existe
            if (items[index + 1]) {
                items[index + 1].classList.add('next');
            }

            // Llama a la función de carga con la página correspondiente
            const pageToLoad = this.getAttribute('data-page'); // Asegúrate de establecer este atributo en cada ítem del sidebar
            if (pageToLoad) {
                loadContent(pageToLoad); // Cargar el contenido dinámicamente
            }
        });
    });
}

function loadContent(page, addToHistory = true) {
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la página');
            }
            return response.text();
        })
        .then(data => {
            const contentContainer = document.getElementById('main_content');
            if (contentContainer) {
                // Reemplaza completamente el contenido del contenedor
                contentContainer.innerHTML = data;

                // Añade la URL al historial si es necesario
                if (addToHistory) {
                    history.pushState({ page }, '', page);
                }
            } else {
                console.error('Contenedor #main-content no encontrado.');
            }
        })
        .catch(error => console.error('Error cargando la página:', error));
}


window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadContent(event.state.page, false);
    } else {
        console.error('Estado del historial inválido o página no encontrada');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    addSidebarItemListeners();
});