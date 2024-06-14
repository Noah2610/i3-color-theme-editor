import { expectEl, expectEls, validateThemeKey } from "../util";
import { Theme } from "../theme";

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
        themePartKey === "window" ? "client" : themePartKey,
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
        const dataEditorColor = inputEl.getAttribute("data-editor-color");
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

        // inputEl.setAttribute("data-editor-target", dataEditorTarget);
    }
}
