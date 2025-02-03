import { getContext } from "../context";
import { updateEditor } from "../editor";
import { exportConfig } from "../export";
import {
    deepEqual,
    merge,
    safeObjectKeys,
    type RecursivePartial,
} from "../util";
import { applyTheme } from "./applyTheme";
import { type Theme } from "./types";

interface UpdateThemeOptions {
    onlyWhenChanged: boolean;
    applyTheme: boolean;
    updateEditor: boolean;
    exportTheme: boolean;
}

const DEFAULT_UPDATE_THEME_OPTIONS: UpdateThemeOptions = {
    onlyWhenChanged: true,
    applyTheme: true,
    updateEditor: true,
    exportTheme: true,
};

export function updateTheme(
    changedTheme: RecursivePartial<Theme>,
    opts?: Partial<UpdateThemeOptions>,
) {
    const options = {
        ...DEFAULT_UPDATE_THEME_OPTIONS,
        ...opts,
    };

    const context = getContext();
    const updatedTheme = updateIndicatorAndChildBorderColors(
        merge(context.theme, changedTheme),
    );

    if (options.onlyWhenChanged && deepEqual(context.theme, updatedTheme)) {
        return;
    }

    context.theme = updatedTheme;

    if (options.applyTheme) {
        applyTheme(changedTheme);
    }

    if (options.updateEditor) {
        updateEditor(context.theme);
    }

    if (options.exportTheme) {
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
