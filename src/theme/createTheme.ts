import { BarColors, Color, Theme, WindowColors } from "./types";

export function createTheme(): Theme {
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
