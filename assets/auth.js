// ================== НАСТРОЙКИ ==================
const LOGIN_STATE_KEY = "nova_login_state";
const LOGIN_FLAG_KEY = "login";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 час без действия
const ACTIVITY_UPDATE_INTERVAL = 30 * 1000; // обновление активности
// ================================================


// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
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

// ============ УСТАНОВКА / СБРОС ВХОДА ============
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


// =================== ПРОВЕРКА ЛОГИНА ===================
function isLogged() {
    const st = getState();
    return st && st.logged === true;
}

function checkTimeout() {
    const st = getState();
    if (!st || !st.logged) return false;

    const now = Date.now();

    // 1) Проверка бездействия
    if (now - st.lastActivity > INACTIVITY_TIMEOUT) {
        setLoggedOut();
        return false;
    }

    return true;
}


// =========== АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЯ ===========
function updateActivity() {
    const st = getState();
    if (!st || !st.logged) return;

    st.lastActivity = Date.now();
    saveState(st);
}

["mousemove", "keydown", "click", "scroll"].forEach(ev => {
    document.addEventListener(ev, updateActivity);
});

// обновление раз в 30 сек
setInterval(updateActivity, ACTIVITY_UPDATE_INTERVAL);


// =========== ОТСЛЕЖИВАНИЕ УХОДА С САЙТА ===========
window.addEventListener("beforeunload", () => {
    // Человек УШЁЛ с сайта — сбрасываем логин
    setLoggedOut();
});


// =========== ЗАЩИТА ВСЕХ СТРАНИЦ ===========
(function () {
    const isLoginPage = window.location.pathname.includes("login.html");

    if (isLoginPage) {
        // Если уже вошёл — сразу на индекс
        if (isLogged()) {
            window.location.replace("index.html");
        }
        return;
    }

    // Любая другая страница: если нет логина — кидаем на login
    if (!isLogged() || !checkTimeout()) {
        setLoggedOut();
        window.location.replace("login.html");
    }
})();
