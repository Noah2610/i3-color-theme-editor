import { expectEl, expectEls, validateThemeKey } from "../util";
import { Theme, Colors, Color, BarTheme, WindowTheme } from "../theme";

const BAR_THEME_SINGLE_COLOR_KEYS: readonly Set<keyof BarTheme> = new Set([
    "background",
    "statusline",
    "separator",
]) as const;
const WINDOW_THEME_SINGLE_COLOR_KEYS: readonly Set<keyof WindowTheme> = new Set([
    "background",
]) as const;
const COLOR_POSITIONS: readonly (keyof Colors)[] = [
    "border",
    "background",
    "text",
    "indicator",
    "child_border",
] as const;
const COLOR_BLANK = "#" + ("_").repeat(6);

export function updateEditor(theme: Theme, editorEl?: HTMLElement) {
    editorEl = editorEl || expectEl(".editor");
    const formEl = expectEl(".editor-form", editorEl);

    if (!editorEl.classList.contains("--open")) {
        return;
    }

    const dataEditorTarget = formEl.getAttribute("data-editor-target");
    if (!dataEditorTarget) {
        return;
    }

    const validatedKey = validateThemeKey(theme, dataEditorTarget);
    if (!validatedKey) {
        return;
    }
    const [themePartKey, themeValueKey, themeValue] = validatedKey;

    let targetDataEditor: "color" | "colors";

    switch (typeof themeValue) {
        case "undefined": {
            return;
        }
        case "string": {
            targetDataEditor = "color";
            break;
        }
        case "object": {
            targetDataEditor = "colors";
            break;
        }
    }

    const editorBar = expectEl(".window-bar", editorEl);
    editorBar.innerText = `${themePartKey} ${themeValueKey}`;

    const configPath = [
        themePartKey === "window" ? "client" : `${themePartKey}.colors`,
        themeValueKey,
    ].join(".");
    editorBar.title = configPath;

    const editorInputEls = expectEls(".editor-input", editorEl);
    for (const editorEl of editorInputEls) {
        const dataEditor = editorEl.getAttribute("data-editor");
        if (dataEditor === null) {
            continue;
        }
        if (dataEditor === targetDataEditor) {
            editorEl.classList.remove("--hidden");
        } else {
            editorEl.classList.add("--hidden");
        }
    }

    const inputEls = expectEls<HTMLInputElement>(
        ".editor-input input.input--color",
        editorEl,
    );
    for (const inputEl of inputEls) {
        const dataEditorColor = inputEl.getAttribute("data-editor-color") as keyof Colors;
        switch (dataEditorColor) {
            case "color": {
                if (typeof themeValue === "string") {
                    inputEl.value = themeValue;
                }
                break;
            }
            case "border":
            case "background":
            case "text": {
                if (typeof themeValue !== "string") {
                    inputEl.value = themeValue[dataEditorColor];
                }
                break;
            }
        }

        const inputElDisplay = inputEl.previousElementSibling;
        if (
            inputElDisplay &&
            inputElDisplay.classList.contains("input-color-display")
        ) {
            inputElDisplay.innerHTML = inputEl.value;
        }

        const labelEl = inputEl.labels[0];
        if (labelEl) {
            const colorsLen =
                themePartKey === "bar"
                ? BAR_THEME_SINGLE_COLOR_KEYS.has(themeValueKey)
                    ? 1
                    : 3
                : themePartKey === "window"
                ? WINDOW_THEME_SINGLE_COLOR_KEYS.has(themeValueKey)
                    ? 1
                    : COLOR_POSITIONS.length
                : (() => { throw new Error("Unreachable"); })();
            labelEl.title = getHtmlLabelTitleFor(
                configPath,
                dataEditorColor,
                inputEl.value,
                colorsLen
            );
        }

        // inputEl.setAttribute("data-editor-target", dataEditorTarget);
    }
}

function getHtmlLabelTitleFor(
    configPath: `${keyof Theme}.${keyof keyof Theme}`,
    colorPath: keyof Colors,
    color: Color,
    len = COLOR_POSITIONS.length,
): string {
    const colorPathIdx = COLOR_POSITIONS.indexOf(colorPath);
    return configPath + ": " + len.map((colorPos, i) =>
        i < colorPathIdx || i > colorPathIdx
        ? COLOR_BLANK
        : color
    ).join(" ");
}