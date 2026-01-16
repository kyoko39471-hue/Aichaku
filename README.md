# Aichaku

Aichaku is a React + Firebase application for tracking personal items and computing **cost per use (CPU)**. The codebase is structured to enforce strict separation between UI, stateful logic, and data access.

---

## Stack

* React (Vite)
* Tailwind CSS
* Firebase Auth
* Firestore
* lucide-react

---

## Directory Structure

```
src/
├── App.jsx            # App-level orchestration only
├── main.jsx           # React bootstrap
├── firebase.js        # Firebase init (auth, db)
│
├── hooks/             # Stateful logic (no JSX)
│   ├── useAuth.js
│   ├── useCategories.js
│   └── useItems.js
│
├── services/          # External data access (no React)
│   └── firestoreService.js
│
├── components/        # Pure UI (JSX only)
│   ├── layout/
│   ├── dashboard/
│   └── modals/
│
└── utils/             # Pure functions
    ├── calculations.js
    ├── currency.js
    └── date.js
```

---

## Architectural Rules

1. **Components**

   * Render UI only
   * Never access Firestore directly

2. **Hooks**

   * Own state and side effects
   * Call `services`, expose data + handlers to UI

3. **Services**

   * Plain JavaScript
   * Firestore CRUD only
   * No React imports

4. **Utils**

   * Pure, deterministic helpers

---

## Data Flow

```
components → hooks → services → Firestore
```

Reverse dependencies are not allowed.

---

## Authentication

* Managed in `useAuth`
* App reacts to auth state declaratively
* Logout handled via Firebase Auth and propagated automatically

---

## Firestore Model (Conceptual)

* User-scoped data only
* Paths include `user.uid`

Example:

```
users/{uid}/items/{itemId}
users/{uid}/metadata/categories
```

Firestore rules are expected to enforce:

```
request.auth.uid == userId
```

---

## Cost Per Use (CPU)

```js
cpu = uses === 0 ? price : price / uses
```

Centralized in `utils/calculations.js`.

---

## Local Development

```
npm install
npm run dev
```

Firebase config must be provided in `firebase.js`.

---

## Notes

### CPU (Cost per Use)
An unused item’s cost-per-use equals full price
No division by zero
CPU is always ≥ 0

### firestoreService.js:
It only talks to Firestore
It never touches React state
It never imports React or hooks
It returns plain data or throws errors

functions: 
// categories
getOrCreateCategories(uid)
updateCategories(uid, newCategories)

// items
getItems(uid)
addItem(uid, itemData)
incrementItemUsage(uid, itemId)
deleteItem(uid, itemId)