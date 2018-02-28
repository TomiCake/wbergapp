import { checkStatus } from "./apiHelper";
import { API_URL } from "../const";

const BREAKS = [
    { period: 3, time: 15 },
    { period: 5, secondaryPeriod: 6, time: 20 },
    { period: 7, time: 5 },
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

    date.setHours(7);
    date.setMinutes(10);
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

export function getPeriodTimesOnline(token) {
    return fetch(`${API_URL}/period-times`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(checkStatus)
        .then((response) => response.json())
        .catch(async (error) => {
            throw await error.response.json();
        });
}
