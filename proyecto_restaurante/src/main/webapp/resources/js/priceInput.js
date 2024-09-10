document.addEventListener('DOMContentLoaded', () => {
    const priceInput = document.getElementById('plate_price');

    if (priceInput) {
        priceInput.addEventListener('input', (e) => {
            formatCurrency(e.target);
        });
    }
});

function formatCurrency(input) {
    // Obtén el valor actual del input
    let value = input.value;

    // Remueve cualquier caracter que no sea número o punto decimal
    value = value.replace(/[^0-9.]/g, '');

    // Si hay más de un punto decimal, remueve los adicionales
    if ((value.match(/\./g) || []).length > 1) {
        value = value.replace(/\.+$/, ""); // Remueve el último punto añadido
    }

    // Formatea el valor como moneda
    const options = { 
        style: 'currency', 
        currency: 'USD', 
        minimumFractionDigits: 2 
    };

    const formattedValue = new Intl.NumberFormat('en-US', options).format(value);
    
    // Remueve el símbolo de moneda y aplica el valor formateado
    input.value = formattedValue.replace(/[^\d.-]/g, '');
}
