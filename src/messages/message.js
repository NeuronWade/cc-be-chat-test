module.exports = class Message {
	constructor(senderId, senderName, body, timestamp) {
		this.senderId = senderId;
		this.senderName = senderName;
		this.body = body;
		this.timestamp = timestamp;
	}

	encode(msgType) {
		return JSON.stringify({ type: msgType, message : this});
	}
}