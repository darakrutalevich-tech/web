function isInteger(num) {
    return typeof num === "number" && Number.isInteger(num);
}

function repeatTwice(str) {
    return str + str;
}

function isSame(a, b) {
    return a === b;
}

function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function createArray(start, end) {
    const arr = [];
    for (let i = start; i < end + 1; i++) {
        arr.push(i);
    }
    return arr;
}

function countNegatives(array) {
    return array.filter(num => num < 0).length;
}

function addPrefix(array, prefix){
    return array.map(element => prefix + element);
}



