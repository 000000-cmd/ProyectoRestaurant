export async function verificarRol(rolRequerido) {
    try {
        // Obtener el token almacenado (por ejemplo, en localStorage)
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token no disponible');
        }

        const response = await fetch('/check-session', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al verificar la sesión');
        }

        const data = await response.json();

        // Verificar si el rol del usuario es el correcto
        if (data.rol !== rolRequerido) {
            alert('No tienes permiso para acceder a esta página');
            window.location.href = '/forbidden'; // Redirige a una página de acceso denegado
            return false;
        }

        return true; // El rol es correcto, permite continuar

    } catch (error) {
        alert('Error al verificar el rol');
        console.error('Error al verificar el rol:', error);
        window.location.href = '/index.html';
        return false;
    }
}