# Projet : Gagne ton Papa – Web Solo

## Objectif

Créer une application web permettant de jouer **en solo contre un chronomètre** au jeu de réflexion inspiré de "Gagne ton Papa".

Le joueur doit remplir une zone du plateau avec des pièces géométriques en utilisant toutes les pièces disponibles.

Le jeu est basé sur une progression de puzzles appelés **Pentas**.

---

# Fonctionnement du jeu

## Objectif du joueur

Remplir complètement la zone active du plateau en utilisant toutes les pièces.

Le joueur tente de résoudre les puzzles **le plus rapidement possible**.

---

# Progression

Le jeu contient 4 niveaux successifs :

| Niveau | Nom | Largeur | Hauteur |
|------|------|------|------|
| 1 | Penta 3 | 3 | 5 |
| 2 | Penta 4 | 4 | 5 |
| 3 | Penta 5 | 5 | 5 |
| 4 | Penta 6 | 6 | 5 |

Chaque niveau :

- agrandit la zone du plateau
- ajoute une nouvelle pièce

---

# Règles de placement

Une pièce peut être placée seulement si :

- elle reste dans la zone du plateau
- elle ne chevauche aucune autre pièce
- elle est alignée sur la grille

Les pièces peuvent être :

- déplacées
- tournées (rotation 90°)

Le miroir n'est **pas autorisé**.

---

# Condition de victoire

Un puzzle est validé lorsque :

- toutes les cases du plateau sont remplies
- aucune pièce ne dépasse
- toutes les pièces sont utilisées

Lorsque le puzzle est complété :

- passer automatiquement au niveau suivant
- conserver le chronomètre

---

# Chronomètre

Le chrono démarre :

> au premier déplacement de pièce

Le chrono s'arrête lorsque le **Penta 6 est complété**.
