const CONTAINER_BUTTON = document.getElementById("button");
const LIGHT_BUTTON = document.getElementById("jedi");
const DARK_BUTTON = document.getElementById("sith");
const DARK = 'dark';
const LIGHT = 'light';

function updateHtmlClass(mode, setFromSession = false) {
    let newMode = mode;
    if (!setFromSession) {
        sessionStorage.setItem("colorscheme", mode);
    }
    else {
        newMode = sessionStorage.getItem("colorscheme") ?? mode;
    }
    HTML.classList = newMode;
    CONTAINER_BUTTON.title = newMode == DARK ? LIGHT : DARK;
}

LIGHT_BUTTON.addEventListener("click", (e) => {
    if (HTML.classList != LIGHT) updateHtmlClass(LIGHT);
});

DARK_BUTTON.addEventListener("click", (e) => {
    if (HTML.classList != DARK) updateHtmlClass(DARK);
});

updateHtmlClass(DARK, true);