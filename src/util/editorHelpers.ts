const OPEN_EDITOR_URGENT_TIMEOUT_MS = 500;
let openEditorUrgentTimeoutId: NodeJS.Timeout | null = null;

export function openEditor(editorEl: HTMLElement, event: MouseEvent) {
    const mousePos = {
        x: event.pageX,
        y: event.pageY,
    };

    editorEl.style.left = `${mousePos.x}px`;
    editorEl.style.top = `${mousePos.y}px`;

    editorEl.classList.add("--open", "--urgent");

    if (openEditorUrgentTimeoutId !== null) {
        clearTimeout(openEditorUrgentTimeoutId);
    }
    openEditorUrgentTimeoutId = setTimeout(() => {
        openEditorUrgentTimeoutId = null;
        editorEl.classList.remove("--urgent");
    }, OPEN_EDITOR_URGENT_TIMEOUT_MS);
}

export function closeEditor(editorEl: HTMLElement) {
    editorEl.classList.remove("--open");
}
