// Protected index page functionality - FIXED
document.addEventListener('DOMContentLoaded', function() {
    // Update button text to "Get Started"
    const shortenBtn = document.querySelector('.shorten-btn');
    if (shortenBtn) {
        shortenBtn.querySelector('span').textContent = 'Get Started';
        
        shortenBtn.onclick = function() {
            showNotification('Please login or register to create shortlinks!', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        };
    }
});

// Biarin function ini buat jaga-jaga
async function createShortlink() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
        showNotification('Please login to create shortlinks!', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    const longUrl = document.getElementById('longUrl')?.value;
    const resultDiv = document.getElementById('result');
    
    if (!longUrl) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Please enter a URL</p>';
        return;
    }
    
    try {
        const shortCode = Math.random().toString(36).substring(2, 8);
        const shortUrl = `${window.location.origin}/redirect.html?url=${encodeURIComponent(longUrl)}&code=${shortCode}`;
        
        resultDiv.innerHTML = `
            <p style="color: var(--success)">✅ Shortlink created successfully!</p>
            <p><strong>Short URL:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
            <button onclick="copyLink('${shortUrl}')" class="btn-outline">Copy Link</button>
        `;
        
        document.getElementById('longUrl').value = '';
        
    } catch (error) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Error creating shortlink</p>';
    }
}

// Notification system (dipindah ke sini biar bisa dipake di index.html)
function showNotification(message, type = 'info') {
    console.log('Notification:', message, type);
    
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

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    });
}
