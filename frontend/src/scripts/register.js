const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleFormButton = document.getElementById('toggle-form');
const message = document.getElementById('message');

const customSelect = document.querySelector('.custom-select');
const selected = customSelect.querySelector('.selected');
const optionsContainer = customSelect.querySelector('.options');
const options = customSelect.querySelectorAll('.option');
const hiddenInput = document.getElementById('role');

selected.addEventListener('click', (e) => {
    e.stopPropagation(); 
    optionsContainer.classList.toggle('hidden');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        selected.textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        optionsContainer.classList.add('hidden');
    });
});

document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        optionsContainer.classList.add('hidden'); 
    }
});

toggleFormButton.addEventListener('click', () => {
    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        toggleFormButton.textContent = 'Sign Up'; 
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        toggleFormButton.textContent = 'Sign In';
    }
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
            message.style.display = 'block';
            message.textContent = 'Login successful!';
            message.style.color = 'green'; 

            window.location.href = 'http://localhost:3000/index.html';
        } else {
            const error = await response.json();
            localStorage.removeItem('token'); 
            message.style.display = 'block';
            message.textContent = error.error || 'Login failed';
            message.style.color = 'red';
        }
    } catch (err) {
        localStorage.removeItem('token'); 
        message.style.display = 'block';
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
    const role = hiddenInput.value; 

    if (!role) {
        message.style.display = 'block';
        message.textContent = 'Please select a role.';
        message.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lastname, email, password, role })
        });

        if (response.ok) {
            const data = await response.json();
            message.style.display = 'block';
            message.textContent = 'Registration successful!';
            message.style.color = 'green';
            console.log('Registered user:', data);
        } else {
            const error = await response.json();
            message.style.display = 'block';
            message.textContent = error.error || 'Registration failed';
            message.style.color = 'red';
        }
    } catch (err) {
        message.style.display = 'block';
        message.textContent = 'An error occurred';
        message.style.color = 'red';
        console.error('Error:', err);
    }
});