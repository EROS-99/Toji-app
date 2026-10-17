# TOJI

TOJI est une application web de suivi d'entraînement. Elle fonctionne sur téléphone et ordinateur, s'installe sur l'écran d'accueil comme une application, et reste utilisable hors ligne avec les dernières données synchronisées.

## Fonctionnalités

**Entraînement**
- Accueil avec la séance du jour et le bouton « Séance faite aujourd'hui ».
- Séance : saisie des répétitions ou des secondes, minuteur de repos, exercices chronométrés.
- Catalogue : exercices classés par zone, exercices personnalisés, séances composées (3 zones, 2 exercices par zone).
- Historique des séances, avec rattrapage d'une séance passée et jours de voyage (saut).

**Rapport**
- Vue Semaine ou Mois, avec séances faites, séances manquées et total d'un exercice choisi (gainage par défaut, ou n'importe quel exercice du catalogue).
- Progression par exercice, comparée à la période précédente, et graphiques par exercice.

**Réglages**
- Programme par jour de la semaine, rappels, thème clair ou sombre.
- Huit palettes de couleurs au choix.
- Nom de l'application, photo de fond (stockée uniquement sur le téléphone).
- Export et import des données, resynchronisation depuis le compte.

**Compte et synchronisation**
- Connexion par email et mot de passe, avec un pseudo affiché dans l'app.
- Les séances, réglages et exercices sont sauvegardés dans le compte et accessibles depuis n'importe quel appareil.
- Les données locales sont liées au compte qui les a créées : elles sont effacées si un autre compte se connecte sur le même téléphone.

**Défis entre amis**
- Envoi d'un défi à un ami par pseudo exact. Aucune liste de comptes n'est visible.
- Formats : total de répétitions, maximum en une série, pyramide descendante, tours complets.
- Exercice au choix dans le catalogue, ou exercice libre avec description des gestes et lien de référence facultatif.
- L'ami accepte ou refuse, puis chacun saisit son score. Le gagnant s'affiche quand les deux scores sont enregistrés.
- Délai de 48 heures : un défi accepté non terminé à temps est marqué comme expiré.
- Mise à jour en temps réel, avec un filet de sécurité toutes les 10 secondes quand l'onglet est ouvert.
- Notification push quand un défi est reçu, même si l'application est fermée (après autorisation).

## Structure du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | L'application complète (interface, logique, styles). |
| `sw.js` | Service worker : mode hors ligne, cache et réception des notifications. |
| `manifest.json` | Informations d'installation (nom, icônes, couleurs). |
| `icon-192.png`, `icon-512.png` | Icônes de l'application. |
| `favicon.svg` | Icône de l'onglet du navigateur. |
| `privacy.html` | Politique de confidentialité. |
| `terms.html` | Conditions d'utilisation. |
| `notify-challenge.ts` | Fonction serveur (Supabase Edge Function) qui envoie les notifications de défi. Elle n'est pas servie par le site, elle est déployée dans Supabase. |

## Mise en ligne

L'application est publiée avec GitHub Pages, depuis la branche `main` du dépôt.

1. Mets à jour les fichiers du dépôt (ou remplace-les un par un).
2. Incrémente la version du cache dans `sw.js` (la ligne `CACHE_NAME`, par exemple `toji-cache-v11` devient `toji-cache-v12`). Sans ce changement, les téléphones peuvent garder une ancienne version.
3. Commit sur `main`, attends quelques instants, puis ferme et rouvre l'application deux fois.

Adresse publique : https://eros-99.github.io/Toji-app/

## Base de données (Supabase)

Le projet Supabase contient :

- **Tables** : `profiles` (pseudos), `sessions`, `settings`, `custom_exercises`, `challenges` (défis) et `push_subscriptions` (appareils abonnés aux notifications).
- **Fonctions** : `find_user_by_username` (recherche d'un pseudo exact, réservée aux comptes connectés) et `usernames_for` (pseudos des participants à un de tes défis).
- **Règles de sécurité (RLS)** : chaque utilisateur ne lit et ne modifie que ses propres données. Les défis sont protégés par un garde-fou qui empêche de modifier le contenu d'un défi après l'envoi, de saisir un score pour l'autre joueur, ou de dépasser la deadline.
- **Temps réel** : la table `challenges` est publiée sur le canal temps réel de Supabase.
- **Fonction `notify-challenge`** : elle vérifie que l'appelant est connecté et qu'il est bien l'auteur du défi, puis envoie la notification aux appareils du destinataire.
- **Secrets de la fonction** : `VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY`. La clé privée ne doit jamais être publiée dans le dépôt.

## Notifications

- Android : fonctionne dans Chrome après autorisation.
- iPhone : l'application doit être installée sur l'écran d'accueil (depuis Safari, Partager, « Sur l'écran d'accueil »), avec iOS 16.4 ou plus récent.

## Limites connues

- Les scores des défis sont déclaratifs : chaque joueur saisit le sien, il n'existe pas de vérification automatique.
- Une fois un score saisi, il ne peut plus être modifié dans l'app.
- Les séances et réglages locaux ne sont pas partagés entre deux comptes sur un même téléphone.

## Confidentialité

Les données sont hébergées chez Supabase et la publication se fait via GitHub Pages. TOJI n'utilise ni publicité ni outil de mesure d'audience. Le détail est dans `privacy.html`.
