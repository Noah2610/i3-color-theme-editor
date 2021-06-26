import { BarColors, Color, Theme, WindowColors } from "./types";
import { merge, RecursivePartial } from "../util";

export function defaultTheme(): Theme {
    return merge(createBlankTheme(), createDefaultTheme());
}

function createDefaultTheme(): RecursivePartial<Theme> {
    const colorBg = "#21242b";
    const colorText = "#e3e3e3";
    const colorUrgent = "#cf8600";

    return {
        bar: {
            focused_background: {
                background: colorBg,
                border: colorBg,
                text: colorText,
            },
            focused_statusline: {
                background: colorBg,
                border: colorBg,
                text: colorText,
            },
            focused_separator: {
                background: colorBg,
                border: colorBg,
                text: colorText,
            },
            active_workspace: {
                background: colorBg,
                border: colorBg,
                text: colorText,
            },
            inactive_workspace: {
                background: colorBg,
                border: colorBg,
                text: colorText,
            },
            focused_workspace: {
                background: "#404040",
                border: "#404040",
                text: colorText,
            },
            urgent_workspace: {
                background: colorBg,
                border: colorUrgent,
                text: "#ffffff",
            },
        },

        window: {
            focused: {
                background: "#3c7d25",
                border: "#3c7d25",
                text: "#000000",
            },
            focused_inactive: {
                background: "#315781",
                border: "#315781",
                text: "#c2c6cf",
            },
            unfocused: {
                background: colorBg,
                border: colorBg,
                text: "#c2c6cf",
            },
            urgent: {
                background: colorUrgent,
                border: colorUrgent,
                text: "#ffffff",
            },
            placeholder: {
                background: "#666666",
                border: "#666666",
                text: "#ffffff",
            },
        },
    };
}

function createBlankTheme(): Theme {
    return {
        bar: {
            background: newColor(),
            statusline: newColor(),
            separator: newColor(),
            focused_background: newBarColors(),
            focused_statusline: newBarColors(),
            focused_separator: newBarColors(),
            focused_workspace: newBarColors(),
            active_workspace: newBarColors(),
            inactive_workspace: newBarColors(),
            urgent_workspace: newBarColors(),
            binding_mode: newBarColors(),
        },
        window: {
            focused: newWindowColors(),
            focused_inactive: newWindowColors(),
            unfocused: newWindowColors(),
            urgent: newWindowColors(),
            placeholder: newWindowColors(),
            background: newColor(),
        },
    };
}

function newColor(color: Color = "#000000"): Color {
    return color;
}

function newBarColors(color: Color = "#000000"): BarColors {
    return {
        background: color,
        border: color,
        text: "#ffffff",
    };
}

function newWindowColors(color: Color = "#000000"): WindowColors {
    return {
        border: color,
        background: color,
        text: "#ffffff",
        indicator: "#ff0000",
        child_border: "#ff0000",
    };
}
