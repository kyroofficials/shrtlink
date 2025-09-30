// Main application logic
async function createShortlink() {
    const longUrl = document.getElementById('longUrl').value;
    const resultDiv = document.getElementById('result');
    
    if (!longUrl) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Please enter a URL</p>';
        return;
    }
    
    try {
        // For now, just show a demo result
        const shortCode = Math.random().toString(36).substring(2, 8);
        const shortUrl = `https://shrt.space/${shortCode}`;
        
        resultDiv.innerHTML = `
            <p>Shortlink created successfully!</p>
            <p><strong>Short URL:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
            <p><small>Copy this link to share with others</small></p>
        `;
        
        // Clear input
        document.getElementById('longUrl').value = '';
        
    } catch (error) {
        resultDiv.innerHTML = '<p style="color: var(--error)">Error creating shortlink. Please try again.</p>';
    }
}

// Enter key support
document.getElementById('longUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        createShortlink();
    }
});
