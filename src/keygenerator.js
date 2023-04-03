'use strict';
const EC = require('elliptic').ec;

// Vous pouvez utiliser n'importe quelle courbe elliptique
const ec = new EC('secp256k1');

// Générer une nouvelle paire de clés et les convertir en chaînes hexadécimales
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

// Afficher les clés dans la console
console.log();
console.log(
'Votre clé publique (également votre adresse de portefeuille, librement partageable)\n',
publicKey
);

console.log();
console.log(
'Votre clé privée (gardez-la secrète ! Pour signer des transactions)\n',
privateKey
);