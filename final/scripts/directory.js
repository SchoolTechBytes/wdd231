document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('directory-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');

    // Modal Elements
    const modal = document.getElementById('modal-overlay');
    const modalClose = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    let shopData = [];
    let crewData = [];
    let currentType = 'shops'; // default

    // Initialize
    fetchData();

    // Event Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update State
            currentType = btn.dataset.type;
            renderGrid(currentType);
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            renderGrid(currentType);
        });
    }

    // Modal Events
    if (modalClose) modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    async function fetchData() {
        try {
            const [shopsRes, crewRes] = await Promise.all([
                fetch('data/shops.json'),
                fetch('data/crew.json')
            ]);

            if (!shopsRes.ok || !crewRes.ok) throw new Error('Network response was not ok');

            shopData = await shopsRes.json();
            crewData = await crewRes.json();

            renderGrid('shops');
        } catch (error) {
            console.error('Error loading data:', error);
            grid.innerHTML = '<p>Error loading directory data. Please try again later.</p>';
        }
    }

    function renderGrid(type) {
        grid.innerHTML = '';
        let data = (type === 'shops') ? [...shopData] : [...crewData];

        // Sorting
        const sortValue = sortSelect ? sortSelect.value : 'default';
        if (sortValue === 'name') {
            data.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'rating') {
            // Check if property exists (crew has rate, shop has rating, let's normalize or sort differently)
            // Shop has 'rating', Crew has 'rate' (price) or maybe we shouldn't sort crew by rating if they don't have it.
            // Let's assume for this exercise we map 'rate' to 'rating' logic or check field.
            data.sort((a, b) => {
                const valA = a.rating || a.rate || 0;
                const valB = b.rating || b.rate || 0;
                return valB - valA; // Descending
            });
        }

        if (data.length === 0) {
            grid.innerHTML = '<p>No items found.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            // Cursor pointer is now in CSS

            // Build card content based on type
            let subtext = '';
            if (type === 'shops') {
                subtext = `
                    <p><strong>Deck:</strong> ${item.deck}</p>
                    <p><strong>Rating:</strong> ${item.rating}/5</p>
                `;
            } else {
                subtext = `
                    <p><strong>Role:</strong> ${item.role}</p>
                    <p><strong>Rate:</strong> ${item.rate} cr/day</p>
                `;
            }

            card.innerHTML = `
                <h3>${item.name}</h3>
                <p class="card-subtitle">${item.category || item.species}</p>
                ${subtext}
                <button class="btn btn-sm">View Details</button>
            `;

            // Accessibility: allow keyboard focus
            card.tabIndex = 0;
            card.addEventListener('click', () => openModal(item, type));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') openModal(item, type);
            });

            grid.appendChild(card);
        });
    }

    function openModal(item, type) {
        modalTitle.textContent = item.name;

        let detailsHtml = '';
        if (type === 'shops') {
            detailsHtml = `
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Location:</strong> ${item.deck} (${item.location_code})</p>
                <p><strong>Hours:</strong> ${item.hours}</p>
                <p><strong>Rating:</strong> ${item.rating} Stars</p>
                <hr class="modal-hr">
                <p><em>${item.description}</em></p>
                <p><strong>Specialties:</strong> ${item.specialties.join(', ')}</p>
                <p><strong>Comms:</strong> ${item.contact}</p>
            `;
        } else {
            detailsHtml = `
                <p><strong>Role:</strong> ${item.role}</p>
                <p><strong>Species:</strong> ${item.species}</p>
                <p><strong>Rate:</strong> ${item.rate} Credits/Day</p>
                <p><strong>Status:</strong> <span class="${item.available ? 'text-success' : 'text-danger'}">${item.available ? 'AVAILABLE' : 'BUSY'}</span></p>
                <hr class="modal-hr">
                <p><em>${item.bio}</em></p>
                <p><strong>Skills:</strong> ${item.skills.join(', ')}</p>
                <p><strong>Exp:</strong> ${item.experience}</p>
            `;
        }

        modalBody.innerHTML = detailsHtml;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');

        // Trap focus or just focus close button
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }
});
