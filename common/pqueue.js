module.exports = function PQueue() {
    this.elements = [];

    this.enqueue = function (element, priority) {
        this.elements.push(element);
        if (element instanceof Array) elements = this.elements.concat(element);
        else this.elements.push(element);

        const pElement = { element, priority };
        if (this.isEmpty()) {
            return this.elements.push(pElement);
        }

        let isExist = false;
        for (let i = 0; i < this.elements.length; i++) {
            if (priority < this.elements[i]['priority']) {
                isExist = true;
                this.elements.splice(i, 0, pElement)
                break;
            }
        }

        if (!isExist) {
            this.elements.push(pElement);
        }
    };

    this.dequeue = function() {
        return this.elements.shift();
    };

    this.total = function() {
        return this.elements;
    }

    this.front = function() {
        return this.elements[0];
    }

    this.isEmpty = function() {
        return this.elements.length === 0;
    };
}
