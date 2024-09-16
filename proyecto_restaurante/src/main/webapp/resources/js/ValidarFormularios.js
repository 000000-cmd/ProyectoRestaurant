export function validarNumero(input){
    let re = /^\d+(\.\d+)?$/.test(input.trim());
    return re;
}

export function validarTexto(input){
    let re = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(input.trim());
    return re;
}