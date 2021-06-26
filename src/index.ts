import { applyTheme } from "./applyTheme";
import { createTheme } from "./createTheme";
import { merge } from "./util";

function main() {
    const theme = merge(createTheme(), {
        bar: {
            background: "lightgray",
            statusline: "rebeccapurple",
            separator: "green",
        },
    });
    applyTheme(theme);

    console.log(theme);
}

window.onload = main;
