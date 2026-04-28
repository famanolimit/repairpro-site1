# 🚀 Mettre RepairPro en ligne — Guide pas à pas

Ce guide vous accompagne **étape par étape**, sans aucune connaissance technique requise.
**Temps total : 30 à 45 minutes.** **Coût : ~7€ pour le nom de domaine.**

---

## 📋 Vue d'ensemble — ce qu'on va faire

1. **Configurer Formspree** (5 min) → pour recevoir les demandes par email
2. **Mettre le code dans le projet** (2 min)
3. **Créer un compte GitHub** (5 min) → pour stocker le code
4. **Mettre le site en ligne avec Vercel** (10 min) → c'est gratuit
5. **Acheter un nom de domaine** (10 min) → environ 7€/an
6. **Brancher le domaine au site** (10 min)

À la fin, vous aurez : un site accessible 24h/24, un domaine professionnel, et toutes les demandes de RDV qui arrivent dans votre boîte mail Gmail.

---

## ÉTAPE 1 — Configurer Formspree (5 min)

Formspree est le service qui va transformer chaque demande de devis en email reçu sur **ixititoure@gmail.com**.

### 1.1 — Créez un compte gratuit

- Allez sur **https://formspree.io**
- Cliquez sur **« Sign up »** en haut à droite
- Inscrivez-vous avec votre email **ixititoure@gmail.com** et un mot de passe
- Confirmez l'inscription en cliquant sur le lien envoyé dans votre boîte mail

### 1.2 — Créez votre formulaire

- Une fois connecté, cliquez sur **« + New Form »** (ou « New Project » selon l'interface)
- Donnez-lui un nom : **`RepairPro - Demandes de devis`**
- Pour l'email de réception, mettez **`ixititoure@gmail.com`**
- Cliquez sur **« Create Form »**

### 1.3 — Récupérez votre identifiant

Sur la page de votre formulaire, vous verrez un lien qui ressemble à :

```
https://formspree.io/f/xpzgkqer
```

**Copiez la partie après `/f/`** (dans l'exemple : `xpzgkqer`). C'est votre **ID Formspree**, gardez-le sous la main pour l'étape 2.

### 1.4 — Modifiez le code

Ouvrez le fichier **`src/App.jsx`** dans votre projet. Cherchez cette ligne (vers la ligne 408) :

```javascript
const FORMSPREE_ID = "VOTRE_ID_FORMSPREE";
```

Remplacez **`VOTRE_ID_FORMSPREE`** par l'ID que vous venez de copier. Exemple :

```javascript
const FORMSPREE_ID = "xpzgkqer";
```

Sauvegardez le fichier. ✅

> 💡 **Bon à savoir** : la formule gratuite de Formspree autorise 50 demandes par mois. Largement suffisant pour démarrer. Si vous dépassez, il y a une formule à 8€/mois.

---

## ÉTAPE 2 — Tester le site sur votre ordinateur (5 min)

Avant de mettre en ligne, on vérifie que tout fonctionne en local.

### 2.1 — Installez Node.js

Si ce n'est pas déjà fait, téléchargez Node.js sur **https://nodejs.org** (prenez la version LTS, le bouton de gauche).
Installez-le en cliquant sur Suivant > Suivant > Terminer.

### 2.2 — Ouvrez un terminal dans le dossier du projet

**Sur Windows** : ouvrez le dossier du projet, puis dans la barre d'adresse de l'explorateur, tapez `cmd` et appuyez sur Entrée.

**Sur Mac** : ouvrez le dossier dans le Finder, faites clic droit > « Ouvrir le dossier dans le Terminal ».

### 2.3 — Installez les dépendances et lancez le site

Tapez dans le terminal :

```bash
npm install
```

Patientez (1-2 min). Puis :

```bash
npm run dev
```

Une adresse va s'afficher du genre `http://localhost:5173`. Ouvrez-la dans votre navigateur. **Votre site doit s'afficher !**

Faites un test : cliquez sur « Devis instantané », allez jusqu'au bout, et vérifiez que vous recevez bien un email sur ixititoure@gmail.com. Si oui : ✅ on peut continuer.

Pour arrêter le site local, faites `Ctrl + C` dans le terminal.

---

## ÉTAPE 3 — Créer un compte GitHub (5 min)

GitHub est l'endroit où on va stocker le code, pour que Vercel puisse le récupérer.

- Allez sur **https://github.com**
- Cliquez sur **« Sign up »**
- Créez un compte avec votre email **ixititoure@gmail.com**
- Validez l'email reçu

### 3.1 — Créez un nouveau dépôt (« repository »)

- Une fois connecté, cliquez sur le **`+`** en haut à droite > **« New repository »**
- Nom du repo : **`repairpro-site`**
- Laissez en **Public**
- **NE COCHEZ RIEN d'autre** (pas de README, pas de .gitignore)
- Cliquez sur **« Create repository »**

GitHub vous affiche maintenant des instructions. **Gardez cette page ouverte**, on va y revenir.

### 3.2 — Installez GitHub Desktop (le plus simple pour un débutant)

- Téléchargez **GitHub Desktop** sur **https://desktop.github.com**
- Installez-le et connectez-vous avec votre compte GitHub

### 3.3 — Envoyez votre projet sur GitHub

- Dans GitHub Desktop : **File > Add local repository**
- Sélectionnez le dossier `repairpro-site` (où se trouve votre code)
- S'il vous dit « This directory does not appear to be a Git repository », cliquez sur **« create a repository »**
- Vérifiez le nom et cliquez sur **« Create repository »**
- En bas à gauche, écrivez un message dans la case « Summary », par exemple : `Premier déploiement`
- Cliquez sur **« Commit to main »**
- Puis en haut, cliquez sur **« Publish repository »**
- Décochez **« Keep this code private »** (on veut Public)
- Cliquez sur **« Publish repository »**

✅ Votre code est maintenant sur GitHub. Vous pouvez vérifier en rafraîchissant la page de votre repo sur github.com.

---

## ÉTAPE 4 — Mettre le site en ligne avec Vercel (10 min)

Vercel va prendre votre code GitHub et le rendre accessible en ligne. **C'est gratuit**, sans carte bancaire.

### 4.1 — Créez un compte Vercel

- Allez sur **https://vercel.com**
- Cliquez sur **« Sign up »**
- Choisissez **« Continue with GitHub »** (le plus simple)
- Autorisez Vercel à accéder à votre compte GitHub

### 4.2 — Importez votre projet

- Sur le tableau de bord Vercel, cliquez sur **« Add New... »** > **« Project »**
- Vous voyez la liste de vos repos GitHub. Trouvez **`repairpro-site`** et cliquez sur **« Import »**
- Vercel détecte automatiquement que c'est un projet Vite. **Ne touchez à rien**, cliquez juste sur **« Deploy »**

⏳ Patientez 1-2 minutes...

🎉 **Votre site est en ligne !** Vercel vous donne une adresse comme :

```
repairpro-site-xxxxx.vercel.app
```

Ouvrez-la, votre site est accessible depuis n'importe où dans le monde !

---

## ÉTAPE 5 — Acheter un nom de domaine (10 min)

L'adresse `xxxxx.vercel.app` n'est pas terrible pour des clients. On va acheter un vrai nom de domaine professionnel.

### 5.1 — Choisissez un nom

Suggestions :
- `repairpro-saintetienne.fr` ✅
- `reparation-iphone-saintetienne.fr` ✅
- `ixititoure-repair.fr`
- `repair42.fr`

Un **`.fr`** coûte environ **6-8€/an** et inspire confiance localement.

### 5.2 — Achetez sur OVH

OVH est un hébergeur français reconnu, parfait pour un .fr.

- Allez sur **https://www.ovhcloud.com/fr/domains/**
- Tapez votre nom de domaine dans la barre de recherche
- Si disponible : cliquez sur **« Commander »**
- **Important** : décochez tous les services additionnels (hébergement web, email pro, etc.) — vous n'en avez pas besoin, Vercel s'occupe de l'hébergement
- Créez votre compte OVH avec votre email et payez (carte ou PayPal)

✅ Vous recevez un email de confirmation. Le domaine est à vous.

> 💡 **Alternative** : Gandi.net, OnlyDomains, Hostinger — fonctionnent pareil.

---

## ÉTAPE 6 — Brancher le domaine au site (10 min)

Maintenant on connecte votre nouveau domaine au site Vercel.

### 6.1 — Côté Vercel

- Sur Vercel, ouvrez votre projet `repairpro-site`
- Cliquez sur **« Settings »** > **« Domains »**
- Tapez votre domaine (ex. `repairpro-saintetienne.fr`) et cliquez sur **« Add »**
- Vercel vous donne 2 informations à utiliser :
  - **Type A** : une adresse IP (ex. `76.76.21.21`)
  - **Type CNAME** : `cname.vercel-dns.com` pour la version `www.`

**Gardez cette page ouverte**, on va dans OVH.

### 6.2 — Côté OVH

- Connectez-vous à **https://www.ovh.com/manager/**
- Dans le menu de gauche, cliquez sur **« Web Cloud »** > **« Noms de domaine »**
- Cliquez sur votre domaine
- Onglet **« Zone DNS »**

Vous allez modifier 2 lignes :

**Ligne 1 — pour `repairpro-saintetienne.fr` (sans www)**
- Cherchez la ligne avec **Type A** dont le nom est vide ou `@`
- Cliquez sur le crayon (modifier)
- Mettez la **cible** = l'IP donnée par Vercel (ex. `76.76.21.21`)
- Sauvegardez

**Ligne 2 — pour `www.repairpro-saintetienne.fr`**
- Cherchez la ligne avec **Type CNAME** dont le nom est `www`
- Modifiez la cible = `cname.vercel-dns.com.` (avec le point final)
- Sauvegardez

### 6.3 — Patientez

Les changements DNS prennent **15 minutes à 2 heures** pour se propager. Allez prendre un café ☕

Au bout d'un moment, dans Vercel, vous verrez une coche verte ✅ « Valid Configuration » à côté de votre domaine.

🎉 **Tapez votre domaine dans le navigateur — votre site s'affiche !**

---

## 🎯 Vous êtes en ligne ! Et maintenant ?

### Pour modifier le site

1. Modifiez le fichier `src/App.jsx` sur votre ordinateur
2. Ouvrez GitHub Desktop, écrivez un message du type « Mise à jour tarifs », cliquez sur **« Commit to main »**
3. Cliquez sur **« Push origin »**
4. Vercel détecte le changement et **redéploie automatiquement** en 1 minute. Magie !

### Pour ajouter votre site Google

1. Allez sur **https://www.google.com/business/**
2. Créez votre fiche **« Réparation RepairPro »** avec votre adresse Rue Charles de Gaulle
3. Ajoutez l'URL de votre site
4. Demandez la vérification (ils envoient un courrier postal à votre adresse)

Cela vous fait apparaître sur Google Maps quand quelqu'un cherche « réparation iPhone Saint-Étienne ».

### Pour suivre les visites

Activez **Google Analytics** ou **Plausible Analytics** (gratuit, plus simple). Demandez-moi si besoin.

---

## ❓ Problèmes fréquents

**« npm n'est pas reconnu »**
→ Node.js n'est pas installé ou pas dans le PATH. Réinstallez-le, puis fermez et rouvrez votre terminal.

**Le site ne s'affiche pas après l'achat du domaine**
→ Patience, jusqu'à 24h dans le pire des cas. Si après 24h ça ne marche pas, vérifiez les enregistrements DNS dans OVH.

**Je ne reçois pas les emails de Formspree**
→ Vérifiez vos spams. Vérifiez aussi que vous avez bien collé le bon ID dans le code, et que vous avez bien commit + push sur GitHub.

**J'ai une erreur lors du `npm run build`**
→ Vérifiez que vous êtes bien dans le dossier `repairpro-site`. Sinon, supprimez le dossier `node_modules` et refaites `npm install`.

---

## 📞 Récap des comptes créés

À la fin, vous aurez 4 comptes (tous gratuits sauf le domaine) :

| Service | Rôle | Coût |
|---|---|---|
| **Formspree** | Reçoit les demandes par email | Gratuit (50/mois) |
| **GitHub** | Stocke le code | Gratuit |
| **Vercel** | Héberge le site | Gratuit |
| **OVH** | Vous donne le nom de domaine | ~7€/an |

**Total : ~0,60€/mois.** 🎉
