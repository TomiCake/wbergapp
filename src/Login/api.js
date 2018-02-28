import { API_URL } from '../const';
import { checkStatus } from "../common";

export function getToken(email, password, api) {
    return fetch(`${API_URL}/token`, {
        method: 'POST',
        body: JSON.stringify({ email, password, api }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(checkStatus)
        .then((response) => response.json())
        .catch(async (error) => {
            throw await error.response.json();
        });
}
export function getAnonymousToken(email, password) {
    return getToken(email, password, 1);
}