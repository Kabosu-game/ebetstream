# EBETSTREAM ARENA

## Document explicatif simple et clair

## 1) C'est quoi EBETSTREAM ARENA ?

`EBETSTREAM ARENA` est un jeu d'arene competitif multijoueur ou 10 joueurs s'affrontent.

Les joueurs sont divises en deux equipes :
- Equipe Rouge : 5 joueurs
- Equipe Bleue : 5 joueurs

Leur objectif est de controler des zones pour gagner des points.

Un match dure environ **5 a 8 minutes**.

L'equipe gagnante recoit les gains, les points et les recompenses.
Les spectateurs peuvent regarder et parier sur le resultat.

## 2) Comment se deroule un match (exemple simple)

La carte contient 3 zones principales :
- Zone A
- Zone B
- Zone C

Les equipes doivent capturer ces zones et les conserver.

Exemple :
- L'Equipe Rouge capture la Zone A : **+10 points**
- L'Equipe Rouge garde la zone : **+1 point par seconde**
- L'Equipe Bleue reprend la zone : elle gagne les points de controle ensuite

## 3) Comment un joueur joue

Chaque joueur controle un personnage qui peut :
- courir
- tirer
- defendre
- capturer des zones

Controles mobiles (simples) :
- joystick gauche : bouger
- bouton droit : tirer
- bouton special : pouvoir special

## 4) Comment une equipe gagne

Une equipe gagne si :
- elle atteint **100 points**
- ou elle a plus de points a la fin du temps

## 5) Comment les paris fonctionnent

Avant le match, un joueur ou un spectateur peut parier.

Exemple :
> "Je parie 10 EbetCoin que l'Equipe Rouge gagne."

Le systeme bloque automatiquement les fonds.

Si Rouge gagne, le parieur recoit son gain.
Si Rouge perd, le pari est perdu.

Tout le processus est automatique et gere par le serveur.

## 6) Comment le jeu sera cree (version simple)

Le developpement se fait en 5 grandes etapes.

### Etape 1 - Creer le personnage
- creation du personnage
- marche
- course
- tir

### Etape 2 - Creer la carte
- creation d'un terrain
- ajout de 3 zones capturables

### Etape 3 - Connecter les joueurs en ligne
- creation du serveur multijoueur
- connexion des joueurs (jusqu'a 10)

### Etape 4 - Ajouter le systeme de score
- calcul des points
- determination du vainqueur

### Etape 5 - Ajouter les paris
- reception des paris
- blocage des fonds
- paiement automatique des gains

## 7) Ce que le developpeur va utiliser

Technologie principale :
- **Unity** pour creer le personnage, la carte et le gameplay
- **Serveur backend** pour connecter les joueurs et valider les resultats

## 8) Version 1 du jeu (MVP)

La premiere version doit inclure uniquement :
- 1 carte
- 1 mode 5 vs 5
- deplacement
- tir
- capture de zones
- systeme de score

Objectif MVP : version fonctionnelle, sans exiger des graphismes parfaits.

## 9) Exemple visuel simple

```
        Zone A
      Rouge  Bleu

Zone B            Zone C
 Bleu             Rouge
```

Les deux equipes se battent pour prendre et garder les zones.

## 10) Objectif final

Creer un ecosysteme complet ou :
- les joueurs jouent
- les spectateurs regardent
- les spectateurs parient
- EBETSTREAM gagne une commission sur les paris

## 11) Ce que l'equipe doit faire en premier (ordre exact)

1. Creer le personnage
2. Creer une carte simple
3. Permettre a 2 joueurs de se connecter
4. Ajouter le tir
5. Ajouter les zones
6. Ajouter le score
7. Passer a 10 joueurs
8. Ajouter les paris

## 12) Temps realiste

- Prototype simple : **2 a 3 mois**
- Version jouable : **6 mois**
- Version complete : **12 mois**

## 13) Resume en une phrase

`EBETSTREAM ARENA` est un jeu ou 10 joueurs se battent pour controler des zones, pendant que les spectateurs peuvent parier, avec un systeme entierement controle par le serveur et une monetisation via commission.
