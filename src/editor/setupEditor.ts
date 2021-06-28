import { Context } from "../context";
import { createUnsubs, expectEl } from "../util";
import { setupEditorOpen } from "./setupEditorOpen";
import { setupEditorInput } from "./setupEditorInput";
import { setupEditorControls } from "./setupEditorControls";

export function setupEditor(context: Context): () => void {
    const desktopEl = expectEl(".desktop");
    const editorEl = expectEl(".editor");

    const unsubs = createUnsubs();

    unsubs.add(setupEditorOpen(context, editorEl, desktopEl));
    unsubs.add(setupEditorInput(context, editorEl));
    unsubs.add(setupEditorControls(editorEl));

    return unsubs.unsubAll;
}
