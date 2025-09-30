// Redirect page functionality
document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.getElementById('countdown');
    const progressFill = document.getElementById('progressFill');
    const skipButton = document.getElementById('skipAd');
    
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        progressFill.style.width = `${((5 - countdown) / 5) * 100}%`;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            redirectToDestination();
        }
    }, 1000);
    
    // Skip ad button
    skipButton.addEventListener('click', function(e) {
        e.preventDefault();
        clearInterval(countdownInterval);
        redirectToDestination();
    });
    
    // Simulate ad content loading
    setTimeout(() => {
        document.getElementById('adContent').innerHTML = `
            <h4>Special Offer!</h4>
            <p>Get premium features for your shortlinks</p>
            <button class="btn-primary" style="margin-top: 1rem;">Learn More</button>
        `;
    }, 1000);
});

function redirectToDestination() {
    // Get destination from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('url') || 'https://example.com';
    
    window.location.href = destination;
}
