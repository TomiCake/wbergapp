const BREAKS = [
    { period: 2, time: 15 },
    { period: 4, secondaryPeriod: 5, time: 20 },
    { period: 6, time: 5 },
];

function formatDate(date) {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    return (hours.length < 2 ? "0" + hours : hours) + ":" + (minutes.length < 2 ? "0" + minutes : minutes)
}
export function getPeriodTimes(period, secondary) {
    let date = new Date();
    let breakTime = 0;
    for (let b of BREAKS) {
        if ((secondary && b.secondaryPeriod ? b.secondaryPeriod : b.period) <= period) {
            breakTime += b.time;
        }
    }

    date.setHours(8);
    date.setMinutes(0);
    date.setMinutes(
        date.getMinutes() // start minutes
        + period * 45     // time of one period
        + period * 5      // break after period
        + breakTime       // breaks
    );

    let r = { start: formatDate(date) };

    date.setMinutes(date.getMinutes() + 45); // end of period
    r.end = formatDate(date);
    return r;
}
