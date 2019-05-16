const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs-extra');

const uri = 'https://localhost';
const port = 3000;

const app = express();

const root = path.join(__dirname, '/');

const apiProxy = proxy('/api', {
  target: `${uri}:${port + 1}`,
  changeOrigin: true,
  secure: false,
});

app.use(apiProxy);

app.use(express.static(root));

app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html') && !req.is('json') && !req.path.includes('.')) {
    res.sendFile('index.html', { root });
  } else next();
});

app.set('port', port);

/**
 * Create HTTPs server.
 */
const options = {
  key: fs.readFileSync('./private_access/server.key'),
  cert: fs.readFileSync('./private_access/server.crt'),
};

/**
 * Create HTTPs server using the options
 */
const server = https.createServer(options, app);

server.listen(port);
