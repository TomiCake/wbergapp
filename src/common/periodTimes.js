import { checkStatus } from "./apiHelper";
import { API_URL } from "../const";

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
