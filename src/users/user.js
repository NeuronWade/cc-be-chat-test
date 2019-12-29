const ws = require('ws')
const HANDLER_TYPE = require('../../common/handle_type.js');

module.exports = class User {
	constructor(server, ws, id) {
		this.server = server;
		this.ws = ws;
		this.id = id;
		this.ip = ws._socket.remoteAddress;
		this.name = '';
		this.loginTime = new Date().getTime();
		this.status = true;
	}

	send(data) {
		if (this.ws.readyState == ws.OPEN) {
			this.ws.send(data);
		}
	}

	handler(raw) {
		let data = JSON.parse(raw);
		switch (data.type) {
			case HANDLER_TYPE.MESSAGE:
				this.server.broadCast(raw);
				break;
			case HANDLER_TYPE.LOGIN:
				this.setName(data.name);
				break;
		}
	}

	setName(name) {
		this.name = name;
	}

	getOnlineTime() {
		return this.formatDuring(new Date().getTime() - this.loginTime);
	}

	formatDuring(timestamp){
    	var days = parseInt(timestamp / (1000 * 60 * 60 * 24));
    	var hours = parseInt((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    	var minutes = parseInt((timestamp % (1000 * 60 * 60)) / (1000 * 60));
    	var seconds = (timestamp % (1000 * 60)) / 1000;
    	return days.toString().padStart(2, '0') + "d " + 
    	hours.toString().padStart(2, '0') + "h " + 
    	minutes.toString().padStart(2, '0') + "m " + 
    	Math.floor(seconds).toString().padStart(2, '0') + "s";
	}

	close() {
		if (this.ws.readyState == ws.OPEN) this.ws.close();
	}
}