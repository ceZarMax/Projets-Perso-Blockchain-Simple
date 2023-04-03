// Importer la fonction SHA256 de ma bibliothèque cypto-js
const SHA256 = require('crypto-js/sha256');
const localtime = require('localtime');


//--------------------------------------------------------------//
//              ꧁𓊈𒆜 Classe Block 𒆜𓊉꧂                      //
//-------------------------------------------------------------//

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index; // Option permettant de situer le block dans la blockchain
        this.timestamp = localtime( '' ,'DD/MM/YYYY hh:mm:ss'); // Permet de nous dire quand a été crée le block
        this.data = data; // Toute les datas et détails que l'on veut associer à ce block (Argent transféré, Émetteur, Récepteur)
        this.previousHash = previousHash; // Contient le hash du dernier block qui précède celui-ci
        this.hash = this.calculateHash(); // Contient le hash de notre block, calcul le hash du block
        this.nonce = 0; // Valeur du nonce : il s'agit d'un nombre aléatoire (utilisé en cryptographie) qui n'a rien à voir avec notre bloc, mais qui peut être modifié 
        activate
    }

    calculateHash(){ // Méthode : Calcul le hash du block d'en haut
        return SHA256(this.index + this.previousHash + this.timestamp + /* Convertir un objet JS en chaine */ JSON.stringify(this.data) + this.nonce).toString(); // Prendre la sortie du SHA256 
        // et convertir de force en chaine

    }

    // Limiter le spam sur notre blockchain de création de block en ajoutant de la difficulté
    // Eviter un probleme de sécurité : Changer le contenu d'un bloc et recalculer son hash pour tous les blocs qui succède et précède et se retrouver avec une chain valide
    // POW : Prouver que le mineur a mis beaucoup de puissance de calcul dans la création d'un bloc
    // BTC nécessite le hachage d'un bloc pour commencer avec un certain nombre de zéros. Cela permet de NE PAS influencer la sortie de la fonction de hachage
    // Vous devez essayer beaucoup de combinaisons et espérer etre le premier qui a un nombre suffisant de zéros devant le hash

    // Difficulty : permet qu'il y ait une quantité constante de nouveaux blocks. Ex Bitcoin : Nouveau block toutes les 10 minutes
    mineBlock(difficulty){ // Méthode : Miner un block
        console.log("Le block mine à : " + this.timestamp); 
        // Boucle tant que : Faire en sorte que le hachage de notre bloc commence par un certain nombre de zéros
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){//join c'est joindre les caractères dans un tableau et renvoie sous forme de chaines
            // Sous chaine : extraire des caractères d'une chaine 
        // Exemple Si diff est 4, alors prendre les 4 premiers caractères de notre hash tant que la longueur de notre hash n'est pas égal à tout les zéros
        // C'est une astuce rapide pour faire une chaîne de zéros qui est exactement la longueur de la difficulté.
            this.nonce++; // Incrémenter le nonce 1 par 1 aussi longtemps que notre hash ne commence pas par un nombre suffisant de zéros.
            this.hash = this.calculateHash(); // Calculer le hash de ce block
            
                
        } 
        console.log("Le block est miné: " + this.hash);
    }
}

//--------------------------------------------------------------//
//              ꧁𓊈𒆜 Classe BlockChain 𒆜𓊉꧂                 //
//-------------------------------------------------------------//

class Blockchain{
    constructor(){ // Constructeur : Méthode spéciale utilisée pour initialiser des objets
        this.chain = [this.createGenesisBlock()]; // Création d'un tableau de block avec l'initialisation de notre genesis block
        this.difficulty = 4; // Difficulté du minage d'un block
    }

    createGenesisBlock(){ // Méthode : Création du block de départ ajouté manuellement
        return new Block(0, "17/10/2022", "Genesis Block (le début)", "0");

    }

    getLatestBlock(){ // Méthode : Retourner le dernier block sur la blockchain
        return this.chain[this.chain.length - 1]; // Retourner le dernier élément de la "chain"
    }

    addBlock(newBlock){ // Méthode : Création d'un nouveau block
        newBlock.previousHash = this.getLatestBlock().hash; // Le nouveau block contient le hash du block précédent = retourne le dernier block et sera hashé
        newBlock.mineBlock(this.difficulty); // Ce nouveau block aura pour objet mineBlock permettant de miner celui-ci
        //newBlock.hash = newBlock.calculateHash(); // Recalculer le hash du nouveau block (chaque nouveau block, il faut recalculer un hash pour le block suivant)
        this.chain.push(newBlock); // Ajouter un nouvel élément "newBlock" à la fin de notre tableau "chain"

    }

    isChainValid(){ // Méthode : Vérifier si la chain est valide et faux si quelque chose ne va pas

        for(let i = 1 /* i = index = 1 */; i < this.chain.length; i++){
            const currentBlock = this.chain[i]; // Récupérer le block actuel avec la position de i dans la "chain"
            const previousBlock = this.chain[i - 1]; // Récupérer le block précédent avec la position de i - 1 dans la "chain"

            if(currentBlock.hash != currentBlock.calculateHash()){ // Check si le block est relié entre eux et est valide
                // Si le hash de notre block actuel n'est pas égal au calcul du hash de notre block actuel, alors c'est faux
                return "Erreur de lien :  Même hash que le bloc précédent et/ou calcul du hash";
            }
                // Vérifier si notre block actuel pointe bien vers le block précédent
            if(currentBlock.previousHash != previousBlock.hash){ // Vérifier que le hachage précédent est correctement défini :
                // Si notre block actuel a un hachage précédent qui n'est pas égal au hachage de notre block précédent, retourner false
                
                return "Erreur : Le hachage du block précédent n'est pas égal au previousHash de CE block";
            }
        }

        return "La blockchain est en orde !"      

    }

}

//--------------------------------------------------------------//
//              ꧁𓊈𒆜 Partie Test 𒆜𓊉꧂                       //
//-------------------------------------------------------------//


let ABChain = new Blockchain(); // Créer variable ABChain qui représentera une nouvelle blockchain
