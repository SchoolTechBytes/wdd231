const navToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isOpen);
    });
}

const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

const membershipLabels = {
    1: "Member",
    2: "Silver",
    3: "Gold"
};

const showGrid = () => {
    if (!membersContainer) {
        return;
    }
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
    gridButton?.classList.add("is-active");
    listButton?.classList.remove("is-active");
};

const showList = () => {
    if (!membersContainer) {
        return;
    }
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
    listButton?.classList.add("is-active");
    gridButton?.classList.remove("is-active");
};

const renderMembers = (members) => {
    if (!membersContainer) {
        return;
    }

    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");
        card.className = "member-card";

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.loading = "lazy";

        const name = document.createElement("h2");
        name.textContent = member.name;

        const address = document.createElement("p");
        address.textContent = member.address;

        const phone = document.createElement("p");
        phone.textContent = member.phone;

        const info = document.createElement("p");
        info.textContent = member.description;

        const level = document.createElement("span");
        level.className = "tag";
        level.textContent = membershipLabels[member.membershipLevel] || "Member";

        const link = document.createElement("a");
        link.href = member.website;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Visit Website";

        card.append(image, name, address, phone, info, level, link);
        membersContainer.appendChild(card);
    });
};

const loadMembers = async () => {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw new Error("Member data unavailable.");
        }
        const data = await response.json();
        renderMembers(data);
    } catch (error) {
        if (membersContainer) {
            membersContainer.textContent =
                "Member directory is currently unavailable.";
        }
    }
};

gridButton?.addEventListener("click", showGrid);
listButton?.addEventListener("click", showList);

showGrid();
loadMembers();

const yearSpan = document.querySelector("#copyright-year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const modifiedSpan = document.querySelector("#last-modified");
if (modifiedSpan) {
    modifiedSpan.textContent = document.lastModified;
}
