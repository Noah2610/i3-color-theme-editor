import { Context } from "./context";
import {
    BarColors,
    Color,
    Colors,
    Theme,
    updateTheme,
    WindowColors,
} from "./theme";
import { createUnsubs, expectEl, RecursivePartial } from "./util";

export function setupImport(context: Context): () => void {
    const unsubs = createUnsubs();

    const importEl = expectEl<HTMLTextAreaElement>(".import .import__config");

    const onChange = () => importConfig(context);

    importEl.addEventListener("change", onChange);
    unsubs.add(() => importEl.removeEventListener("change", onChange));

    return unsubs.unsubAll;
}

export function importConfig(context: Context) {
    const configRaw = getRawConfig();
    const theme = parseConfig(configRaw);
    if (!theme) {
        return;
    }

    updateTheme(theme, { noExport: true });
}

function getRawConfig(): string {
    const el = expectEl<HTMLTextAreaElement>(".import .import__config");
    return el.value;
}

function parseConfig(configRaw: string): RecursivePartial<Theme> | null {
    const lines = configRaw.split("\n");

    const config: RecursivePartial<Theme> = {};

    const themeCmdsWindow: `client.${keyof Theme["window"]}`[] = [
        "client.focused",
        "client.focused_inactive",
        "client.unfocused",
        "client.urgent",
        "client.placeholder",
        "client.background",
    ];

    const themeCmdsBar: (keyof Theme["bar"])[] = [
        "background",
        "statusline",
        "separator",
        "focused_background",
        "focused_statusline",
        "focused_separator",
        "focused_workspace",
        "active_workspace",
        "inactive_workspace",
        "urgent_workspace",
        "binding_mode",
    ];

    const isThemeCmdWindow = (
        s: string,
    ): s is `client.${keyof Theme["window"]}` =>
        themeCmdsWindow.includes(s as any);

    const isThemeCmdBar = (s: string): s is keyof Theme["bar"] =>
        themeCmdsBar.includes(s as any);

    const isCmdComment = (s: string): s is "#" => s === "#";

    const reBlockStart = /{\s*$/;
    const reBlockEnd = /^\s*}/;
    let blocks: string[] = [];
    const vars: Record<string, string> = {};

    for (const line of lines.map((l) => l.trim())) {
        if (!line) {
            continue;
        }

        const [cmd, ...args] = line.split(/\s+/);

        if (!cmd || isCmdComment(cmd)) {
            continue;
        }

        if (line.match(reBlockStart)) {
            blocks.push(cmd);
        } else if (line.match(reBlockEnd)) {
            blocks.pop();
        }

        if (cmd === "set") {
            const varPair = parseVar(args);

            if (!varPair) {
                console.error(
                    `[import] Failed parsing variable declaration "${args.join(
                        " ",
                    )}" for "${cmd}" command`,
                );
                continue;
            }

            vars[varPair[0]] = varPair[1];

            continue;
        }

        if (blocks.length === 0 && isThemeCmdWindow(cmd)) {
            const value =
                cmd === "client.background"
                    ? parseColor(args, vars)
                    : parseWindowColors(args, vars);

            if (!value) {
                console.error(
                    `[import] Failed parsing window color(s) "${args.join(
                        " ",
                    )}" for property "${cmd}"`,
                );
                continue;
            }

            const key = cmd.replace("client.", "") as keyof Theme["window"];

            if (!config.window) {
                config.window = {};
            }

            config.window[key] = value as any;

            continue;
        }

        const isBarColorsBlock = blocks[0] === "bar" && blocks[1] === "colors";

        if (isBarColorsBlock && isThemeCmdBar(cmd)) {
            const value = ["background", "statusline", "separator"].includes(
                cmd,
            )
                ? parseColor(args, vars)
                : parseBarColors(args, vars);

            if (!value) {
                console.error(
                    `[import] Failed parsing bar color(s) "${args.join(
                        " ",
                    )}" for property "${cmd}"`,
                );
                continue;
            }

            if (!config.bar) {
                config.bar = {};
            }

            config.bar[cmd] = value as any;

            continue;
        }
    }

    return config;
}

function parseColor(
    args: string | string[],
    vars?: Record<string, string>,
): Color | null {
    let val = Array.isArray(args) ? findFirstPresentString(args) : args;

    if (!val) {
        return null;
    }

    if (vars && val.match(/^\s*\$/)) {
        val = vars[val.trim()] || val;
    }

    const parsed = val.match(/^\s*["']?(#[\dA-Fa-f]{6})["']?\s*$/);
    if (parsed && parsed[1]) {
        return parsed[1];
    } else {
        return null;
    }
}

function findFirstPresentString(args: string[]): string | undefined {
    return args.find(isStringPresent);
}

function isStringPresent(s: string): boolean {
    return !!s.trim();
}

function parseWindowColors(
    args: string[],
    vars?: Record<string, string>,
): WindowColors | null {
    const colors: Partial<WindowColors> = {
        border: (args[0] && parseColor(args[0], vars)) || undefined,
        background: (args[1] && parseColor(args[1], vars)) || undefined,
        text: (args[2] && parseColor(args[2], vars)) || undefined,
        indicator: (args[3] && parseColor(args[3], vars)) || "",
        child_border: (args[4] && parseColor(args[4], vars)) || "",
    };
    if (isValidColors(colors)) {
        return colors;
    } else {
        return null;
    }
}

function parseBarColors(
    args: string[],
    vars?: Record<string, string>,
): BarColors | null {
    const colors: Partial<BarColors> = {
        border: (args[0] && parseColor(args[0], vars)) || undefined,
        background: (args[1] && parseColor(args[1], vars)) || undefined,
        text: (args[2] && parseColor(args[2], vars)) || undefined,
    };
    if (isValidColors(colors)) {
        return colors;
    } else {
        return null;
    }
}

function isValidColors<C extends Colors>(part: Partial<C>): part is C {
    return Object.values(part).every(
        (val) => val !== undefined && val !== null,
    );
}

function parseVar(args: string[]): [string, string] | null {
    const name = args[0];
    const val = args[1];
    if (name && val) {
        return [name.trim(), val.trim()];
    } else {
        return null;
    }
}
