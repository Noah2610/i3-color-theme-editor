import { applyTheme, Color, Colors, Theme } from "./theme";
import { expectEl, expectEls, merge, RecursivePartial, ValueOf } from "./util";

export function setupEditor(theme: Theme): () => void {
    const rootEl = expectEl(".desktop");
    const editorEl = expectEl(".editor");
    const editableEls = rootEl.querySelectorAll<HTMLElement>(
        "[data-theme]:not(.--noedit)",
    );

    const unsubs: (() => void)[] = Array.from(editableEls)
        .map((el) => {
            return setupElListener(el, editorEl, theme);
        })
        .filter((u) => !!u) as (() => void)[];

    unsubs.push(setupEditorForm(editorEl, theme));

    return () => unsubs.forEach((unsub) => unsub());
}

function setupEditorForm(editorEl: HTMLElement, theme: Theme): () => void {
    const formEl = expectEl(".editor-form", editorEl);

    const onChange = (_event: Event) => {
        const dataEditorTarget = formEl.getAttribute("data-editor-target");

        if (dataEditorTarget === null) {
            return;
        }
        const validatedThemeKey = getValidThemeKey(theme, dataEditorTarget);
        if (validatedThemeKey === null) {
            return null;
        }
        const [themePartKey, themeValueKey, currentThemeValue] =
            validatedThemeKey;

        const targetDataEditor =
            typeof currentThemeValue === "string" ? "color" : "colors";

        const changedTheme: RecursivePartial<Theme> = {};

        const inputColorEls = expectEls<HTMLInputElement>(
            `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
            editorEl,
        );
        for (const inputColorEl of inputColorEls) {
            const dataEditorColor =
                inputColorEl.getAttribute("data-editor-color");
            if (dataEditorColor === null) {
                continue;
            }
            switch (dataEditorColor) {
                case "color": {
                    if (typeof currentThemeValue === "string") {
                        if (!changedTheme[themePartKey]) {
                            changedTheme[themePartKey] = {};
                        }
                        (changedTheme as any)[themePartKey][themeValueKey] =
                            inputColorEl.value;
                    }
                    break;
                }
                case "border":
                case "background":
                case "text": {
                    if (typeof currentThemeValue !== "string") {
                        if (!changedTheme[themePartKey]) {
                            changedTheme[themePartKey] = {};
                        }
                        if (
                            !(changedTheme as any)[themePartKey][themeValueKey]
                        ) {
                            (changedTheme as any)[themePartKey][themeValueKey] =
                                {};
                        }
                        (changedTheme as any)[themePartKey][themeValueKey][
                            dataEditorColor
                        ] = inputColorEl.value;
                    }
                    break;
                }
            }
        }

        applyTheme(changedTheme);
    };

    const onSubmit = (event: Event) => event.preventDefault();

    formEl.addEventListener("submit", onSubmit);
    formEl.addEventListener("change", onChange);

    return () => (
        formEl.removeEventListener("submit", onSubmit),
        formEl.removeEventListener("change", onChange)
    );
}

function setupElListener(
    editableEl: HTMLElement,
    editorEl: HTMLElement,
    theme: Theme,
): (() => void) | null {
    const dataTheme = editableEl.getAttribute("data-theme");
    if (dataTheme === null) {
        return null;
    }
    const validatedThemeKey = getValidThemeKey(theme, dataTheme);
    if (validatedThemeKey === null) {
        return null;
    }
    const [themePartKey, themeValueKey, themeValue] = validatedThemeKey;

    const listener = (event: MouseEvent) => {
        event.stopPropagation();

        openEditor(editorEl, event);

        const editorBar = expectEl(".window-bar", editorEl);
        editorBar.innerText = `${themePartKey} ${themeValueKey}`;

        let targetDataEditor: "color" | "colors";

        switch (typeof themeValue) {
            case "string": {
                targetDataEditor = "color";
                break;
            }
            case "object": {
                targetDataEditor = "colors";
                break;
            }
        }

        const editorInputEls = expectEls(".editor-input", editorEl);
        for (const editorEl of editorInputEls) {
            const dataEditor = editorEl.getAttribute("data-editor");
            if (dataEditor === null) {
                continue;
            }
            if (dataEditor === targetDataEditor) {
                editorEl.classList.remove("--hidden");
            } else {
                editorEl.classList.add("--hidden");
            }
        }

        const inputColorEls = expectEls<HTMLInputElement>(
            `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
            editorEl,
        );
        for (const inputColorEl of inputColorEls) {
            const dataEditorColor =
                inputColorEl.getAttribute("data-editor-color");
            if (dataEditorColor === null) {
                continue;
            }
            switch (dataEditorColor) {
                case "color": {
                    if (typeof themeValue === "string") {
                        inputColorEl.value = themeValue;
                    }
                    break;
                }
                case "border":
                case "background":
                case "text": {
                    if (typeof themeValue !== "string") {
                        inputColorEl.value = themeValue[dataEditorColor];
                    }
                    break;
                }
            }
        }

        const editorFormEl = expectEl(".editor-form", editorEl);
        editorFormEl.setAttribute("data-editor-target", dataTheme);
    };

    editableEl.addEventListener("click", listener);

    return () => editableEl.removeEventListener("click", listener);
}

function getValidThemeKey(
    theme: Theme,
    s: string,
):
    | [keyof Theme, keyof (Theme["bar"] & Theme["window"]), Color | Colors]
    | null {
    const [themePartKey, themeValueKey] = s.split(".");

    if (
        !themePartKey ||
        !themeValueKey ||
        !(themePartKey in theme) ||
        !(theme as any)[themePartKey] ||
        !(themeValueKey in (theme as any)[themePartKey]) ||
        !(theme as any)[themePartKey][themeValueKey]
    ) {
        return null;
    }

    const themeValue = (theme as any)[themePartKey][themeValueKey] as
        | Color
        | Colors;

    return [
        themePartKey as keyof Theme,
        themeValueKey as keyof ValueOf<Theme>,
        themeValue,
    ];
}

const OPEN_EDITOR_URGENT_TIMEOUT_MS = 500;
let openEditorUrgentTimeoutId: NodeJS.Timeout | null = null;

function openEditor(editorEl: HTMLElement, event: MouseEvent) {
    const mousePos = {
        x: event.pageX,
        y: event.pageY,
    };

    editorEl.style.left = `${mousePos.x}px`;
    editorEl.style.top = `${mousePos.y}px`;

    editorEl.classList.add("--open", "--urgent");

    if (openEditorUrgentTimeoutId !== null) {
        clearTimeout(openEditorUrgentTimeoutId);
    }
    openEditorUrgentTimeoutId = setTimeout(() => {
        openEditorUrgentTimeoutId = null;
        editorEl.classList.remove("--urgent");
    }, OPEN_EDITOR_URGENT_TIMEOUT_MS);
}

function closeEditor(editorEl: HTMLElement) {
    editorEl.classList.remove("--open");
}
