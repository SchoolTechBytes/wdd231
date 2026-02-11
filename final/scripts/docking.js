document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('docking-form');
    const recentList = document.getElementById('recent-dockings');

    // Load recent dockings on page load
    loadRecentDockings();

    if (form) {
        form.addEventListener('submit', (e) => {
            // Prevent default to handle storage first, then we'll redirect manually or let it bubble?
            // Actually, we can just save and let it submit if it's a GET request.
            // But to be safe and ensure execution, let's intercept.
            e.preventDefault();

            const formData = new FormData(form);
            const entry = {
                id: Date.now(),
                captain: formData.get('captain'),
                ship: formData.get('ship'),
                class: formData.get('class'),
                arrival: formData.get('arrival'),
                timestamp: new Date().toLocaleString()
            };

            saveDocking(entry);

            // Construct query string for confirm page
            const params = new URLSearchParams(formData).toString();
            window.location.href = `confirm.html?${params}`;
        });
    }

    function saveDocking(entry) {
        let dockings = JSON.parse(localStorage.getItem('drackaData') || '[]');
        // Add to beginning
        dockings.unshift(entry);
        // Keep only last 5
        if (dockings.length > 5) {
            dockings.pop();
        }
        localStorage.setItem('drackaData', JSON.stringify(dockings));
    }

    function loadRecentDockings() {
        if (!recentList) return;

        const dockings = JSON.parse(localStorage.getItem('drackaData') || '[]');

        if (dockings.length === 0) {
            recentList.innerHTML = '<p>No recent docking requests found on this terminal.</p>';
            return;
        }

        let html = '<ul class="list-unstyled">';
        dockings.forEach(d => {
            html += `
                <li class="recent-docking-item">
                    <strong>${d.ship}</strong> (Capt. ${d.captain}) - Arriving: ${d.arrival}
                </li>
            `;
        });
        html += '</ul>';
        recentList.innerHTML = html;
    }
});
