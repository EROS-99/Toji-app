# TOJI — version auto-hébergée

Ce dossier contient tout ce qu'il faut pour héberger TOJI toi-même, avec de vraies notifications Android (grâce au service worker `sw.js`, impossible à faire tourner directement depuis une page d'artifact Claude).

## Déployer en 2 minutes avec Netlify (gratuit)

1. Va sur https://app.netlify.com/drop
2. Fais glisser **tout ce dossier** (les 5 fichiers : index.html, manifest.json, sw.js, icon-192.png, icon-512.png) dans la zone de dépôt.
3. Netlify te donne un lien du style `https://un-nom-aleatoire.netlify.app`.
4. Ouvre ce lien sur ton téléphone Android, installe-le comme avant ("Ajouter à l'écran d'accueil"), et active les notifications dans Réglages.

## Ce qui change par rapport à la version dans le chat

- Un vrai **service worker** (`sw.js`) est enregistré, ce qui permet à la notification de s'afficher correctement sur Android (la méthode utilisée avant ne fonctionne que sur PC).
- L'app est reconnue comme une vraie PWA installable (grâce à `manifest.json`), avec sa propre icône.
- Tes données restent en local sur l'appareil, comme avant — pense à exporter régulièrement depuis Réglages pour garder une sauvegarde.

## Important à savoir

Même avec cette version, Android peut encore arrêter l'app si elle reste fermée très longtemps ou si l'optimisation de batterie n'est pas désactivée pour elle (voir Réglages → Batterie → [nom de l'app] → "Pas d'optimisation"). Pour une fiabilité à 100 % même app totalement fermée pendant des jours, il faudrait un vrai serveur de notifications push — un projet plus lourd, à envisager seulement si cette version ne suffit pas.

## Renommer / changer de domaine plus tard

Si tu veux un nom de domaine personnalisé, Netlify permet d'en brancher un gratuitement (Domain settings → Add custom domain) une fois que tu en as acheté un (ex. chez Namecheap, OVH, etc.).
