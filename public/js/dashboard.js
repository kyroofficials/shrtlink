// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (user) {
        document.getElementById('userEmail').textContent = user.email || user.username;
        loadUserLinks();
        loadStats();
    }
});

// Create new shortlink
async function createLink() {
    const originalUrl = document.getElementById('originalUrl').value;
    const customName = document.getElementById('customName').value;
    const resultDiv = document.getElementById('createResult');
    
    if (!originalUrl) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Please enter a URL</p>';
        return;
    }
    
    try {
        const shortCode = customName || Math.random().toString(36).substring(2, 8);
        const shortUrl = `https://shrt.space/${shortCode}`;
        
        // Save to local storage (demo)
        const links = JSON.parse(localStorage.getItem('userLinks') || '[]');
        const newLink = {
            id: Date.now(),
            shortCode: shortCode,
            originalUrl: originalUrl,
            shortUrl: shortUrl,
            clicks: 0,
            createdAt: new Date().toISOString()
        };
        
        links.push(newLink);
        localStorage.setItem('userLinks', JSON.stringify(links));
        
        resultDiv.innerHTML = `
            <p style="color: var(--success)">Shortlink created successfully!</p>
            <p><strong>Short URL:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
        `;
        
        // Clear inputs and reload links
        document.getElementById('originalUrl').value = '';
        document.getElementById('customName').value = '';
        loadUserLinks();
        loadStats();
        
    } catch (error) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Error creating shortlink</p>';
    }
}

// Load user's links
function loadUserLinks() {
    const links = JSON.parse(localStorage.getItem('userLinks') || '[]');
    const linksList = document.getElementById('linksList');
    
    if (links.length === 0) {
        linksList.innerHTML = '<p>No links created yet. Create your first shortlink above!</p>';
        return;
    }
    
    linksList.innerHTML = links.map(link => `
        <div class="link-item">
            <div class="link-info">
                <div class="link-short">
                    <a href="${link.shortUrl}" target="_blank">${link.shortUrl}</a>
                </div>
                <div class="link-original">${link.originalUrl}</div>
                <div class="link-stats">Clicks: ${link.clicks} | Created: ${new Date(link.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="link-actions">
                <button onclick="copyLink('${link.shortUrl}')" class="btn-outline">Copy</button>
                <button onclick="deleteLink(${link.id})" class="btn-outline" style="color: var(--error)">Delete</button>
            </div>
        </div>
    `).join('');
}

// Load statistics
function loadStats() {
    const links = JSON.parse(localStorage.getItem('userLinks') || '[]');
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    
    document.getElementById('totalClicks').textContent = totalClicks;
    document.getElementById('totalLinks').textContent = links.length;
}

// Copy link to clipboard
function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    });
}

// Delete link
function deleteLink(linkId) {
    if (confirm('Are you sure you want to delete this link?')) {
        const links = JSON.parse(localStorage.getItem('userLinks') || '[]');
        const updatedLinks = links.filter(link => link.id !== linkId);
        localStorage.setItem('userLinks', JSON.stringify(updatedLinks));
        loadUserLinks();
        loadStats();
    }
}
