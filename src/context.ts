import { setupEditor } from "./editor";
import { applyTheme, getTheme, Theme } from "./theme";
import { setupTime } from "./time";

export interface Context {
    theme: Theme;
}

export function setupContext(): Context {
    const cleanups: (() => void)[] = [];

    cleanups.push(setupTime());

    const theme = getTheme();
    const context: Context = { theme };

    applyTheme(context.theme);

    cleanups.push(setupEditor(context.theme));

    const cleanup = () => cleanups.forEach((cb) => cb());
    window.onunload = cleanup;

    return context;
}
