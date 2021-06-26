import { Theme } from "./theme";
import { findEl } from "./util";

export function setupEditor(theme: Theme): () => void {
    const rootEl = findEl(".desktop");

    const editorEls = rootEl.querySelectorAll<HTMLElement>("[data-theme]");

    return () => {};
}
