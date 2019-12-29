function start() {
    var args = process.argv.splice(2)
    var startType = args[0]
    if (startType == null) {
        return
    }

    if (startType == 'server') {
        var ChatServer = require('./src/server.js');
        var Server = new ChatServer();
        Server.run();
    } else if (startType == 'cli') {
      const Client = require('./src/client.js');
      var client = new Client();
      client.run();
      process.on('SIGINT', function () {
          client.close();
          process.exit();
      });
    }
}

start();