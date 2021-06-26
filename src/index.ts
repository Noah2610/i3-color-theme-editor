import { applyTheme, getTheme } from "./theme";
import { setupTime } from "./time";

function main() {
    const cleanup = setupTime();
    window.onunload = cleanup;

    const theme = getTheme();
    applyTheme(theme);

    console.log(theme);
}

window.onload = main;
