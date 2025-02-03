import { updateColorPickerInputs } from "src/colorPicker";
import { trapFocus, untrapFocus, type TrapFocusState } from "./trapFocus";

const OPEN_EDITOR_URGENT_TIMEOUT_MS = 500;
let openEditorUrgentTimeoutId: number | null = null;

export function openEditor(
    editorEl: HTMLElement,
    pos: { x: number; y: number },
) {
    // updateColorPickerInputs(editorEl);

    editorEl.style.left = `${pos.x}px`;
    editorEl.style.top = `${pos.y}px`;

    editorEl.classList.add("--open", "--urgent");
    editorEl.removeAttribute("inert");

    trapEditorFocus(editorEl);

    if (openEditorUrgentTimeoutId !== null) {
        clearTimeout(openEditorUrgentTimeoutId);
    }
    openEditorUrgentTimeoutId = window.setTimeout(() => {
        openEditorUrgentTimeoutId = null;
        editorEl.classList.remove("--urgent");
    }, OPEN_EDITOR_URGENT_TIMEOUT_MS);
}

export function closeEditor(editorEl: HTMLElement) {
    editorEl.classList.remove("--open");
    editorEl.setAttribute("inert", "");

    untrapEditorFocus();
}

let TRAP_EDITOR_FOCUS_STATE: TrapFocusState | null = null;

function trapEditorFocus(editorEl: HTMLElement) {
    untrapEditorFocus();
    TRAP_EDITOR_FOCUS_STATE = trapFocus(editorEl);
}

function untrapEditorFocus() {
    if (TRAP_EDITOR_FOCUS_STATE === null) {
        return;
    }

    untrapFocus(TRAP_EDITOR_FOCUS_STATE);
    TRAP_EDITOR_FOCUS_STATE = null;
}
