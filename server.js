var express = require('express')
  app = express(),
  bodyParser = require('body-parser'),
  winston = require('winston'),
  http = require('http'),
  config = require('./config'),
  logger = {},
  https = require('https'),
  fs = require('fs'),
  router = require("./router"),
  cronJob = require('cron').CronJob,
  FDARouter = express.Router();



// initialize logger
logger = new winston.Logger({
  transports: [
          new (winston.transports.File)({
            name: 'info-file',
            filename: config.INFOLOGFILE,
            level: 'info'
          }),
          new (winston.transports.File)({
            name: 'error-file',
            filename: config.ERRORLOGFILE,
            level: 'error'
          })
      ],
  }) || console ;  
  

// Cron job to empty logger file every 24 hours
new cronJob(
    config.CRON_TIME, 
    emptyLogFile,
    null, 
    true, 
    config.CRON_TIMEZONE);

function emptyLogFile(){
  fs.writeFileSync(config.INFOLOGFILE,'');
  fs.writeFileSync(config.ERRORLOGFILE,'');
}


/**
 * Create server.
 */

var server, port;

if(config.isSSL){
  var privateKey  = fs.readFileSync('./config/key.pem'),
      certificate = fs.readFileSync('./config/key-cert.pem');
 
  if(!privateKey || !certificate) {
    logger.error("Invalid SSL config");  
  }

  credentials = {key: privateKey, cert: certificate},
  port = normalizePort(process.env.PORT || 443);
  app.set('port', port);
  server = https.createServer(credentials, app);
    console.log("server started on https://localhost:"+port);

}
else{
  port = normalizePort(process.env.PORT || 3000);
  app.set('port', port);
  server = http.createServer(app);
  console.log("server started on http://localhost:"+port);

}

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());


// CORS implementation
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', FDARouter);
router.defineRoutes(FDARouter);




/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    logger.log('Listening on ' + bind);
}
