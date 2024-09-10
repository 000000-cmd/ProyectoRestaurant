function createSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');

    const ul = document.createElement('ul');
    ul.classList.add('sidebar_list');

    const items = [
        {
            className: 'img_container logo_sidebar',
            content: '<img src="resources/images/Logo.png" alt="Logo">'
        },
        {
            className: 'sidebar_item',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="2em" height="2em" viewBox="0 0 15 15"><path fill="#ea580c" d="m7.5.5l.325-.38a.5.5 0 0 0-.65 0zm-7 6l-.325-.38L0 6.27v.23zm5 8v.5a.5.5 0 0 0 .5-.5zm4 0H9a.5.5 0 0 0 .5.5zm5-8h.5v-.23l-.175-.15zM1.5 15h4v-1h-4zm13.325-8.88l-7-6l-.65.76l7 6zm-7.65-6l-7 6l.65.76l7-6zM6 14.5v-3H5v3zm3-3v3h1v-3zm.5 3.5h4v-1h-4zm5.5-1.5v-7h-1v7zm-15-7v7h1v-7zM7.5 10A1.5 1.5 0 0 1 9 11.5h1A2.5 2.5 0 0 0 7.5 9zm0-1A2.5 2.5 0 0 0 5 11.5h1A1.5 1.5 0 0 1 7.5 10zm6 6a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5zm-12-1a.5.5 0 0 1-.5-.5H0A1.5 1.5 0 0 0 1.5 15z"/></svg>',
            url:"dashboard.html"
        },
        {
            className: 'sidebar_item',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="2em" height="2em" viewBox="0 0 48 48"><g fill="#FACE8D"><path d="M36.99 29.003c-3.67-.038-5.717.332-9.612 1.923l-.756-1.852c4.127-1.685 6.438-2.112 10.388-2.071zm-9.612-2.077c3.895-1.59 5.943-1.961 9.612-1.923l.02-2c-3.95-.041-6.26.386-10.388 2.071zm9.612-5.923c-3.67-.038-5.717.332-9.612 1.923l-.756-1.852c4.127-1.685 6.438-2.112 10.388-2.071zM34.5 16v-3h2v3zM31 14v3h2v-3zm-3.5 4v-3h2v3zM11.01 29.003c3.67-.038 5.717.332 9.612 1.923l.756-1.852c-4.127-1.685-6.438-2.112-10.388-2.071zm9.612-2.077c-3.895-1.59-5.942-1.961-9.612-1.923l-.02-2c3.95-.041-6.26.386-10.388 2.071zm-9.612-5.923c3.67-.038 5.717.332 9.612 1.923l.756-1.852c-4.127-1.685-6.438-2.112-10.388-2.071zM13.5 16v-3h-2v3zm3.5-2v3h-2v-3zm3.5 4v-3h-2v3z"/><path fill-rule="evenodd" d="M42 10.984q.609.134 1.243.287a.99.99 0 0 1 .757.965v25.539c0 .633-.583 1.105-1.204.987c-6.213-1.185-10.4-1.268-16.122-.4a3 3 0 0 1-5.348 0c-5.721-.868-9.91-.785-16.122.4A1.01 1.01 0 0 1 4 37.775V12.237a.99.99 0 0 1 .757-.966q.634-.153 1.243-.287v-.46c0-.885.589-1.694 1.484-1.92c6.15-1.546 10.628.092 15.757 2.477q.375.077.759.16q.384-.083.76-.16c5.128-2.385 9.606-4.023 15.756-2.476A1.97 1.97 0 0 1 42 10.524zm-2 22.984V10.537c-5.658-1.415-9.683.135-15 2.64v23.242l.003.002l.002.001l.009.003h.003l.006-.002c4.909-2.222 9.191-3.483 14.923-2.437a.06.06 0 0 0 .047-.011zm-17.003 2.453l.003-.002V13.177c-5.317-2.504-9.342-4.055-15-2.64v23.431l.007.007a.06.06 0 0 0 .048.012c5.73-1.047 10.013.214 14.922 2.435l.008.003h.001z" clip-rule="evenodd"/></g></svg>',
            url:"historico.html"
        },
        {
            className: 'sidebar_item',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="2em" height="2em" viewBox="0 0 512 512"><path fill="none" stroke="#FACE8D" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M427.68 351.43C402 320 383.87 304 383.87 217.35C383.87 138 343.35 109.73 310 96c-4.43-1.82-8.6-6-9.95-10.55C294.2 65.54 277.8 48 256 48s-38.21 17.55-44 37.47c-1.35 4.6-5.52 8.71-9.95 10.53c-33.39 13.75-73.87 41.92-73.87 121.35C128.13 304 110 320 84.32 351.43C73.68 364.45 83 384 101.61 384h308.88c18.51 0 27.77-19.61 17.19-32.57M320 384v16a64 64 0 0 1-128 0v-16"/></svg>',
            url:""
        },
        {
            className: 'sidebar_item',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="#FACE8D" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.017 21c.555 0 1.005-.448 1.005-1v-.45c0-.307.164-.563.433-.715a9 9 0 0 0 1.944-1.471a8.95 8.95 0 0 0 2.595-5.366c.061-.549-.395-.998-.95-.998H3.956c-.555 0-1.011.45-.95.998A8.95 8.95 0 0 0 5.6 17.364a9 9 0 0 0 1.833 1.408c.33.193.55.537.548.918v.307A1.003 1.003 0 0 0 8.986 21zM6 5v2m12-2v2m-6-4v4"/></svg>',
            url:"gestion_platos.html"
        },
        {
            className: 'sidebar_item',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#FACE8D" d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"/></svg>',
            url:"conf_usuarios.html"
        },
        {
            className: 'sidebar_item',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="#FACE8D" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"/></svg>',
            url:"index.html"
        }
    ];

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = item.className;

        if (item.content) {
            li.innerHTML = item.content;
        } else if (item.icon) {
            const link = document.createElement('a');
            link.className = 'svg_container';
            link.href = item.url;

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'icon_wraper';
            iconWrapper.innerHTML = item.icon;

            link.appendChild(iconWrapper);
            li.appendChild(link);
        }

        ul.appendChild(li);
    });

    sidebar.appendChild(ul);
    return sidebar;
}

function addSidebarItemListeners() {
    // Seleccionar todos los items del sidebar después de que se hayan renderizado
    document.querySelectorAll('.sidebar_item').forEach((item, index, items) => {
        // Evento para cuando el mouse está sobre el ítem
        item.addEventListener('mouseover', function() {
            // Remueve las clases 'active', 'icon_selected', 'prev' y 'next' de todos los elementos
            items.forEach(i => {
                i.classList.remove('active', 'prev', 'next');
                const iconWrapper = i.querySelector('.icon_wraper');
                if (iconWrapper) {
                    iconWrapper.classList.remove('icon_selected');
                }
            });

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
        });

        // Evento para cuando el mouse sale del ítem
        item.addEventListener('mouseleave', function() {
            // Remueve las clases 'active', 'icon_selected', 'prev' y 'next' de todos los elementos
            items.forEach(i => {
                i.classList.remove('active', 'prev', 'next');
                const iconWrapper = i.querySelector('.icon_wraper');
                if (iconWrapper) {
                    iconWrapper.classList.remove('icon_selected');
                }
            });
        });
    });
}
export function renderSidebar() {
    const sidebar = createSidebar();
    const mainContent = document.querySelector('.main_content');

    if (mainContent) {
        mainContent.parentNode.insertBefore(sidebar, mainContent);
        addSidebarItemListeners(); // Añadir listeners después de insertar el sidebar
    }
}