import { Colors, Theme } from "./types";
import { expectEl, RecursivePartial, safeObjectKeys } from "../util";

export function applyTheme(theme: RecursivePartial<Theme>) {
    const el = expectEl(".theme");

    applyBarTheme(el, theme);
    applyWindowTheme(el, theme);
}

function applyBarTheme(el: HTMLElement, theme: RecursivePartial<Theme>) {
    if (theme.bar) {
        applyThemeObj(el, theme.bar, "theme-bar");
    }
}

function applyWindowTheme(el: HTMLElement, theme: RecursivePartial<Theme>) {
    if (theme.window) {
        applyThemeObj(el, theme.window, "theme-window");
    }
}

function applyThemeObj(
    el: HTMLElement,
    theme: RecursivePartial<Theme["bar"] | Theme["window"]>,
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

function applyColors(
    el: HTMLElement,
    prefix: string,
    colors: RecursivePartial<Colors>,
) {
    const setCssVariable = createSetCssVariable(el, prefix);

    for (const colorKey of safeObjectKeys(colors)) {
        const color = colors[colorKey];
        if (color !== undefined) {
            setCssVariable(colorKey, color);
        }
    }
}
