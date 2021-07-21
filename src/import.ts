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

    const reBlockStart = /{\s*$/;
    const reBlockEnd = /^\s*}/;
    let blocks: string[] = [];

    for (const line of lines) {
        if (!line) {
            continue;
        }

        const [cmd, ...args] = line.split(" ");

        if (!cmd) {
            continue;
        }

        if (line.match(reBlockStart)) {
            blocks.push(cmd);
        } else if (line.match(reBlockEnd)) {
            blocks.pop();
        }

        if (blocks.length === 0 && isThemeCmdWindow(cmd)) {
            const value =
                cmd === "client.background"
                    ? parseColor(args)
                    : parseWindowColors(args);

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
                ? parseColor(args)
                : parseBarColors(args);

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

function parseColor(args: string | string[]): Color | null {
    const s = Array.isArray(args) ? findFirstPresentString(args) : args;
    if (!s) {
        return null;
    }
    const parsed = s.match(/^\s*(#[\dA-Fa-f]{6})\s*$/);
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

function parseWindowColors(args: string[]): WindowColors | null {
    const colors: Partial<WindowColors> = {
        border: (args[0] && parseColor(args[0])) || undefined,
        background: (args[1] && parseColor(args[1])) || undefined,
        text: (args[2] && parseColor(args[2])) || undefined,
        indicator: (args[3] && parseColor(args[3])) || undefined,
        child_border: (args[4] && parseColor(args[4])) || undefined,
    };
    if (isValidColors(colors)) {
        return colors;
    } else {
        return null;
    }
}

function parseBarColors(args: string[]): BarColors | null {
    const colors: Partial<BarColors> = {
        border: (args[0] && parseColor(args[0])) || undefined,
        background: (args[1] && parseColor(args[1])) || undefined,
        text: (args[2] && parseColor(args[2])) || undefined,
    };
    if (isValidColors(colors)) {
        return colors;
    } else {
        return null;
    }
}

function isValidColors<C extends Colors>(part: Partial<C>): part is C {
    return Object.values(part).every((val) => !!val);
}
