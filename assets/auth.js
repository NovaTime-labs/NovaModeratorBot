// === Настройки авторизации ===
const LOGIN_STATE_KEY = "nova_login_state";  // JSON с флагом и временем
const LOGIN_FLAG_KEY = "login";              // просто "true"/"false" как ты просил
const LOGIN_TTL_MS = 2 * 60 * 60 * 1000;     // сколько живёт логин (2 часа, можно поменять)

// Прочитать состояние логина из localStorage
function getLoginState() {
    const raw = localStorage.getItem(LOGIN_STATE_KEY);
    if (!raw) {
        return { logged: false };
    }
    try {
        const data = JSON.parse(raw);
        if (!data.logged) {
            return { logged: false };
        }

        // Срок действия истёк?
        if (!data.ts || (Date.now() - data.ts) > LOGIN_TTL_MS) {
            setLoggedOut();
            return { logged: false };
        }
        return data;
    } catch (e) {
        console.warn("Ошибка чтения состояния логина:", e);
        return { logged: false };
    }
}

function isLoggedIn() {
    return getLoginState().logged === true;
}

function setLoggedIn() {
    const data = { logged: true, ts: Date.now() };
    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(data));
    localStorage.setItem(LOGIN_FLAG_KEY, "true");  // для тебя: login = "true"
}

function setLoggedOut() {
    const data = { logged: false, ts: Date.now() };
    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(data));
    localStorage.setItem(LOGIN_FLAG_KEY, "false"); // login = "false"
}

// === Мгновенная проверка при загрузке файла auth.js ===
(function () {
    const path = window.location.pathname;
    const isLoginPage = path.includes("login.html");

    if (isLoginPage) {
        // Если уже залогинен и мы на login.html -> сразу на индекс
        if (isLoggedIn()) {
            window.location.replace("index.html");
        }
    } else {
        // Любая другая страница должна быть защищена
        if (!isLoggedIn()) {
            window.location.replace("login.html");
        }
    }
})();

// === Логика формы логина и (на будущее) выхода ===
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (form) {
        const userInput = document.getElementById("login-username");
        const passInput = document.getElementById("login-password");
        const errorBox = document.getElementById("login-error");

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = userInput.value.trim();
            const password = passInput.value.trim();

            if (username === "NovaTime" && password === "7530") {
                setLoggedIn();
                window.location.replace("index.html");
            } else {
                errorBox.textContent = "Неверный логин или пароль";
                errorBox.style.opacity = "1";
            }
        });
    }

    // На будущее — если сделаем кнопку выхода с id="logout-btn"
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            setLoggedOut();
            window.location.replace("login.html");
        });
    }
});
