'use strict';

/**
 * Initialise / met à jour le schéma de la base de données (Doctrine SchemaTool).
 * Équivalent de `php bin/console doctrine:schema:update --force`,
 * exécutable sans PHP système grâce au runtime embarqué.
 *
 * Usage : node setup-db.js
 */

const path = require('node:path');
const { Php, Request } = require('@platformatic/php-node');

const TOOLS = path.resolve(__dirname, 'tools');

const php = new Php({ docroot: TOOLS });

php
  .handleRequest(new Request({ url: 'http://localhost/setup-db.php' }))
  .then((response) => {
    const body = new TextDecoder().decode(response.body);
    console.log(body);
    if (response.status !== 200) {
      console.error('Échec (HTTP ' + response.status + ')');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Erreur :', err);
    process.exit(1);
  });
