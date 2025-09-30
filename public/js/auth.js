// Authentication functions
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                // Demo login - always success
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    username: email.split('@')[0]
                }));
                
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert('Login failed. Please try again.');
            }
        });
    }

    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                // Demo registration - always success
                localStorage.setItem('user', JSON.stringify({
                    username: username,
                    email: email
                }));
                
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert('Registration failed. Please try again.');
            }
        });
    }
});

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(user);
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
