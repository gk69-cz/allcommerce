document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form'); // Ensure the selector is specific to the login form
    if (loginForm) {
        document.querySelector('.user-account-form').addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Email:', email);
            console.log('Password:', password);

            try {
                const response = await fetch('http://127.0.0.1:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Login successful');
                    console.log('Login Response:', result.message);
                    alert(result.message || 'Login failed');
                    sessionStorage.setItem('userData', JSON.stringify(result));
                    const userData = JSON.parse(sessionStorage.getItem('userData'));

                    // Check if userData exists and access the role
                    if (userData && userData.user && userData.user.role) {
                        const role = userData.user.role;
                        if (role == 'admin') {
                            window.location.href = './admin/dashboard/pages/users.html';
                        } else {
                            window.location.href = './user/home.html';
                        }
                        console.log("Role:", role); // Output the role, e.g., 'admin'
                    } else {

                    }


                } else {
                    alert(result.error || 'Login failed');
                    console.log('Login Error:', result.error);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            }
        });

    }

    const signupForm = document.querySelector('.signup-form'); // Ensure the selector is specific to the signup form
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone_number = document.getElementById('phone_number').value;
            const password = document.getElementById('password').value;
            const confirm_password = document.getElementById('confirm_password').value;
            const role = document.getElementById('role').value;

            if (password !== confirm_password) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone_number, password, role }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Signup successful');
                    window.location.href = 'login.html';
                    console.log(result);
                } else {
                    alert(result.error || 'Signup failed');
                }
            } catch (error) {
                console.error('Error during signup:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});
