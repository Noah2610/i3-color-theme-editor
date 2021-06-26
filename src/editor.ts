import { Theme } from "./theme";

export function setupEditor(
    theme: Theme,
    el: HTMLElement = document.body,
): () => void {
    const editorEls = el.querySelectorAll<HTMLElement>("[data-theme]");

    return () => {};
}
