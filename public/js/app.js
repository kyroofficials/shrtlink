// Protected index page functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const shortenBtn = document.querySelector('.shorten-btn');
    
    if (shortenBtn) {
        shortenBtn.onclick = function() {
            if (!user) {
                showNotification('Please login or register to create shortlinks!', 'error');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }
            createShortlink();
        };
    }
});

async function createShortlink() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;
    
    const longUrl = document.getElementById('longUrl').value;
    const resultDiv = document.getElementById('result');
    
    if (!longUrl) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Please enter a URL</p>';
        return;
    }
    
    try {
        const shortCode = Math.random().toString(36).substring(2, 8);
        const shortUrl = `${window.location.origin}/redirect.html?url=${encodeURIComponent(longUrl)}&code=${shortCode}`;
        
        // Save to user's links
        const userLinks = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
        userLinks.push({
            id: Date.now(),
            shortCode: shortCode,
            originalUrl: longUrl,
            shortUrl: shortUrl,
            clicks: 0,
            createdAt: new Date().toISOString(),
            userId: user.id
        });
        localStorage.setItem(`userLinks_${user.id}`, JSON.stringify(userLinks));
        
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
