// =============== LOCAL STORAGE ===============
function saveSettings() {
    let settings = {
        automod_enabled: document.querySelector("#automod-enabled")?.checked || false,
        banned_words: document.querySelector("#banned-words")?.value || "",
        rules: {}
    };

    document.querySelectorAll(".rule-checkbox").forEach(cb => {
        settings.rules[cb.dataset.rule] = cb.checked;
    });

    localStorage.setItem("nova_automod", JSON.stringify(settings));

    let st = document.querySelector("#save-status");
    if (st) {
        st.textContent = "Сохранено ✓";
        setTimeout(() => st.textContent = "", 2000);
    }
}

function loadSettings() {
    let raw = localStorage.getItem("nova_automod");
    if (!raw) return;
    let settings = JSON.parse(raw);

    if (document.querySelector("#automod-enabled"))
        document.querySelector("#automod-enabled").checked = settings.automod_enabled;

    if (document.querySelector("#banned-words"))
        document.querySelector("#banned-words").value = settings.banned_words;

    document.querySelectorAll(".rule-checkbox").forEach(cb => {
        let id = cb.dataset.rule;
        if (settings.rules[id] !== undefined) {
            cb.checked = settings.rules[id];
        }
    });
}

// =============== ACCORDION ===============
document.addEventListener("click", evt => {
    const header = evt.target.closest(".rule-header");
    if (!header) return;

    const block = header.closest(".rule-item");
    block.classList.toggle("active");
});

// =============== SAVE BUTTON ===============
document.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    const saveBtn = document.querySelector("#save-automod");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveSettings);
    }
});
