'use strict';
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const debug = require('debug')('savjeecoin:blockchain');

//--------------------------------------------------------------//
//              ꧁𓊈𒆜 Classe Transaction 𒆜𓊉꧂               //
//-------------------------------------------------------------//

class Transaction {
  /**
   * @param {string} fromAddress
   * @param {string} toAddress
   * @param {number} amount
   */
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  /**
   * Crée un hash SHA256 de la transaction
   *
   * @returns {string}
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
      .digest('hex');
  }

  /**
   * Signe une transaction avec la clé de signature donnée 
   * (qui est une paire de clés elliptiques contenant une clé privée). 
   * La signature est ensuite stockée dans l'objet transaction et ultérieurement 
   * stockée sur la blockchain.
   *
   * @param {string} signingKey
   */
  sign(signingKey) {
// Vous ne pouvez envoyer une transaction que depuis le portefeuille lié à votre clé. 
// Nous vérifions donc ici si l'adresse d'envoi correspond à votre clé publique.
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error("Vous ne pouvez pas signer des transactions pour d'autres portefeuilles !");
    }

// Calculer le hash de cette transaction, la signer avec la clé
// et la stocker à l'intérieur de l'objet transaction
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signature = sig.toDER('hex');
  }

  /**
   * Vérifie si la signature est valide (la transaction n'a pas été modifiée). 
   * Elle utilise "fromAddress" comme clé publique.
   *
   * @returns {boolean}
   */
  isValid() {
// Si la transaction n'a pas d'adresse d'envoi (from address), 
// nous supposons qu'il s'agit d'une récompense de minage et que la transaction est valide. 
// Vous pourriez vérifier cela d'une autre manière (par exemple, en utilisant un champ spécial).
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('Pas de signature dans cette transaction !');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

//--------------------------------------------------------------//
//              ꧁𓊈𒆜 Classe Block 𒆜𓊉꧂                      //
//-------------------------------------------------------------//

class Block {
  /**
   * @param {number} timestamp
   * @param {Transaction[]} transactions
   * @param {string} previousHash
   */
  constructor(timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Renvoie le SHA256 de ce bloc 
   * (en traitant toutes les données stockées à l'intérieur de ce bloc)
   *
   * @returns {string}
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.previousHash +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce
      )
      .digest('hex');
  }

  /**
   * Démarre le processus de minage sur le bloc. Il modifie la "nonce" jusqu'à ce que 
   * le hachage du bloc commence par suffisamment de zéros (= difficulté).
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    debug(`Block miné: ${this.hash}`);
  }

  /**
   * Valide toutes les transactions contenues dans ce bloc (signature + hash) et
   * renvoie true si tout est conforme. False si le bloc est invalide.
   *
   * @returns {boolean}
   */
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

//--------------------------------------------------------------//
//              ꧁𓊈𒆜 Classe Blockchain 𒆜𓊉꧂                //
//-------------------------------------------------------------//

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  /**
   * @returns {Block}
   */
  createGenesisBlock() {
    return new Block(Date.parse('09-01-2009'), [], '0');
  }

  /**
   * Retourne le dernier bloc de notre chaîne. Utile lorsque vous souhaitez créer un 
   * nouveau bloc et que vous avez besoin du hachage du bloc précédent.
   *
   * @returns {Block[]}
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Prend toutes les transactions en attente, les met dans un bloc et commence le 
   * processus de minage. Il ajoute également une transaction pour envoyer la 
   * récompense de minage à l'adresse donnée.
   *
   * @param {string} miningRewardAddress
   */
  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    debug('Bloc miné avec succès !');
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  /**
   * Ajoute une nouvelle transaction à la liste des transactions en attente (à ajouter
   * la prochaine fois que le processus de minage démarre). 
   * Cela vérifie que la transaction donnée est correctement signée.
   *
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("La transaction doit inclure l'adresse d'envoi (from) et de réception (to)");
    }

    // Verifier la transaction
    if (!transaction.isValid()) {
      throw new Error("Impossible d'ajouter une transaction invalide à la blockchain");
    }

    if (transaction.amount <= 0) {
      throw new Error('La transaction doit être supérieur à 0');
    }

    // Veillez à ce que le montant envoyé ne soit pas supérieur au solde existant.
    const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
    if (walletBalance < transaction.amount) {
      throw new Error('Solde insuffisant !');
    }

    // Obtenir toutes les autres transactions en attente pour le portefeuille "from"
    const pendingTxForWallet = this.pendingTransactions.filter(
      tx => tx.fromAddress === transaction.fromAddress
    );

    // Si le portefeuille a plus de transactions en attente, calculez le montant 
    // total des pièces dépensées jusqu'à présent. Si cela dépasse le solde, 
    // nous refusons d'ajouter cette transaction.
    if (pendingTxForWallet.length > 0) {
      const totalPendingAmount = pendingTxForWallet
        .map(tx => tx.amount)
        .reduce((prev, curr) => prev + curr);

      const totalAmount = totalPendingAmount + transaction.amount;
      if (totalAmount > walletBalance) {
        throw new Error(
          'Les transactions en attente pour ce portefeuille sont supérieures à son solde.'
        );
      }
    }

    this.pendingTransactions.push(transaction);
    debug('Transaction ajoutée: %s', transaction);
  }

  /**
   * Retourne le solde d'une adresse de portefeuille donnée.
   *
   * @param {string} address
   * @returns {number} Le solde du wallet
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    debug("Obtenir le solde d'une adresse : %s", balance);
    return balance;
  }

  /**
   * Retourne une liste de toutes les transactions qui ont eu lieu 
   * vers et depuis l'adresse de portefeuille donnée.
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    debug('Obtenir le nombre de transactions pour un portefeuille donné : %s', txs.length);
    return txs;
  }

  /**
   * Parcourt tous les blocs de la chaîne et vérifie s'ils sont correctement liés 
   * entre eux et si personne n'a altéré les hachages. En vérifiant les blocs, 
   * cela vérifie également les transactions (signées) à l'intérieur d'eux.
   *
   * @returns {boolean}
   */
  isChainValid() {
    // Vérifie si le bloc Genesis n'a pas été altéré en comparant la sortie de 
    // createGenesisBlock avec le premier bloc de notre chaîne.
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Vérifie les blocs restants de la chaîne pour voir si leurs hachages et 
    // signatures sont corrects.
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;