'use strict';
const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Votre clé privée est ici que vous avez généré avec le fichier keygenerator.js
const myKey = ec.keyFromPrivate(
  '569709eeffc13255048387b2d723d3da8bb24f2cd5cdb601ca304a747dd82b33'
);

// À partir de là, nous pouvons calculer votre clé publique (qui sert également d'adresse de portefeuille)
const myWalletAddress = myKey.getPublic('hex');

// Créer une nouvelle instance de la classe Blockchain
const ceZarCoin = new Blockchain();

// Miner le premier bloc
ceZarCoin.minePendingTransactions(myWalletAddress);

// Créer une transaction et la signer avec votre clé
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.sign(myKey);
ceZarCoin.addTransaction(tx1);

// Miner le bloc
ceZarCoin.minePendingTransactions(myWalletAddress);

// Créer une deuxième transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.sign(myKey);
ceZarCoin.addTransaction(tx2);

// Miner le bloc
ceZarCoin.minePendingTransactions(myWalletAddress);

console.log();
console.log(
`Le solde de Maxence est ${ceZarCoin.getBalanceOfAddress(myWalletAddress)}`
);

// Décommentez cette ligne si vous souhaitez tester la falsification de la chaîne
// ceZarCoin.chain[1].transactions[0].amount = 10;

// Vérifier si la chaîne est valide
console.log();
console.log('La Blockchain est valide?', ceZarCoin.isChainValid() ? 'Oui' : 'Non');