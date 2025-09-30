// Enhanced auth system - FIXED
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth script loaded');
    
    // Check existing auth
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    console.log('Current user:', currentUser);
    
    // Auto-redirect logic
    if (currentUser) {
        // Jika sudah login dan berada di login/register page, redirect ke dashboard
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            console.log('Already logged in, redirecting to dashboard');
            window.location.href = 'dashboard.html';
            return;
        }
    } else {
        // Jika belum login dan berada di protected pages, redirect ke login
        if (window.location.pathname.includes('dashboard.html')) {
            console.log('Not logged in, redirecting to login');
            window.location.href = 'login.html';
            return;
        }
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login handler - FIXED
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get all registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            console.log('All users:', users);
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login success
                console.log('Login successful:', user);
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Login failed
                console.log('Login failed - invalid credentials');
                showNotification('Invalid email or password!', 'error');
            }
        });
    }

    // Register handler - FIXED
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Register form submitted');
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            if (users.find(u => u.email === email)) {
                showNotification('Email already registered!', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                username: username,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            currentUser = newUser;
            
            // Initialize user's links
            localStorage.setItem(`userLinks_${newUser.id}`, JSON.stringify([]));
            
            console.log('Registration successful:', newUser);
            showNotification('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
});

// Check authentication - FIXED
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    console.log('checkAuth called, user:', user);
    
    if (!user) {
        // Only redirect if we're on a protected page
        if (window.location.pathname.includes('dashboard.html')) {
            console.log('No user, redirecting to login');
            window.location.href = 'login.html';
        }
        return null;
    }
    return user;
}

// Logout function - FIXED
function logout() {
    console.log('Logout called');
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
