/* login.css */

/* Sección de Login */
.login-section {
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, var(--background1) 0%, var(--background2) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    font-family: var(--font-family);
}

/* Contenedor del Login */
.login-container {
    background-color: var(--secundario);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
    animation: fadeIn 1s ease-in-out;
}

/* Logo */
.logo-container {
    margin-bottom: 20px;
}

.logo {
    width: 150px;
    height: auto;
    object-fit: contain;
}

/* Título del Formulario */
.form-title {
    color: var(--primario);
    margin-bottom: 20px;
    font-size: 1.8rem;
    text-transform: uppercase;
    text-align: center;
}

/* Agrupación de Inputs */
.input-group {
    width: 100%;
    margin-bottom: 15px;
    position: relative;
}

.input-field {
    width: 100%;
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    background-color: var(--terciario);
    color: var(--blanco);
    font-size: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.input-field::placeholder {
    color: var(--disabled);
}

.input-field:focus {
    background-color: var(--background1);
    box-shadow: 0 0 8px var(--primario);
    outline: none;
    transform: scale(1.02);
}

.input-field.invalid {
    border: 1px solid #FF6B6B;
}

.input-field.invalid::placeholder {
    color: #FF6B6B;
}

.error-message {
    color: #FF6B6B;
    font-size: 0.8rem;
    margin-top: 4px;
    display: none;
}

/* Botón de Ingreso */
.primary-button {
    width: 100%;
    padding: 12px;
    background-color: var(--primario);
    color: var(--secundario);
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.primary-button:hover {
    background-color: #e0c47a; /* Ligero ajuste para el hover */
    transform: translateY(-2px) scale(1.02);
}

.primary-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Botón de Recuperación de Contraseña */
.button-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.link {
    color: var(--primario);
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.link:hover {
    color: var(--blanco);
}

/* Opciones Adicionales */
.additional-options {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
}

.additional-options .link {
    margin: 0 10px;
}

/* Animaciones */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Accesibilidad: Visually Hidden */
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap; /* Evita el salto de línea */
    border: 0;
}

/* Responsividad */
@media (max-width: 480px) {
    .login-container {
        padding: 30px 20px;
    }

    .logo {
        width: 120px;
    }

    .form-title {
        font-size: 1.5rem;
    }

    .input-field {
        padding: 10px 14px;
    }

    .primary-button {
        padding: 10px;
        font-size: 1rem;
    }

    .button-container {
        flex-direction: column;
        align-items: flex-start;
    }

    .button-container .link {
        margin-bottom: 10px;
    }
}

/* Mensajes de Error */
.error-message {
    color: #FF6B6B;
    font-size: 0.8rem;
    margin-top: 4px;
    display: none;
}

.input-field.invalid + .error-message {
    display: block;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       