const ws = require('ws')
const User = require('./user.js');
const MessageController = require('../messages/message_controller.js');
const COMMAND = require('../../common/command_type.js')
const HANDLER_TYPE = require('../../common/handle_type.js');

module.exports = class UserController {
	constructor() {
		this.users = [];
		this.messageController = new MessageController();
	}

	newUser(ws) {
		let id = 0;
		while (this.users.hasOwnProperty(++id));

		let user = new User(this, ws, id);
		this.users[id] = user;
		ws.on('message', data => { this.handler(user, data); });
		ws.on('close', () => {
			if (user) user.close();
		})
		user.send(this.messageController.allMessagesEncode())
	}	

	findUser(id) {
		if (this.users[id]) {
			return this.users[id];
		}
		return null;
		
	}

	findUserByName(name) {
		for (let userId in this.users) {
     		if (this.users[userId].name == name) return this.users[userId];
		}
		return null;
	}

	isExist(id) {
		this.users[id] != null ? true : false;
	}

	changeName(id, name) {
		this.users[id].setName(name);
	}

	removeUser(id) {
		delete this.users[id]
	}

	handler(user, raw) {
		let data = JSON.parse(raw);
		switch (data.type) {
			case HANDLER_TYPE.MESSAGE:
				let message = this.messageController.addMessage(user.id, user.name, data.message);
				var reg = new RegExp(/\/+\w+.*/,'g');
				let command = reg.exec(message.body);
				if (command) {
					let result = this.commander(command)
					if (result != "") {
						user.send(result)
					}
				} else {
					this.broadCast(user.id, message.encode(HANDLER_TYPE.MESSAGE));
				}
				break;
			case HANDLER_TYPE.LOGIN:
				this.changeName(user.id, data.name);
				break;
		}
	}

	commander(command) {
		command = command.toString().split(" ");
		switch (command[0]) {
			case COMMAND.POPULAR:
				let popularWord = this.messageController.mostPopular();
				return JSON.stringify({ type: HANDLER_TYPE.INFO, info : popularWord});
				break;
			case COMMAND.STATS:
				let queryUser = this.findUserByName(command[1]);
				if (queryUser) {
					return JSON.stringify({ type: HANDLER_TYPE.INFO, info : queryUser.getOnlineTime()});
				} else {
					return JSON.stringify({ type: HANDLER_TYPE.INFO, info : "not found user : " + command[1]});
				}
				break;
		}
	}

	broadCast(self, data) {
		for (let userId in this.users) {
			if (userId == self) {
				continue;
			}
			this.users[userId].send(data);
		}
	}
}