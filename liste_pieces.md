# Documentation des Pièces du Jeu

Ce document référence l'ensemble des pièces disponibles dans le jeu, classées par taille (Pentaminos, Tétraminos, Miniminos). 

Chaque pièce est modélisée par une matrice en deux dimensions (tableau de tableaux). Dans ces matrices :
* `1` représente un bloc solide.
* `0` représente un espace vide (transparent).

---

## 1. Les 7 Pentaminos (5 blocs)

### Pièce 2
* **Couleur :** Orange
* **Forme :** L
* **Dimensions :** 2x4
```json
[
  [1, 0],
  [1, 0],
  [1, 0],
  [1, 1]
]
