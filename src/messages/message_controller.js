const Message = require('./message.js');
const WordFilter = require('../wordfilter/word_filter.js');
const Queue = require('../../common/queue.js')
const PQueue = require('../../common/pqueue.js')
const CACHE_MESSAGE_COUNT = 50

module.exports = class MessageController {
	constructor() {
		this.messages = new Queue();
		this.WordFilter = new WordFilter();
		this.popularWords = new PQueue();
	}

	addMessage(senderId, senderName, body) {
		if (this.messages.size() >= CACHE_MESSAGE_COUNT) this.messages.dequeue();
		body = this.WordFilter.filter(body);
		let timestamp = new Date().getTime();
		let message = new Message(senderId, senderName, body, timestamp);
		this.recordWord(message)
		this.messages.enqueue(message);
		return message;
	}

	recordWord(message) {
		var wordsArray = message.body.split(/\s/);
		for (let i = 0; i < wordsArray.length; ++i) {
			this.popularWords.enqueue(wordsArray[i], 1);
		}
	}

	mostPopular() {
		let words = this.popularWords.front();
	}

	getAllMessages() {
		return this.messages.total();
	}

	allMessagesEncode() {
		return JSON.stringify({ type: 'messages', messages : this.messages.total() });
	}
}