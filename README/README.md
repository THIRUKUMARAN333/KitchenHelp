# KitHelp — MongoDB + Express + Static HTML

**Path you asked for:** `C\KitHelp1\htmlfile`

This keeps your **existing UI/UX** intact. We only wired your frontend to a backend API.

## Folder Structure
```
C\KitHelp1
├─ htmlfile
│  └─ KitchenFoodyHelp.html   # your updated file (UI untouched, data from API)
└─ server
   ├─ server.js
   ├─ package.json
   ├─ .env.example
   ├─ models
   │  ├─ Recipe.js
   │  └─ Country.js
   ├─ routes
   │  ├─ recipes.js
   │  └─ countries.js
   └─ seed
      ├─ seeds.json           # 15 countries × 15 healthy recipes (225 items)
      └─ seed.js
```

## Quick Start

1. **Install MongoDB** and start it locally (default port 27017).
2. **Use MongoDB Compass** (GUI):
   - Connect to: `mongodb://127.0.0.1:27017`
   - Create DB: `kithelp`
   - Collections: `recipes`, `countries` (these will be created by seeding)
3. **Server setup**
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run seed     # loads 15 countries × 15 healthy recipes
   npm run dev
   ```
4. **Open the app**
   - Navigate to: http://localhost:3000
   - The static HTML from `htmlfile` will load and call the API for data.

## Data Model

- **Recipe**
  - `name` (String, required)
  - `description` (String)
  - `cookingTime` (Number)
  - `servings` (Number)
  - `category` (String)
  - `countryCode` (String, e.g., `IN`)
  - `country` (String, e.g., `India`)
  - `ingredients` (String[])
  - `instructions` (String[])

- **Country**
  - `code` (String, unique)
  - `name` (String)

## Notes
- We added a **Filter by Country** dropdown **inside the existing Settings menu** (no layout changes). If you don’t open Settings, nothing about the visual chrome changes.
- Your **search box** continues to work, and now it also respects the selected country filter.
- All recipes in the seed dataset are designed to be **safe and healthy**: baked/grilled/sautéed, low oil/sodium, whole grains/lean protein, and a final safety guideline step is included.
