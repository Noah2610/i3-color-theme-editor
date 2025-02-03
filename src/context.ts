import { setupDraggable } from "./draggable";
import { setupEditor } from "./editor";
import { setupExport } from "./export";
import { setupImport } from "./import";
import { newTheme, Theme, updateTheme } from "./theme";
import { setupTime } from "./time";
import { createUnsubs, expectEl } from "./util";
import { trapFocus, untrapFocus } from "./util/trapFocus";

export type WindowWithContext = Window & {
    APP_CONTEXT?: Context;
};

export const windowWithContext = window as unknown as WindowWithContext;

export interface Context {
    theme: Theme;
}

export function setupContext(): () => void {
    const unsubs = createUnsubs();

    unsubs.add(setupTime());
    unsubs.add(setupDraggable());

    const theme = newTheme();
    const context: Context = { theme };

    windowWithContext.APP_CONTEXT = context;

    unsubs.add(setupExport(context));
    unsubs.add(setupImport(context));
    unsubs.add(setupEditor(context));
    unsubs.add(setupTrapDesktopFocus());

    updateTheme(context.theme);

    return unsubs.unsubAll;
}

export function getContext(): Context {
    if (!windowWithContext.APP_CONTEXT) {
        throw new Error(
            "[getContext] No Context created yet. Run `setupContext` first.",
        );
    }
    return windowWithContext.APP_CONTEXT;
}

function setupTrapDesktopFocus(): () => void {
    const desktopEl = expectEl(".desktop");

    const trapFocusState = trapFocus(desktopEl, { focusFirst: false });
    desktopEl.focus();

    return () => trapFocusState && untrapFocus(trapFocusState);
}
