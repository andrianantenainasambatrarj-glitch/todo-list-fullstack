<?php

/**
 * Crée / met à jour le schéma de base de données à partir des entités Doctrine.
 * Ce script n'est PAS exposé publiquement : il vit hors de public/ et n'est
 * accessible que via `node setup-db.js`.
 */

use App\Kernel;
use Doctrine\ORM\Tools\SchemaTool;

require dirname(__DIR__, 2) . '/vendor/autoload.php';

(new Symfony\Component\Dotenv\Dotenv())->bootEnv(dirname(__DIR__, 2) . '/.env');

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

$em = $kernel->getContainer()->get('doctrine')->getManager();
$metadata = $em->getMetadataFactory()->getAllMetadata();

if (empty($metadata)) {
    http_response_code(500);
    echo "Aucune entité Doctrine trouvée.\n";
    exit;
}

$tool = new SchemaTool($em);
$sqls = $tool->getUpdateSchemaSql($metadata);

if (empty($sqls)) {
    echo "Le schéma est déjà à jour.\n";
} else {
    $tool->updateSchema($metadata);
    echo "Schéma mis à jour (" . count($sqls) . " requête(s)) :\n";
    foreach ($sqls as $sql) {
        echo "  - " . $sql . "\n";
    }
}

echo "Base de données : OK\n";
