<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/8qK310p.png" alt="Project logo"></a>
</p>

<h3 align="center">ceZarCoin Frontend</h3>

<div align="center">



</div>

---


Application Angular qui vous permet d'interagir avec une blockchain. Vous pouvez voir les blocs sur la chaîne, voir les transactions qui s'y trouvent et même créer de nouvelles transactions et miner des blocs.
<br/>Construit sur la base du [ABCoin](https://github.com/Savjee/SavjeeCoin) (une implémentation de blockchain simple en JavaScript).

## 🖥️ Démo en direct
**[Voir ici.](https://savjee.github.io/savjeecoin-frontend/)** Vous pouvez créer des transactions, miner des blocs et explorer votre propre blockchain.

## 🏁 Installation <a name = "getting_started"></a>
Obtenez une copie du front-end de ABCoin en cours d'exécution sur votre machine locale (pour jouer, tester ou développer).

```
git clone https://github.com/Savjee/savjeecoin-frontend.git
```

Installez les dépendances :
```
cd savjeecoin-frontend
npm install
```

Exécutez l'application :

```
npm start
```

À ce stade, l'application doit fonctionner sur votre machine sur [http://localhost:4200](http://localhost:4200)


## 📸 Screenshots

**Page d'accueil :** Voir les blocs sur la chaîne et explorer les transactions dans chaque bloc.<br/>
<br/>![](https://savjee.github.io/savjeecoin-frontend/assets/screenshots/blockchain-overview.png)

**Créer de nouvelles transactions :** Vous pouvez créer de nouvelles transactions vers n'importe quel portefeuille pour n'importe quel montant (sans validation). Les nouvelles transactions seront ajoutées aux "transactions en attente", prêtes à être incluses dans le prochain bloc.
<br/><br/>![](https://savjee.github.io/savjeecoin-frontend/assets/screenshots/create-new-transactions.png)

**Transactions en attente :** Liste de toutes les transactions en attente. Celles-ci seront incluses dans le prochain bloc lorsque le processus de minage commencera.
<br/><br/>![](https://savjee.github.io/savjeecoin-frontend/assets/screenshots/pending-transactions.png)

**Détails du portefeuille :** Vous pouvez cliquer sur n'importe quelle adresse de portefeuille et voir un aperçu de ce portefeuille : son solde actuel et toutes les transactions vers/depuis ce portefeuille.
<br/><br/>![](https://savjee.github.io/savjeecoin-frontend/assets/screenshots/wallet-details.png)
<br/><br/>
*⚠️Ceci est à des fins éducatives seulement. Ce n'est en aucun cas une implémentation complète de blockchain (ni ne vise à en être une). J'utilise cela pour apprendre le fonctionnent des blockchains.*
