export function validarPrecio(input){
    let re = /^\d+(\.\d+)?$/.test(input.trim());
    return re;
}

export function validarTexto(input){
    let re = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(input.trim());
    return re;
}

export function validarNumero(input) {
    let re = /^\d+$/;
    return re.test(input.trim());
}

// Función para validar texto con letras, números y caracteres específicos (. , #)
export function validarTextoDetalles(input) {
    let re = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,#]+$/;
    return re.test(input.trim());
}