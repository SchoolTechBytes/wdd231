(() => {
    const timestampField = document.querySelector("#timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const openButtons = document.querySelectorAll("[data-modal]");
    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.dataset.modal;
            const modal = document.querySelector(`#${modalId}`);
            if (modal && typeof modal.showModal === "function") {
                modal.showModal();
            }
        });
    });

    const closeButtons = document.querySelectorAll(".modal-close");
    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest("dialog");
            modal?.close();
        });
    });

    document.querySelectorAll("dialog").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    });
})();
