// login.js
import { verificarUsuario } from '../../SolicitudesAPI/gestionarLogeo.js';

// Seleccionar el formulario y el botón de envío
const formulario = document.querySelector('#LoginForm');
const enviar = document.querySelector('#submitButton');

// Seleccionar los campos de entrada
const usernameInput = formulario.querySelector('input[name="username"]');
const passwordInput = formulario.querySelector('input[name="password"]');

// Seleccionar los mensajes de error
const usernameError = document.querySelector('#username-error');
const passwordError = document.querySelector('#password-error');

/**
 * Valida el campo de Nombre de Usuario
 * @returns {boolean} true si es válido, false si no
 */
function validateUsername() {
    const username = usernameInput.value.trim();
    const inputGroup = usernameInput.closest('.input-group');
    if (username === '') {
        // Campo inválido
        inputGroup.classList.add('invalid');
        inputGroup.classList.remove('valid');
        usernameError.style.display = 'block';
        return false;
    } else {
        // Campo válido
        inputGroup.classList.remove('invalid');
        inputGroup.classList.add('valid');
        usernameError.style.display = 'none';
        return true;
    }
}

/**
 * Valida el campo de Contraseña
 * @returns {boolean} true si es válido, false si no
 */
function validatePassword() {
    const password = passwordInput.value;
    const inputGroup = passwordInput.closest('.input-group');
    if (password.length < 8) {
        // Campo inválido
        inputGroup.classList.add('invalid');
        inputGroup.classList.remove('valid');
        passwordError.style.display = 'block';
        return false;
    } else {
        // Campo válido
        inputGroup.classList.remove('invalid');
        inputGroup.classList.add('valid');
        passwordError.style.display = 'none';
        return true;
    }
}

// Añadir event listeners para validar al perder el foco
usernameInput.addEventListener('keydown', validateUsername);
passwordInput.addEventListener('keydown', validatePassword);

// Manejar el evento de envío del formulario
enviar.addEventListener('click', async (e) => {
    e.preventDefault(); 

    // Validar ambos campos antes de proceder
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isPasswordValid) {
        // Si alguno de los campos no es válido, no continuar
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        const data = await verificarUsuario(username, password);

        if (data.status === 'success') {
            console.log('Login exitoso', data.rol);

            // Almacenar el token
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // Redireccionar según el rol del usuario
            switch (data.rol.toLowerCase()) {
                case 'mesero':
                    window.location.href = '/newOrder.html'; 
                    break;
                case 'cajero':
                    window.location.href = '/porPagarFactura.html';
                    break;
                case 'chef':
                    window.location.href = '/pedidos_Pendientes.html'; 
                    break;
                case 'administrador':
                    window.location.href = '/dashboard.html'; 
                    break;
                default:
                    console.error('Rol no reconocido');
                    alert('Rol no reconocido. Contacte al administrador.');
            }
        } else {
            console.error('Error:', data.message);
            alert(data.message); 
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Hubo un problema al intentar iniciar sesión. Inténtalo nuevamente.');
    }
});



