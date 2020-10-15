const http = require('http');
const app = require('./app');

const port = process.env.port || 3000;

// creating the server with the https package
const server = http.createServer(app);

server.listen(port)   // server start listnening to the port and will execute the listner or  function that we passed to create a server 