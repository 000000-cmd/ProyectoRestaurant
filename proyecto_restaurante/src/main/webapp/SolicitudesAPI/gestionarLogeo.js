import { URLs } from "./URL.js";

export async function verificarUsuario(usuario, contrasen) {
    return await fetch(`${URLs}/usuarios/login?username=${usuario}&password=${contrasen}`).then(rp => rp.json());
}