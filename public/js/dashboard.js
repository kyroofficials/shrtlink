// Enhanced dashboard with persistence
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (user) {
        // Update user info
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userName').textContent = user.username;
        loadUserLinks();
        loadStats();
    }
});

async function createLink() {
    const user = checkAuth();
    if (!user) return;
    
    const originalUrl = document.getElementById('originalUrl').value;
    const customName = document.getElementById('customName').value;
    const resultDiv = document.getElementById('createResult');
    
    if (!originalUrl) {
        showNotification('Please enter a URL!', 'error');
        return;
    }
    
    // Validate URL
    try {
        new URL(originalUrl);
    } catch {
        showNotification('Please enter a valid URL!', 'error');
        return;
    }
    
    // Validate custom name
    if (customName) {
        if (!/^[a-zA-Z0-9_-]+$/.test(customName)) {
            showNotification('Custom name can only contain letters, numbers, hyphens, and underscores!', 'error');
            return;
        }
        
        if (customName.length < 3 || customName.length > 30) {
            showNotification('Custom name must be between 3-30 characters!', 'error');
            return;
        }
        
        // Check for inappropriate words (basic filter)
        const inappropriateWords = ['fuck', 'shit', 'asshole', 'dick', 'pussy', 'bastard', 'bitch', 'cunt'];
        if (inappropriateWords.some(word => customName.toLowerCase().includes(word))) {
            showNotification('Custom name contains inappropriate content!', 'error');
            return;
        }
        
        // Check if custom name already exists
        const links = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
        if (links.find(link => link.shortCode === customName)) {
            showNotification('Custom name already taken!', 'error');
            return;
        }
    }
    
    try {
        const shortCode = customName || Math.random().toString(36).substring(2, 8);
        const shortUrl = `${window.location.origin}/redirect.html?url=${encodeURIComponent(originalUrl)}&code=${shortCode}`;
        
        // Save to user-specific storage
        const links = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
        const newLink = {
            id: Date.now(),
            shortCode: shortCode,
            originalUrl: originalUrl,
            shortUrl: shortUrl,
            clicks: 0,
            createdAt: new Date().toISOString(),
            userId: user.id
        };
        
        links.push(newLink);
        localStorage.setItem(`userLinks_${user.id}`, JSON.stringify(links));
        
        showNotification('Shortlink created successfully!', 'success');
        
        // Clear inputs & reload
        document.getElementById('originalUrl').value = '';
        document.getElementById('customName').value = '';
        loadUserLinks();
        loadStats();
        
    } catch (error) {
        showNotification('Error creating shortlink!', 'error');
    }
}

function loadUserLinks() {
    const user = checkAuth();
    if (!user) return;
    
    const links = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
    const linksList = document.getElementById('linksList');
    
    if (links.length === 0) {
        linksList.innerHTML = '<div class="empty-state">No links created yet. Create your first shortlink above! 🚀</div>';
        return;
    }
    
    linksList.innerHTML = links.map(link => `
        <div class="link-item">
            <div class="link-info">
                <div class="link-short">
                    <a href="${link.shortUrl}" target="_blank">${window.location.origin}/r/${link.shortCode}</a>
                    <span class="click-count">${link.clicks} clicks</span>
                </div>
                <div class="link-original">${link.originalUrl}</div>
                <div class="link-date">Created: ${new Date(link.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="link-actions">
                <button onclick="copyLink('${link.shortUrl}')" class="btn-outline">Copy</button>
                <button onclick="simulateClick(${link.id})" class="btn-outline">Test Click</button>
                <button onclick="deleteLink(${link.id})" class="btn-outline" style="color: var(--error)">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadStats() {
    const user = checkAuth();
    if (!user) return;
    
    const links = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    
    document.getElementById('totalClicks').textContent = totalClicks;
    document.getElementById('totalLinks').textContent = links.length;
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    });
}

function simulateClick(linkId) {
    const user = checkAuth();
    if (!user) return;
    
    const links = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
    const linkIndex = links.findIndex(link => link.id === linkId);
    
    if (linkIndex !== -1) {
        links[linkIndex].clicks++;
        localStorage.setItem(`userLinks_${user.id}`, JSON.stringify(links));
        loadUserLinks();
        loadStats();
        showNotification('+1 click added!', 'info');
    }
}

function deleteLink(linkId) {
    if (confirm('Are you sure you want to delete this link?')) {
        const user = checkAuth();
        if (!user) return;
        
        const links = JSON.parse(localStorage.getItem(`userLinks_${user.id}`) || '[]');
        const updatedLinks = links.filter(link => link.id !== linkId);
        localStorage.setItem(`userLinks_${user.id}`, JSON.stringify(updatedLinks));
        loadUserLinks();
        loadStats();
        showNotification('Link deleted!', 'success');
    }
}
