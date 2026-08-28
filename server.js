const fs = require('fs');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Captura todos os erros e escreve num arquivo para podermos debugar o 503
process.on('uncaughtException', (err) => {
  fs.appendFileSync('passenger-error.log', 'Uncaught Exception: ' + err.stack + '\n');
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  fs.appendFileSync('passenger-error.log', 'Unhandled Rejection: ' + reason + '\n');
});

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

try {
  const app = next({ dev, hostname, port: typeof port === 'string' && port.includes('sock') ? 3000 : parseInt(port, 10) || 3000 });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        fs.appendFileSync('passenger-error.log', 'Request error: ' + err.stack + '\n');
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, (err) => {
      if (err) {
        fs.appendFileSync('passenger-error.log', 'Listen error: ' + err.stack + '\n');
        throw err;
      }
      fs.appendFileSync('passenger-error.log', `> Ready on http://${hostname}:${port}\n`);
    });
  }).catch(err => {
    fs.appendFileSync('passenger-error.log', 'App prepare error: ' + err.stack + '\n');
  });
} catch (err) {
  fs.appendFileSync('passenger-error.log', 'Startup error: ' + err.stack + '\n');
}
