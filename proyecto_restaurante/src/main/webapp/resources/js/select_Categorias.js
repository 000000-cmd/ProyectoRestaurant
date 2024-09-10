import { obtenerCategorias } from "../../SolicitudesAPI/consultasSelect/gestionarCategorias.js";
document.addEventListener("DOMContentLoaded", async()=>{
    
    const selecCategorias= document.querySelector("#select_plate")
    const categorias =  await obtenerCategorias();
    

    categorias.forEach(categoria => {
        const option = document.createElement("option")
        option.value= categoria.id_categoria;
        option.textContent= categoria.categoria;

        selecCategorias.appendChild(option);
    });

})
