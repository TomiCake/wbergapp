export function rangeArray(to, from = 0) {
    let array = [];
    for (i = from; i <= to; i++){
        array.push(i);
    }
    return array;
}
export function rangeArrayDebug(to, from = 0) {
    console.debug("to: " + to, "from: " + from);
    return rangeArray(to, from);
}