import { closeEditor, expectEl } from "../util";

export function setupEditorControls(editorEl: HTMLElement): () => void {
    const unsubs: (() => void)[] = [];

    unsubs.push(setupClose(editorEl));

    return () => unsubs.forEach((unsub) => unsub());
}

function setupClose(editorEl: HTMLElement): () => void {
    const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeEditor(editorEl);
        }
    };

    document.addEventListener("keyup", onKey);
    return () => document.removeEventListener("keyup", onKey);
}
