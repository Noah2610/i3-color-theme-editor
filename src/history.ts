import { updateTheme, type Theme } from "./theme";
import { createUnsubs, expectEls } from "./util";

export interface History {
    changes: HistoryChange[];
    index: number;
}

export type HistoryChange = {
    type: "themeChange";
    theme: Theme;
    timestamp: Date;
};

export function setupHistory(history: History): () => void {
    const unsubs = createUnsubs();

    const undoButtons = expectEls<HTMLButtonElement>("button.history-undo");
    const redoButtons = expectEls<HTMLButtonElement>("button.history-redo");

    const onUndo = (event: Event) => {
        event.stopPropagation();

        const newTheme = undoHistory(history);

        if (newTheme) {
            updateTheme(newTheme, {
                applyTheme: true,
                updateEditor: true,
                exportTheme: true,
                onlyWhenChanged: false,
                commitToHistory: false,
            });
        }

        updateDisabled(history);
    };

    const onRedo = (event: Event) => {
        event.stopPropagation();

        const newTheme = redoHistory(history);

        if (newTheme) {
            updateTheme(newTheme, {
                applyTheme: true,
                updateEditor: true,
                exportTheme: true,
                onlyWhenChanged: false,
                commitToHistory: false,
            });
        }

        updateDisabled(history);
    };

    for (const undoButton of undoButtons) {
        undoButton.addEventListener("click", onUndo);
        unsubs.add(() => undoButton.removeEventListener("click", onUndo));
    }

    for (const redoButton of redoButtons) {
        redoButton.addEventListener("click", onRedo);
        unsubs.add(() => redoButton.removeEventListener("click", onRedo));
    }

    updateDisabled(history);

    return unsubs.unsubAll;
}

function updateDisabled(history: History) {
    const updateDisabledUndo = () => {
        const undoButtons = expectEls<HTMLButtonElement>("button.history-undo");
        const undoDisabled = !canUndo(history);
        for (const undoButton of undoButtons) {
            undoButton.disabled = undoDisabled;
        }
    };

    const updateDisabledRedo = () => {
        const redoButtons = expectEls<HTMLButtonElement>("button.history-redo");
        const redoDisabled = !canRedo(history);
        for (const redoButton of redoButtons) {
            redoButton.disabled = redoDisabled;
        }
    };

    updateDisabledUndo();
    updateDisabledRedo();
}

export function newHistory(theme: Theme): History {
    return {
        changes: [
            {
                type: "themeChange",
                theme,
                timestamp: new Date(),
            },
        ],
        index: 0,
    };
}

export function commitThemeToHistory(history: History, theme: Theme) {
    if (history.index < history.changes.length - 1) {
        history.changes = history.changes.slice(0, history.index + 1);
    }

    history.changes.push({
        type: "themeChange",
        theme,
        timestamp: new Date(),
    });
    history.index++;

    updateDisabled(history);
}

function canUndo(history: History) {
    return history.index > 0;
}

function canRedo(history: History) {
    return history.index < history.changes.length - 1;
}

export function undoHistory(history: History): Theme | null {
    if (canUndo(history)) {
        return history.changes[--history.index]?.theme ?? null;
    }
    return null;
}

export function redoHistory(history: History): Theme | null {
    if (canRedo(history)) {
        return history.changes[++history.index]?.theme ?? null;
    }
    return null;
}
