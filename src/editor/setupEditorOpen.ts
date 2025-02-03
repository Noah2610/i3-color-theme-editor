import { Context } from "../context";
import { createUnsubs, expectEl, openEditor, validateThemeKey } from "../util";
import { updateEditor } from "./updateEditor";

export function setupEditorOpen(
    context: Context,
    editorEl: HTMLElement,
    desktopEl: HTMLElement,
): () => void {
    const editableEls = desktopEl.querySelectorAll<HTMLElement>(
        "[data-theme]:not(.--noedit)",
    );

    const unsubs = createUnsubs();

    Array.from(editableEls)
        .map((el) => setupEditableListener(el, editorEl, context))
        .filter((u) => u !== null)
        .forEach(unsubs.add);

    return unsubs.unsubAll;
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

    const unsubs = createUnsubs();

    const onClick = (event: MouseEvent) => {
        event.stopPropagation();

        const editorFormEl = expectEl(".editor-form", editorEl);
        editorFormEl.setAttribute("data-editor-target", dataTheme);

        updateEditor(context.theme, editorEl);
        openEditor(editorEl, { x: event.pageX, y: event.pageY });
    };

    const onKey = (event: KeyboardEvent) => {
        event.stopPropagation();

        if (event.code !== "Space" && event.code !== "Enter") {
            return;
        }

        const editorFormEl = expectEl(".editor-form", editorEl);
        editorFormEl.setAttribute("data-editor-target", dataTheme);

        const rect = (
            event.currentTarget as HTMLElement | null
        )?.getBoundingClientRect();
        const pos = rect
            ? {
                  x: rect.left + Math.max(rect.width * 0.1, 24),
                  y: rect.top + Math.max(rect.height * 0.1, 24),
              }
            : { x: 0, y: 0 };

        updateEditor(context.theme, editorEl);
        openEditor(editorEl, pos);
    };

    editableEl.addEventListener("click", onClick);
    editableEl.addEventListener("keyup", onKey);

    unsubs.add(() => {
        editableEl.removeEventListener("click", onClick);
        editableEl.removeEventListener("keyup", onKey);
    });

    return unsubs.unsubAll;
}
