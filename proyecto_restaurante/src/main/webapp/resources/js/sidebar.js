document.querySelectorAll('.sidebar_item').forEach((item, index, items) => {
    item.addEventListener('click', function() {
        // Remueve las clases 'active', 'icon_selected', 'prev' y 'next' de todos los elementos
        items.forEach(i => {
            i.classList.remove('active');
            i.classList.remove('prev');
            i.classList.remove('next');
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
});
