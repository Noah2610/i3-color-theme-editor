import { Theme } from "./theme";

export function applyTheme(theme: Theme) {
    const el = document.querySelector<HTMLElement>(".desktop");

    if (!el) {
        throw new Error("[applyTheme error] Can't find .desktop element");
    }

    applyThemeBar(el, theme.bar);
    applyThemeWindow(el, theme.window);
}

function applyThemeBar(el: HTMLElement, theme: Theme["bar"]) {
    const setCssVariable = (variable: string, value: string) =>
        el.style.setProperty(`--theme-${variable}`, value);

    for (const key of [
        "background",
        "statusline",
        "separator",
    ] as (keyof typeof theme)[]) {
        const value = theme[key];
        if (typeof value === "string") {
            setCssVariable(key, value);
        }
    }

    theme.focused_background;
    theme.focused_statusline;
    theme.focused_separator;
    theme.focused_workspace;
    theme.active_workspace;
    theme.inactive_workspace;
    theme.urgent_workspace;
    theme.binding_mode;
}

function applyThemeWindow(el: HTMLElement, theme: Theme["window"]) {}
