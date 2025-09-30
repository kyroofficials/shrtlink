// Enhanced auth system
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check existing auth
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Auto-redirect if already logged in
    if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Redirect to login if not authenticated (except index page)
    if (!currentUser && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get all registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login success
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showNotification('Login successful!', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            } else {
                // Login failed
                showNotification('Invalid email or password!', 'error');
            }
        });
    }

    // Register handler
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
                password: password, // In real app, hash this!
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Initialize user's links
            localStorage.setItem(`userLinks_${newUser.id}`, JSON.stringify([]));
            
            showNotification('Registration successful!', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        });
    }
});

// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user && !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
