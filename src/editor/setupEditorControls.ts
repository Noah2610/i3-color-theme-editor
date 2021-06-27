import { closeEditor } from "../util";

export function setupEditorControls(editorEl: HTMLElement): () => void {
    const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeEditor(editorEl);
        }
    };

    document.addEventListener("keyup", onKey);

    return () => document.removeEventListener("keyup", onKey);
}
