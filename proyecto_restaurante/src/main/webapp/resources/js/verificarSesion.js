// verificarSesion.js

export async function verificarRol(rolRequerido) {
    try {
        console.log('Iniciando verificación de rol...');
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token);

        if (!token) {
            throw new Error('Token no disponible');
        }

        const response = await fetch('http://localhost:8080/auth/check-session', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Respuesta HTTP de check-session:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en check-session:', errorData);
            throw new Error('Error al verificar la sesión');
        }

        const data = await response.json();
        console.log('Datos de check-session:', data);

        if (data.rol !== rolRequerido) {
            console.log('Rol no coincide:', data.rol, rolRequerido);
            window.location.href = '/forbidden.html'; // Asegúrate de tener esta página
            return false;
        }

        console.log('Rol verificado correctamente:', data.rol);
        return true;
    } catch (error) {
        console.error('Error al verificar el rol:', error);
        alert('Error al verificar el rol');
        window.location.href = '/index.html'; // Redirige al login si hay error
        return false;
    }
}

