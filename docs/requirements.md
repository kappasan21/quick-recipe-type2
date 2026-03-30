# Requirements Document

## 1. Project Overview
- App: Quick recipe suggestion web app.
- Stack: Next.js 16 / React 19 / TypeScript / Turso DB.
- Main features:
  - Ingredient-based recipe suggestion
  - English + Japanese UI and results
  - TheMealDB recipes persist in Turso
  - Real images with fallback handling
  - Full Japanese translations of recipe text

## 2. Functional Requirements

### 2.1 Ingredient Input
- Textarea accepts `,` and `、`
- Normalize input: trim, toLowerCase, filter empty

### 2.2 Search API
- POST `/api/recipes`
- Request: `{ ingredients: string[] }`
- If Japanese input present, convert ingredients to English using `translateJapaneseToEnglish`
- Search DB (all recipes) on ingredient substring inclusion
- Ranking: matchCount descending, top 5
- Response: `{ recipes: Recipe[] }`

### 2.3 Translation
- Japanese → English ingredients map: `translateJapaneseToEnglish`
- English → Japanese ingredients map: `translateEnglishToJapanese`
- Recipe name map: `RECIPE_NAME_TO_JA`
- Instruction phrase map: `INSTRUCTION_PHRASES_TO_JA`
- Word replacement map: comprehensive cooking instruction terms
- Japanese mode: translate recipe data on the client via `translateRecipeToJapanese`

### 2.4 Data Persistence
- Table `recipes` with fields: id, meal_id, name, category, area, instructions, ingredients, measures, image, youtube, source, tags, created_at
- `scripts/populate-themealdb.js` fills DB from TheMealDB API

### 2.5 Image Handling
- Use `RecipeImage` component
- Hide missing images using `onError` fallback

### 2.6 Build Validation
- `scripts/check-translations.js` enforces unique keys in `translations.ts`
- Build runs check before Next build

## 3. Non-functional Requirements
- Performance: query limit 1k, in-memory filtering
- Reliability: DB error fallback to []
- Security: no external network in runtime, except data population tooling
- Internationalization support for EN/JA

## 4. Deployment Requirements
- Deploy on Vercel/Render
- Set env:
  - `TURSO_CONNECTION_URL`
  - `TURSO_AUTH_TOKEN`
- Build command: `npm run build`
- Run command: `npm run start`

## 5. Test Cases
1. EN search: `chicken`, `tomato` -> results
2. JA search: `鶏肉`, `トマト` -> results
3. Bad image file hides gracefully
4. Batch translation on JA mode produces localized output
5. `npm run check-translations` fails at duplicate keys
6. `POST /api/recipes` with `[]` returns `recipes: []`
7. DB row count > 100 (populated 598)
8. `page.tsx` form submit -> returns 5 results
