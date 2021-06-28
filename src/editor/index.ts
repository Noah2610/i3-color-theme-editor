import { Context } from "../context";
import { expectEl } from "../util";

import { setupEditorOpen } from "./setupEditorOpen";
import { setupEditorInput } from "./setupEditorInput";
import { setupEditorControls } from "./setupEditorControls";

export { updateEditor } from "./updateEditor";

export function setupEditor(context: Context): () => void {
    const desktopEl = expectEl(".desktop");
    const editorEl = expectEl(".editor");

    const unsubs: (() => void)[] = [];

    unsubs.push(setupEditorOpen(context, editorEl, desktopEl));
    unsubs.push(setupEditorInput(context, editorEl));
    unsubs.push(setupEditorControls(editorEl));

    return () => unsubs.forEach((unsub) => unsub());
}
