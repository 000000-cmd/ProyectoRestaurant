export const URLs = 'http://localhost:8080/auth';  // Asegúrate de que esta URL coincide con tu configuración

export async function verificarUsuario(usuario, contrasen) {
    return await fetch(`${URLs}/login`, {  // Endpoint actualizado a /auth/login
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usuario, password: contrasen })
    }).then(rp => rp.json());
}
