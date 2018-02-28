export function rangeArray(to, from = 0) {
    let array = [];
    for (i = from; i <= to; i++) {
        array.push(i);
    }
    return array;
}
export function extendZeros(string, length) {
    if (!string && !string.toString) {return string;}
    string = string.toString();
    while (string.length < length){
        string = "0" + string;
    }
    return string;
}