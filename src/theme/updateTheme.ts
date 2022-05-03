import { Theme } from "./types";
import { getContext } from "../context";
import { applyTheme } from "./applyTheme";
import { updateEditor } from "../editor";
import { exportConfig } from "../export";
import { merge, RecursivePartial, safeObjectKeys } from "../util";

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
    context.theme = updateIndicatorAndChildBorderColors(
        merge(context.theme, theme),
    );
    applyTheme(theme);
    updateEditor(context.theme);

    if (!noExport) {
        exportConfig(context);
    }
}

function updateIndicatorAndChildBorderColors(theme: Theme): Theme {
    for (const windowKey of safeObjectKeys(theme.window)) {
        const colors = theme.window[windowKey];
        if (typeof colors === "string") continue;
        colors.indicator = colors.border;
        colors.child_border = colors.border;
    }
    return theme;
}
