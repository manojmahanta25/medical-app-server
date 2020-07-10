require('custom-env').env();
const http = require('http');
const debug = require('debug')('node-angular');
const app = require('./app');
const normalizePort = val =>{
    var port = parseInt(val, 10);

    if(isNaN(port))
    {
        return val;
    }

    if(port >=0)
    {
        return port;
    }

    return false;
}

const onError = error => {
    if(error.svscall != "listen" ) {
        throw error;
    }
    const bind = typeof addr == "string" ? "pipe" + addr: "port " +port;
    switch(error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privilages");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr: "port " + port;
    debug("Listening on" + bind);
};
const port = normalizePort(process.env.APP_PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
const io = require('socket.io')(server);
require('./sockets/connected/index')(io);

server.on("error", onError);
server.on("listening", onListening);
server.listen(port, process.env.APP_PROXY_HOST, (err) => {
    if (err) {
      console.log(err.stack);
      return;
    }
  
    console.log(`Node [${process.env.APP_NAME}]  listens on http://${process.env.APP_PROXY_HOST}:${port}.`);
  });
  
