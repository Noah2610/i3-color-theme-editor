import {
    expectEl,
    expectEls,
    getThemeValue,
    openEditor,
    validateThemeKey,
} from "../util";
import { Context } from "../context";

export function setupEditorOpen(
    context: Context,
    editorEl: HTMLElement,
    desktopEl: HTMLElement,
): () => void {
    const editableEls = desktopEl.querySelectorAll<HTMLElement>(
        "[data-theme]:not(.--noedit)",
    );

    const unsubs: (() => void)[] = Array.from(editableEls)
        .map((el) => setupEditableListener(el, editorEl, context))
        .filter((u) => !!u) as (() => void)[];

    return () => unsubs.forEach((unsub) => unsub());
}

function setupEditableListener(
    editableEl: HTMLElement,
    editorEl: HTMLElement,
    context: Context,
): (() => void) | null {
    const dataTheme = editableEl.getAttribute("data-theme");
    if (dataTheme === null) {
        return null;
    }
    const validatedThemeKey = validateThemeKey(context.theme, dataTheme);
    if (validatedThemeKey === null) {
        return null;
    }
    const [themePartKey, themeValueKey] = validatedThemeKey;

    const unsubs: (() => void)[] = [];

    const listener = (event: MouseEvent) => {
        event.stopPropagation();

        openEditor(editorEl, event);

        const themeValue = getThemeValue(
            context.theme,
            themePartKey,
            themeValueKey,
        );

        const editorBar = expectEl(".window-bar", editorEl);
        editorBar.innerText = `${themePartKey} ${themeValueKey}`;

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

        const inputColorEls = expectEls<HTMLInputElement>(
            `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
            editorEl,
        );
        for (const inputColorEl of inputColorEls) {
            const dataEditorColor =
                inputColorEl.getAttribute("data-editor-color");
            if (dataEditorColor === null) {
                continue;
            }
            switch (dataEditorColor) {
                case "color": {
                    if (typeof themeValue === "string") {
                        inputColorEl.value = themeValue;
                    }
                    break;
                }
                case "border":
                case "background":
                case "text": {
                    if (typeof themeValue !== "string") {
                        inputColorEl.value = themeValue[dataEditorColor];
                    }
                    break;
                }
            }

            // inputColorEl.setAttribute("data-editor-target", dataTheme);
        }

        const editorFormEl = expectEl(".editor-form", editorEl);
        editorFormEl.setAttribute("data-editor-target", dataTheme);
    };

    editableEl.addEventListener("click", listener);
    unsubs.push(() => editableEl.removeEventListener("click", listener));

    return () => unsubs.forEach((unsub) => unsub());
}
