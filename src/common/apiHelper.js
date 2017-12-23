
export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText || response.status);
        error.response = response;
        throw error;
    }
}