import { setupEditor } from "./editor";
import { applyTheme, newTheme, Theme } from "./theme";
import { setupTime } from "./time";
import { createUnsubs } from "./util";

export type WindowWithContext = Window & {
    APP_CONTEXT?: Context;
};

export const windowWithContext = window as unknown as WindowWithContext;

export interface Context {
    theme: Theme;
}

export function setupContext(): Context {
    const unsubs = createUnsubs();

    unsubs.add(setupTime());

    const theme = newTheme();
    const context: Context = { theme };

    applyTheme(context.theme);

    unsubs.add(setupEditor(context));

    window.onunload = unsubs.unsubAll;

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
