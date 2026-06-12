const API_AUTH = '/api/auth/login';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-msg');

    // Ocultar mensaje de error anterior
    errorMsg.style.display = 'none';

    try {
        const respuesta = await fetch(API_AUTH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Guardamos los datos de la sesión activa en el navegador
            localStorage.setItem('usuario_id', datos.id);
            localStorage.setItem('usuario_rol', datos.rol);
            localStorage.setItem('usuario_username', datos.username);

            // Redirección automática según el rol del usuario
            if (datos.rol === 'admin') {
                window.location.href = 'admin.html';
            } else if (datos.rol === 'empleado') {
                window.location.href = 'empleado.html';
            }
        } else {
            // Mostramos el mensaje de error devuelto por el backend
            errorMsg.innerText = datos.error || 'Error al iniciar sesión';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error('Error en la solicitud de login:', error);
        errorMsg.innerText = 'No hay conexión con el servidor de inventario';
        errorMsg.style.display = 'block';
    }
});