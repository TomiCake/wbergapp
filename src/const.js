export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api';

export const WEEKDAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
export const PERIOD_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const PERIOD_BGCOLOR = '#3e2723';
export const HOLIDAY_BGCOLOR = '#33691e';
export const DATES_HEIGHT = 40;
export const SUBSTITUTION_MAP = {
    "SUBSTITUTION": {
        "color": "red",
        "type": "Vertretung"
    },
    "ASSIGNMENT": {
        "color": "yellow",
        "type": "Aufgaben"
    },
    "ELIMINATION": {
        "color": "lime",
        "type": "Entfall"
    },
    "ROOM_SUBSTITUTION": {
        "color": "cyan",
        "type": "Raumvertretung",
        targets: ['room']
    },
    "INFORMATION": {
        color: "purple",
        type: "Hinweis",
    },
    "SWAP": {
        "color": "gold",
        "type": "Tausch"
    },
    "EXTRA_LESSON": {
        "color": "fuchsia",
        "type": "Zusatzstunde"
    },
    "SUPERVISION": {
        "color": "grey",
        "type": "Mitbetreuung"
    },
    "REDUNDANCY": {
        color: "lime",
        type: "Freistellung"
    }
};