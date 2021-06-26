import { applyTheme } from "./applyTheme";
import { createTheme } from "./createTheme";
import { setupTime } from "./time";
import { merge } from "./util";

function main() {
    const cleanup = setupTime();
    window.onunload = cleanup;

    const colorBg = "#21242b";
    const colorText = "#e3e3e3";
    const colorUrgent = "#cf8600";

    const theme = merge(createTheme(), {
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
    });
    applyTheme(theme);

    console.log(theme);
}

window.onload = main;
