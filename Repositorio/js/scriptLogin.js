document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente

        const nombre = document.getElementById('nombre').value;
        const contrasenha = document.getElementById('contrasenha').value;

        // Objeto con los datos a enviar al servidor
        const formData = {
            nombre: nombre,
            contrasenha: contrasenha
        };

        // URL de la API de login
        const url = 'http://localhost:5000/login'; // Reemplaza con tu URL correcta

        // Opciones para la solicitud fetch
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };
        
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {                
                console.log('Respuesta del servidor:', data);                
                window.location.replace('./postDocumentos.html'); 
            })
            .catch(error => {
                console.error('Error:', error);                
                alert('Error al iniciar sesión. Verifica tu nombre de usuario y contraseña.');
            });
    });
});
