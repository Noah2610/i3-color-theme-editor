import { expectEl, openEditor, validateThemeKey } from "../util";
import { Context } from "../context";
import { updateEditor } from "./updateEditor";

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
    if (!validateThemeKey(context.theme, dataTheme)) {
        return null;
    }

    const unsubs: (() => void)[] = [];

    const listener = (event: MouseEvent) => {
        event.stopPropagation();

        const editorFormEl = expectEl(".editor-form", editorEl);
        editorFormEl.setAttribute("data-editor-target", dataTheme);

        openEditor(editorEl, event);

        updateEditor(context.theme, editorEl);
    };

    editableEl.addEventListener("click", listener);
    unsubs.push(() => editableEl.removeEventListener("click", listener));

    return () => unsubs.forEach((unsub) => unsub());
}
