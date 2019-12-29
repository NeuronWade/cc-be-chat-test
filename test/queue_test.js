import test from 'ava';

function Queue() {
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

test('queue testing', t => {
    let q = new Queue();

    // Should be empty
    t.is(q.isEmpty(), true);

    q.enqueue(2);
    q.enqueue(1);
    q.enqueue(33);
    q.enqueue(6);
    t.is(q.dequeue(), 2);

    t.is(q.front(), 1);
    
    t.is(q.size(), 3);
    
});