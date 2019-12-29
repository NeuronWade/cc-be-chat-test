module.exports = function Queue() {
    let elements = [];

    this.enqueue = function (element) {
        elements.push(element);
    };

    this.dequeue = function () {
        return elements.shift();
    };

    this.front = function () {
        return elements[0];
    };

    this.isEmpty = function () {
        return elements.length === 0;
    };

    this.size = function () {
        return elements.length;
    };

    this.clear = function () {
        elements = [];
    };

    this.total = function () {
    	return elements;
    };
}