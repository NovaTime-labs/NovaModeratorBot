// ================== НАСТРОЙКИ ==================
const LOGIN_STATE_KEY = "nova_login_state";
const LOGIN_FLAG_KEY = "login";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 час
const ACTIVITY_UPDATE_INTERVAL = 30 * 1000; // обновление активности


// ================== ЧТЕНИЕ/ЗАПИСЬ СОСТОЯНИЯ ==================
function getState() {
    const raw = localStorage.getItem(LOGIN_STATE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveState(state) {
    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(state));
}

function setLoggedIn() {
    const now = Date.now();
    saveState({
        logged: true,
        loginTime: now,
        lastActivity: now
    });
    localStorage.setItem(LOGIN_FLAG_KEY, "true");
}

function setLoggedOut() {
    saveState({
        logged: false,
        loginTime: 0,
        lastActivity: 0
    });
    localStorage.setItem(LOGIN_FLAG_KEY, "false");
}

function isLogged() {
    const st = getState();
    return st && st.logged === true;
}

function checkInactivity() {
    const st = getState();
    if (!st || !st.logged) return false;

    const now = Date.now();

    if (now - st.lastActivity > INACTIVITY_TIMEOUT) {
        setLoggedOut();
        return false;
    }

    return true;
}


// ================== ОБНОВЛЕНИЕ АКТИВНОСТИ ==================
function updateActivity() {
    const st = getState();
    if (!st || !st.logged) return;

    st.lastActivity = Date.now();
    saveState(st);
}

["mousemove", "keydown", "click", "scroll"].forEach(ev => {
    document.addEventListener(ev, updateActivity);
});

setInterval(updateActivity, ACTIVITY_UPDATE_INTERVAL);


// ================== УХОД С САЙТА ==================
window.addEventListener("beforeunload", () => {
    setLoggedOut();
});


// ================== ЗАЩИТА СТРАНИЦ ==================
(function () {
    const isLoginPage = window.location.pathname.includes("login.html");

    if (isLoginPage) {
        if (isLogged()) {
            window.location.replace("index.html");
        }
        return;
    }

    if (!isLogged() || !checkInactivity()) {
        setLoggedOut();
        window.location.replace("login.html");
    }
})();


// ================== ЛОГИКА ФОРМЫ ЛОГИНА ==================
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
});
