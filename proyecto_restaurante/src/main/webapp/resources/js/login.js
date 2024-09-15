import {verificarUsuario} from '../../SolicitudesAPI/gestionarLogeo.js'

const $formulario = document.querySelector('#LoginForm');
const $enviar = document.querySelector('#submitButton');


$enviar.addEventListener('click', async (e) => {
    e.preventDefault(); 


    const username = $formulario[0].value;
    const password = $formulario[1].value;

    try {

        const data = await verificarUsuario(username, password);


        if (data.status === 'success') {
            console.log('Login exitoso', data.rol);


            switch (data.rol.toLowerCase()) {
                case 'mesero':
                    window.location.href = '/mesero.html'; 
                    break;
                case 'cajero':
                    window.location.href = '/cajero.html';
                    break;
                case 'chef':
                    window.location.href = '/chef.html'; 
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

