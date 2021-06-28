import { expectEl, expectEls, validateThemeKey } from "../util";
import { Theme } from "../theme";

export function updateEditor(theme: Theme) {
    const editorEl = expectEl(".editor");
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
    const [_themePartKey, _themeValueKey, themeValue] = validatedKey;

    const inputEls = expectEls<HTMLInputElement>(
        "input.input--color",
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
    }
}
