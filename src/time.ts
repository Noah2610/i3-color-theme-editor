const UPDATE_TIME_INTERVAL_MS = 1000;

export function setupTime(): () => void {
    updateTime();
    const intervalId = setInterval(updateTime, UPDATE_TIME_INTERVAL_MS);
    return () => clearInterval(intervalId);
}

function updateTime() {
    const now = formatDateTime(new Date());
    const timeEls = document.querySelectorAll<HTMLElement>(".now");
    for (const timeEl of Array.from(timeEls)) {
        timeEl.innerText = now;
    }
}

function formatDateTime(date: Date): string {
    const pad = (n: number, l = 2) => n.toString().padStart(l, "0");
    const weekday = getWeekdayFrom(date);
    return [
        weekday,
        [
            pad(date.getDate()),
            pad(date.getMonth() + 1),
            pad(date.getFullYear(), 4),
        ].join("."),
        [
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds()),
        ].join(":"),
    ].join(" ");
}

function getWeekdayFrom(date: Date): string {
    return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ][date.getDay()]!;
}
