const ws = require('ws')
const UserController = require('./users/user_controller.js');


module.exports = class ChatServer {
	constructor() {
		this.config = require('./config.js');
		this.ws = null;
		this.userController = new UserController();
		this.messages = [];
		this.port = this.config.port;
	}

	run() {
		this.ws = new ws.Server({ port: this.port });
		this.ws.on("connection", (ws, req) => this.connection(ws, req));
		console.log(`Chat Server started :${this.port}`);
	}
	
	connection(ws, req) {
		this.userController.newUser(ws);
	}
}
