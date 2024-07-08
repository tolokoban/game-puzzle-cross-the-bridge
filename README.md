# Convent Puzzle

-   Source: Sam Loyd's cyclopedia (page 74)

## Énoncé

Les dortoirs d'un couvent sont formés de 16 chambres réparties sur deux étages.

```text
Étage 1    Étage 2

+-+-+-+    +-+-+-+
|a|b|c|    |A|B|C|
+-+-+-+    +-+-+-+
|d| |e|    |D| |E|
+-+-+-+    +-+-+-+
|f|g|h|    |F|G|H|
+-+-+-+    +-+-+-+
```

Il faut donc répartir les dormeurs de façon à respecter les règles suivantes :

-   Aucune chambre **ne peut être vide**.
-   Il y a exactement **deux fois plus** de dormeurs au deuxième étage qu'au premier.
-   Il y a exactement **11 dormeurs** par face du bâtiment.

Pour préciser cette dernière règle, voici la répartition des chambres par face :

-   Nord : `a, b, c, A, B, C`.
-   Est : `c, e, h, C, E, H`.
-   Sud : `f, g, h, F, G, H`.
-   Ouest : `a, d, f, A, D, F`.

Le but de cete énigme est de trouver une répartition qui convienne.  
Ensuite, on retire **9 dormeurs** et on doit les répartir en suivant les même règles.
