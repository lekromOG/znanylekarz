const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showLoginButton = document.getElementById('show-login');
const showRegisterButton = document.getElementById('show-register');
const message = document.getElementById('message');

showRegisterButton.addEventListener('click', () => {
    registerForm.classList.remove('hidden'); 
    loginForm.classList.add('hidden'); 
    showRegisterButton.classList.add('active');
    showLoginButton.classList.remove('active');
});

showLoginButton.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden'); 
    showLoginButton.classList.add('active');
    showRegisterButton.classList.remove('active');
});


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token); 
            message.textContent = 'Login successful!';
            message.style.color = 'green';
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            message.textContent = error.error || 'Login failed';
            message.style.color = 'red';
        }
    } catch (err) {
        message.textContent = 'An error occurred';
        message.style.color = 'red';
        console.error('Error:', err);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lastname, email, password, role })
        });

        if (response.ok) {
            const data = await response.json();
            message.textContent = 'Registration successful!';
            message.style.color = 'green';
            console.log('Registered user:', data);
        } else {
            const error = await response.json();
            message.textContent = error.error || 'Registration failed';
            message.style.color = 'red';
        }
    } catch (err) {
        message.textContent = 'An error occurred';
        message.style.color = 'red';
        console.error('Error:', err);
    }
});