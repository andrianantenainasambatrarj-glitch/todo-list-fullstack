'use strict';

/**
 * Serveur HTTP pour le backend Symfony, propulsé par PHP 8.4 embarqué
 * (@platformatic/php-node). Utile quand PHP/Composer ne sont pas installés.
 *
 * Usage : node server.js  (PORT=8000 par défaut)
 */

const http = require('node:http');
const path = require('node:path');
const { Php, Request, Headers, Rewriter } = require('@platformatic/php-node');

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';
const DOCROOT = path.resolve(__dirname, '..', 'public');

// Toute requête dont le chemin ne correspond pas à un fichier existant
// est réécrite vers /index.php (équivalent du .htaccess Symfony).
const rewriter = new Rewriter([
  {
    conditions: [{ type: 'not_exists' }],
    rewriters: [{ type: 'path', args: ['^(.*)$', '/index.php'] }],
  },
]);

const php = new Php({
  docroot: DOCROOT,
  rewriter,
});

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('error', (err) => {
    res.statusCode = 400;
    res.end(String(err));
  });
  req.on('end', async () => {
    try {
      const headers = new Headers();
      for (let i = 0; i < req.rawHeaders.length; i += 2) {
        headers.add(req.rawHeaders[i], req.rawHeaders[i + 1]);
      }

      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const hostHeader = req.headers.host || `localhost:${PORT}`;

      const phpRequest = new Request({
        method: req.method,
        url: `http://${hostHeader}${req.url}`,
        headers,
        body,
        socket: {
          localAddress: req.socket.localAddress || '127.0.0.1',
          localPort: req.socket.localPort || PORT,
          localFamily: req.socket.localFamily || 'IPv4',
          remoteAddress: req.socket.remoteAddress || '127.0.0.1',
          remotePort: req.socket.remotePort || 0,
          remoteFamily: req.socket.remoteFamily || 'IPv4',
        },
      });

      const response = await php.handleRequest(phpRequest);

      const log = response.log;
      if (log && log.length) {
        process.stderr.write(log);
      }

      res.statusCode = response.status;
      for (const [name, value] of response.headers.entries()) {
        res.appendHeader(name, value);
      }
      res.end(Buffer.from(response.body));
    } catch (err) {
      console.error('Erreur PHP :', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify({ error: 'Internal PHP runtime error', detail: String(err && err.message || err) }));
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Backend Symfony (PHP embarqué) : http://${HOST}:${PORT} — docroot ${DOCROOT}`);
});
