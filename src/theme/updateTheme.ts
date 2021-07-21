import { Theme } from "./types";
import { getContext } from "../context";
import { applyTheme } from "./applyTheme";
import { updateEditor } from "../editor";
import { exportConfig } from "../export";
import { merge, RecursivePartial } from "../util";

interface UpdateThemeOptions {
    noExport: boolean;
}

const DEFAULT_UPDATE_THEME_OPTIONS: UpdateThemeOptions = {
    noExport: false,
};

export function updateTheme(
    theme: RecursivePartial<Theme>,
    opts?: Partial<UpdateThemeOptions>,
) {
    const { noExport } = {
        ...DEFAULT_UPDATE_THEME_OPTIONS,
        ...opts,
    };

    const context = getContext();
    context.theme = merge(context.theme, theme);
    applyTheme(theme);
    updateEditor(context.theme);

    if (!noExport) {
        exportConfig(context);
    }
}
