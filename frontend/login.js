const AUTH_URL = 'https://blog-api-backend-71br.onrender.com/api/auth/login';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guarda o token e o nome do utilizador no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);

            // Redireciona de volta para a página principal
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.error || 'Invalid credentials. Please try again.';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Could not connect to the server.';
    }
});