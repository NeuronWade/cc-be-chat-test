const ws = require('ws');
const inquirer = require('inquirer');
const HANDLER_TYPE = require('../common/handle_type.js');

module.exports = class Client {
	constructor() {
		this.config = require('./config.js');
		this.ws = null;
		this.id = 0;
		this.name = '';
	}

	run() {
		this.ws = new ws(`ws://localhost:${this.config.port}`);
		this.ws.onclose = a => this.close(a);
		this.ws.onmessage = data => this.handler(data);

		const start = async () => {
			const { name } = await this.setName();
			this.send(JSON.stringify({ type: HANDLER_TYPE.LOGIN, name: name }));
		  	while (true) {
		    	const answers = await this.sendMessage();
		    	const { message } = answers;
		    	this.send(JSON.stringify({ type: HANDLER_TYPE.MESSAGE, message: message }));
		 	}
		}
		start();
	}

	sendMessage = () => {
	  const questions = [
	    {
	      name: "message",
	      type: "input",
	      message: "Enter chat message:"
	    }
	  ];
	  return inquirer.prompt(questions);
	}

	setName = () => {
	  const questions = [
	    {
	      name: "name",
	      type: "input",
	      message: "Enter your name:"
	    }
	  ];
	  return inquirer.prompt(questions);
	}

	handler(data) {
		data = JSON.parse(data.data);
		switch (data.type) {
			case HANDLER_TYPE.MESSAGE_LIST:
				data.messages.forEach(function(message) {
					console.log(`[${message.timestamp}] ${message.senderName} : ${message.body}`);
				})
				break;
			case HANDLER_TYPE.MESSAGE:
				console.log(`[${data.message.timestamp}] ${data.message.senderName} : ${data.message.body}`);
				break;
			case HANDLER_TYPE.INFO:
				console.log(`${data.info}`);
				break;
		}
	}

	send(data) {
		if (this.ws.readyState == ws.OPEN) this.ws.send(data);
	}

	close() {
		console.log(`client close`);
		if (this.ws.readyState == ws.OPEN) this.ws.close();
		process.exit();
	}
	
}