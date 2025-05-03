const registerForm = document.getElementById('register-form');
const message = document.getElementById('message');

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
            message.textContent = 'User registered successfully!';
            message.style.color = 'green';
            console.log('Registered user:', data);
        } else {
            const error = await response.json();
            message.textContent = error.error || 'Failed to register user';
            message.style.color = 'red';
        }
    } catch (err) {
        message.textContent = 'An error occurred';
        message.style.color = 'red';
        console.error('Error:', err);
    }
});

