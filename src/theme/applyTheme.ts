import { Colors, Theme } from "./types";
import { expectEl, safeObjectKeys } from "../util";

export function applyTheme(theme: Theme) {
    const el = expectEl(".theme");

    applyBarTheme(el, theme);
    applyWindowTheme(el, theme);
}

function applyBarTheme(el: HTMLElement, theme: Theme) {
    applyThemeObj(el, theme.bar, "theme-bar");
}

function applyWindowTheme(el: HTMLElement, theme: Theme) {
    applyThemeObj(el, theme.window, "theme-window");
}

function applyThemeObj<T extends Theme["bar"] | Theme["window"]>(
    el: HTMLElement,
    theme: T,
    prefix: string,
) {
    const setCssVariable = createSetCssVariable(el, prefix);

    for (const key of Object.keys(theme)) {
        // TODO
        const value = (theme as any)[key];
        if (typeof value === "string") {
            setCssVariable(key, value);
        } else if (typeof value === "object") {
            applyColors(el, `${prefix}-${key}`, value);
        }
    }
}

function createSetCssVariable(el: HTMLElement, prefix = "theme") {
    return (variable: string, value: string) =>
        el.style.setProperty(`--${prefix}-${variable}`, value);
}

function applyColors(el: HTMLElement, prefix: string, colors: Colors) {
    const setCssVariable = createSetCssVariable(el, prefix);

    for (const colorKey of safeObjectKeys(colors)) {
        const color = colors[colorKey];
        if (color !== undefined) {
            setCssVariable(colorKey, color);
        }
    }
}
