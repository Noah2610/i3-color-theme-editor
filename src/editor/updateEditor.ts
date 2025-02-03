import { expectEl, expectEls, validateThemeKey } from "../util";
import { Theme, Colors, Color, BarTheme, WindowTheme } from "../theme";

const BAR_THEME_SINGLE_COLOR_KEYS: Set<keyof BarTheme> = new Set([
    "background",
    "statusline",
    "separator",
]);
const WINDOW_THEME_SINGLE_COLOR_KEYS: Set<keyof WindowTheme> = new Set([
    "background",
]);
const COLOR_POSITIONS: readonly (keyof Colors | "color")[] = [
    "border",
    "background",
    "text",
    "indicator",
    "child_border",
] as const;
const COLOR_BLANK = "#" + "_".repeat(6);

export function updateEditor(theme: Theme, editorEl?: HTMLElement) {
    editorEl = editorEl || expectEl(".editor");
    const formEl = expectEl(".editor-form", editorEl);

    // if (!editorEl.classList.contains("--open")) {
    //     return;
    // }

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

    const editorTitle = expectEl(".window-bar > .__title", editorEl);
    editorTitle.innerText = `${themePartKey} ${themeValueKey}`;

    const configPath = [
        themePartKey === "window" ? "client" : `${themePartKey}.colors`,
        themeValueKey,
    ].join(".");
    editorTitle.title = configPath;

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
        const dataEditorColor = inputEl.getAttribute("data-editor-color") as
            | keyof Colors
            | "color";
        switch (dataEditorColor) {
            case "color": {
                if (typeof themeValue === "string") {
                    setInputColorValue(inputEl, themeValue);
                }
                break;
            }
            case "border":
            case "background":
            case "text": {
                if (typeof themeValue !== "string") {
                    setInputColorValue(inputEl, themeValue[dataEditorColor]);
                }
                break;
            }
        }

        const colorsLen =
            themePartKey === "bar"
                ? BAR_THEME_SINGLE_COLOR_KEYS.has(
                      themeValueKey as keyof BarTheme,
                  )
                    ? 1
                    : 3
                : themePartKey === "window"
                  ? WINDOW_THEME_SINGLE_COLOR_KEYS.has(
                        themeValueKey as keyof WindowTheme,
                    )
                      ? 1
                      : COLOR_POSITIONS.length
                  : (() => {
                        throw new Error("Unreachable");
                    })();
        const colorDesc = getHtmlLabelTitleFor(
            configPath,
            dataEditorColor,
            inputEl.value,
            colorsLen,
        );

        const labelEl = inputEl.labels?.[0];
        if (labelEl) {
            labelEl.title = colorDesc;
        }

        // inputEl.setAttribute("data-editor-target", dataEditorTarget);
    }
}

function getHtmlLabelTitleFor(
    configPath: string,
    colorPath: keyof Colors | "color",
    color: Color,
    len = COLOR_POSITIONS.length,
): string {
    const colorPathIdx = COLOR_POSITIONS.indexOf(colorPath);
    return (
        configPath +
        ": " +
        Array.from({ length: len })
            .map((_, i) =>
                i < colorPathIdx || i > colorPathIdx ? COLOR_BLANK : color,
            )
            .join(" ")
    );
}

function setInputColorValue(inputEl: HTMLInputElement, value: string) {
    inputEl.value = value;
    inputEl.dispatchEvent(new Event("input", { bubbles: true })); // trigger coloris color picker update
}
