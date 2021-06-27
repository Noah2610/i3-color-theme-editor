import { Color, Colors, Theme } from "./theme";
import { expectEl, merge, RecursivePartial, ValueOf } from "./util";

export function setupEditor(theme: Theme): () => void {
    const rootEl = expectEl(".desktop");
    const menuEl = expectEl(".menu");
    const editorEls = rootEl.querySelectorAll<HTMLElement>(
        "[data-theme]:not(.--noedit)",
    );

    const unsubs: (() => void)[] = Array.from(editorEls)
        .map((el) => {
            const dataTheme = el.getAttribute("data-theme");

            if (dataTheme === null) {
                return null;
            }

            const [themePartKey, themeKey] = dataTheme.split(".");

            if (!themePartKey || !themeKey) {
                return null;
            }

            return setupElListener(el, menuEl, theme, themePartKey, themeKey);
        })
        .filter((u) => !!u) as (() => void)[];

    return () => {};
}

function setupElListener(
    el: HTMLElement,
    menuEl: HTMLElement,
    theme: Theme,
    themePartKey: string,
    themeKey: string,
): (() => void) | null {
    if (!themePartKey || !themeKey || !(themePartKey in theme)) {
        return null;
    }

    // let isOpen = false;

    const listener = (event: MouseEvent) => {
        // if (isOpen) {
        //     isOpen = false;
        //     // closeMenu(menuEl);
        // } else {
        //     isOpen = true;
        openMenu(menuEl, event);
        // }

        const themePart = theme[themePartKey as keyof Theme];

        if (!themePart || !(themeKey in (theme as any)[themePartKey])) {
            return null;
        }

        const themeValue = (themePart as any)[themeKey] as
            | undefined
            | Color
            | Colors;

        const setTheme = (newTheme: RecursivePartial<Theme>) =>
            merge(theme, newTheme);

        console.log("------------------");
        console.log(el, themeValue);

        switch (typeof themeValue) {
            case "undefined": {
                return null;
            }
            case "string": {
                return null;
            }
            case "object": {
                return () => {};
            }
        }
    };

    el.addEventListener("click", listener);

    return () => el.removeEventListener("click", listener);
}

function openMenu(menuEl: HTMLElement, event: MouseEvent) {
    const mousePos = {
        x: event.pageX,
        y: event.pageY,
    };

    menuEl.style.left = `${mousePos.x}px`;
    menuEl.style.top = `${mousePos.y}px`;

    menuEl.classList.add("--open");
}

function closeMenu(menuEl: HTMLElement) {
    menuEl.classList.remove("--open");
}

function setupColorListener(
    el: HTMLElement,
    setTheme: (theme: RecursivePartial<Theme>) => void,
): (() => void) | null {
    throw new Error("Function not implemented.");
}
