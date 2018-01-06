import { API_URL } from "../../const";
import { checkStatus } from "../common/apiHelper";

export function getMasterdata(token, url) {
    return fetch(`${API_URL}/${url}`, {
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

export function getSubstitutions(token, type, id, year, week) {
    return fetch(`${API_URL}/substitution/${type}/${id}/${year}-${week}`, {
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

export function getTimetable(token, type, id) {
    return fetch(`${API_URL}/timetable/${type}/${id}`, {
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
