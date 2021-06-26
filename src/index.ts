import { applyTheme, getTheme } from "./theme";
import { setupEditor } from "./editor";
import { setupTime } from "./time";

function main() {
    const cleanups: (() => void)[] = [];

    cleanups.push(setupTime());

    const context = {
        theme: getTheme(),
    };
    applyTheme(context.theme);

    cleanups.push(setupEditor(context.theme));

    {
        const cleanup = () => cleanups.forEach((cb) => cb());
        window.onunload = cleanup;
    }
}

window.onload = main;
