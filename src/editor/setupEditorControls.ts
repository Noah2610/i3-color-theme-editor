import { closeEditor, createUnsubs, expectEl } from "../util";

export function setupEditorControls(editorEl: HTMLElement): () => void {
    const unsubs = createUnsubs();

    unsubs.add(setupCloseKey(editorEl));
    unsubs.add(setupCloseButton(editorEl));

    return unsubs.unsubAll;
}

function setupCloseKey(editorEl: HTMLElement): () => void {
    const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeEditor(editorEl);
        }
    };

    document.addEventListener("keyup", onKey);
    return () => document.removeEventListener("keyup", onKey);
}

function setupCloseButton(editorEl: HTMLElement): () => void {
    const closeButtonEl = expectEl(".__close", editorEl);

    const onClick = () => {
        closeEditor(editorEl);
    };

    closeButtonEl.addEventListener("click", onClick);
    return () => closeButtonEl.removeEventListener("click", onClick);
}
