import { URLs } from "./URL.js";

export async function verificarUsuario(usuario, contrasen) {
    return await fetch(`${URLs}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usuario, password: contrasen })
    }).then(rp => rp.json());
}
