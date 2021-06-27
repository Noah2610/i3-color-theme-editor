import { Context } from "../context";
import { updateTheme, Color, Colors, Theme } from "../theme";
import {
    expectEl,
    expectEls,
    merge,
    RecursivePartial,
    safeObjectKeys,
    ValueOf,
} from "../util";

import { setupEditorOpen } from "./setupEditorOpen";
import { setupEditorInput } from "./setupEditorInput";
import { setupEditorControls } from "./setupEditorControls";

export function setupEditor(context: Context): () => void {
    const desktopEl = expectEl(".desktop");
    const editorEl = expectEl(".editor");

    const unsubs: (() => void)[] = [];

    unsubs.push(setupEditorOpen(context, editorEl, desktopEl));
    unsubs.push(setupEditorInput(context, editorEl));
    unsubs.push(setupEditorControls(editorEl));

    return () => unsubs.forEach((unsub) => unsub());
}
