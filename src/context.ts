import { setupEditor } from "./editor";
import { applyTheme, newTheme, Theme } from "./theme";
import { setupTime } from "./time";

export type WindowWithContext = Window & {
    APP_CONTEXT?: Context;
};

export const windowWithContext = window as unknown as WindowWithContext;

export interface Context {
    theme: Theme;
}

export function setupContext(): Context {
    const cleanups: (() => void)[] = [];

    cleanups.push(setupTime());

    const theme = newTheme();
    const context: Context = { theme };

    applyTheme(context.theme);

    cleanups.push(setupEditor(context));

    const cleanup = () => cleanups.forEach((cb) => cb());
    window.onunload = cleanup;

    windowWithContext.APP_CONTEXT = context;

    return context;
}

export function getContext(): Context {
    if (!windowWithContext.APP_CONTEXT) {
        throw new Error(
            "[getContext] No Context created yet. Run `setupContext` first.",
        );
    }
    return windowWithContext.APP_CONTEXT;
}
