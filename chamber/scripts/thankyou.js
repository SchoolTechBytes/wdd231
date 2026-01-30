(() => {
    const params = new URLSearchParams(window.location.search);

    const setText = (id, value) => {
        const el = document.querySelector(id);
        if (el) {
            el.textContent = value || "-";
        }
    };

    setText("#summary-first", params.get("firstName"));
    setText("#summary-last", params.get("lastName"));
    setText("#summary-email", params.get("email"));
    setText("#summary-mobile", params.get("mobile"));
    setText("#summary-org", params.get("organization"));
    setText("#summary-time", params.get("timestamp"));
})();
