# User Manual

## 1. Introduction
This application is a recipe suggestion tool. You input ingredients, and it recommends up to 5 recipes using TheMealDB data stored in the database.

## 2. Accessing the App
Open `https://<your-vercel-domain>.vercel.app` or local dev: `http://localhost:3001`

## 3. Language Selection
At the top, choose either:
- `English`
- `日本語`

This controls UI language and, in Japanese mode, result translations.

## 4. Searching Recipes
1. In the textarea, enter ingredients separated by commas or Japanese commas.
   - EN example: `chicken, garlic, tomato`
   - JP example: `鶏肉、にんにく`
2. Click `Suggest Recipes`.
3. The app calls API and shows top results.

## 5. Reading Results
Each recipe card includes:
- Image
- Recipe name
- Ingredients list
- Instructions

In Japanese mode, these are translated into Japanese.

## 6. Reset
Press `Reset` to clear input and suggestions.

## 7. Handling No Results
If no recipes match, the message appears:
- EN: `No recipe suggestions yet...`
- JA: `まだレシピの提案がありません...`

## 8. Error Handling
If the app cannot fetch, you will see console errors; try again after verifying database and API.

## 9. Admin/Dev Maintenance
### 9.1 Local development
```bash
npm install
npm run dev
```

### 9.2 Test recipes API
```bash
curl -X POST http://localhost:3001/api/recipes -H 'Content-Type: application/json' -d '{"ingredients":["chicken"]}'
```

### 9.3 Rebuild
```bash
npm run build
```

### 9.4 Check duplicates before deployment
```bash
npm run check-translations
```

### 9.5 Force DB reload (admin)
- Run `node scripts/populate-themealdb.js` after env set

## 10. Go-live checklist
- 44d Vercel env vars configured: `TURSO_CONNECTION_URL`, `TURSO_AUTH_TOKEN`
- 44d `npm run check-translations` clean
- 44d `npm run build` clean
- 44d Recipe search works in both languages
