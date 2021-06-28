import { Theme } from "./types";
import { getContext } from "../context";
import { applyTheme } from "./applyTheme";
import { updateEditor } from "../editor";
import { exportConfig } from "../export";
import { merge, RecursivePartial } from "../util";

export function updateTheme(theme: RecursivePartial<Theme>) {
    const context = getContext();
    context.theme = merge(context.theme, theme);
    applyTheme(theme);
    updateEditor(context.theme);
    exportConfig(context);
}
