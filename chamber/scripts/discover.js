import { discoverItems } from "../data/discover.mjs";

const grid = document.querySelector("#discover-grid");
const message = document.querySelector("#visit-message");

const renderCards = () => {
    if (!grid) {
        return;
    }

    grid.innerHTML = "";
    discoverItems.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = `discover-card card-${index + 1}`;
        card.innerHTML = `
            <h2>${item.title}</h2>
            <figure>
                <img src="${item.image}" alt="${item.alt}" loading="lazy" width="300" height="200">
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button type="button">Learn More</button>
        `;
        grid.appendChild(card);
    });
};

const updateVisitMessage = () => {
    if (!message) {
        return;
    }

    const key = "chamberLastVisit";
    const now = Date.now();
    const lastVisit = Number(localStorage.getItem(key));

    if (!lastVisit) {
        message.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const diffDays = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        if (diffDays < 1) {
            message.textContent = "Back so soon! Awesome!";
        } else {
            const label = diffDays === 1 ? "day" : "days";
            message.textContent = `You last visited ${diffDays} ${label} ago.`;
        }
    }

    localStorage.setItem(key, now);
};

renderCards();
updateVisitMessage();
