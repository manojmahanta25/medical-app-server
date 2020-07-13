const http = require('http');
require('custom-env').env('staging');
const debug = require('debug')('node-angular');
const app = require('./app');
const parseArgs = require('minimist');
const args = parseArgs(process.argv.slice(2));
const { name = 'default', porta = null} = args;
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

const port = normalizePort( porta || process.env.APP_PORT );
app.set("port", port);

const server = http.createServer(app);
const io = require('socket.io')(server);
const redis = require('socket.io-redis');
io.adapter(redis({ host: process.env.APP_PROXY_HOST, port: 6379 }));
require('./sockets/connected/index')(io);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port, process.env.APP_PROXY_HOST, (err) => {
    if (err) {
      console.log(err.stack);
      return;
    }
  
    console.log(`Node [${name}]  listens on http://${process.env.APP_PROXY_HOST}:${port}.`);
  });
 
  