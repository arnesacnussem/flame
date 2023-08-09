require('dotenv').config();
const http = require('http');

// Database
const { connectDB } = require('./db');
const associateModels = require('./models/associateModels');

// Server
const api = require('./api');
const jobs = require('./utils/jobs');
const Socket = require('./Socket');
const Sockets = require('./Sockets');

// Utils
const initApp = require('./utils/init');
const Logger = require('./utils/Logger');
const logger = new Logger();

if (process.env.REVERSE_PROXY_AUTH_HEADER?.trim() === '') {
  logger.log('Environment variable REVERSE_PROXY_AUTH_HEADER should not be blank string, which will cause this app malfunction.',"ERROR");
  return;
}else{
  logger.log('You have enabled authenticate by header, please make sure you have set up the reverse proxy properly!','WARN')
}

(async () => {
  const PORT = process.env.PORT || 5005;

  // Init app
  await initApp();
  await connectDB();
  await associateModels();
  await jobs();

  // Create server for Express API and WebSockets
  const server = http.createServer();
  server.on('request', api);

  // Register weatherSocket
  const weatherSocket = new Socket(server);
  Sockets.registerSocket('weather', weatherSocket);

  server.listen(PORT, () => {
    logger.log(
      `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
})();
