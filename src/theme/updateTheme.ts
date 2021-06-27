import { merge, RecursivePartial } from "../util";
import { Theme } from "./types";
import { getContext } from "../context";
import { applyTheme } from "./applyTheme";

export function updateTheme(theme: RecursivePartial<Theme>) {
    const context = getContext();
    context.theme = merge(context.theme, theme);
    applyTheme(theme);
}
