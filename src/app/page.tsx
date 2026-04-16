"use client";

import { FormEvent, useMemo, useState } from "react";
import { RecipeImage } from "@/components/RecipeImage";
import { translateRecipeToJapanese } from "@/lib/translations";
import styles from "./page.module.css";

type Language = "en" | "ja";

type Recipe = {
  id?: number;
  name: string;
  ingredients: string[];
  instructions: string;
  image: string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: "Quick Recipe Suggestions",
    description: "Enter foods and ingredients you have (comma-separated), and get 5 simple, quick recipes from our database of 265+ recipes.",
    ingredientsLabel: "Ingredients:",
    ingredientsPlaceholder: "eg. tomato, cheese, olive oil, garlic",
    submitButton: "Suggest Recipes",
    noResults: "No recipe suggestions yet. Enter ingredients and submit.",
    suggestionsHeader: "Top {count} Recipe Suggestions",
    ingredientsField: "Ingredients:",
    instructionsField: "Instructions:",
  },
  ja: {
    title: "簡単レシピ提案",
    description: "持っている食材を入力（カンマ区切り）すると、265以上のレシピから5つの最適なレシピが提案されます。",
    ingredientsLabel: "食材:",
    ingredientsPlaceholder: "例: トマト、チーズ、オリーブオイル、ニンニク",
    submitButton: "レシピを提案する",
    noResults: "まだレシピの提案がありません。食材を入力して送信してください。",
    suggestionsHeader: "上位{count}個のレシピ提案",
    ingredientsField: "食材:",
    instructionsField: "作り方:",
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [ingredientInput, setIngredientInput] = useState("");
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const normalizedInput = useMemo(() => {
    return ingredientInput
      .split(/[,、]/)  // Support both ASCII comma and Japanese comma
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }, [ingredientInput]);

  async function translateTextGoogle(text: string): Promise<string> {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target: "ja" }),
      });

      if (!res.ok) {
        return text;
      }

      const json = await res.json();
      return json.translation || text;
    } catch {
      return text;
    }
  }

  async function translateRecipeWithGoogle(recipe: Recipe): Promise<Recipe> {
    const [name, instructions] = await Promise.all([
      translateTextGoogle(recipe.name),
      translateTextGoogle(recipe.instructions),
    ]);

    const ingredients = await Promise.all(recipe.ingredients.map((i) => translateTextGoogle(i)));

    return { ...recipe, name, instructions, ingredients };
  }

  async function translateRecipesWithGoogle(recipes: Recipe[]): Promise<Recipe[]> {
    return Promise.all(recipes.map(translateRecipeWithGoogle));
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedInput.length) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: normalizedInput }),
      });

      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();
      let recipes: Recipe[] = data.recipes || [];

      // Translate full recipe details into Japanese if language is Japanese
      if (language === "ja") {
        if (process.env.NEXT_PUBLIC_USE_GOOGLE_TRANSLATE === "true") {
          recipes = await translateRecipesWithGoogle(recipes);
        } else {
          recipes = recipes.map((recipe: Recipe) => translateRecipeToJapanese(recipe)) as Recipe[];
        }
      }

      setSuggestions(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setIngredientInput("");
    setSuggestions([]);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.languageToggle}>
          <button
            className={`${styles.langButton} ${language === "en" ? styles.active : ""}`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            disabled
            className={`${styles.langButton} ${language === "ja" ? styles.active : ""}`}
            onClick={async () => {
              setLanguage("ja");
              if (suggestions.length > 0) {
                if (process.env.NEXT_PUBLIC_USE_GOOGLE_TRANSLATE === "true") {
                  const translated = await translateRecipesWithGoogle(suggestions);
                  setSuggestions(translated);
                } else {
                  // setSuggestions(suggestions.map((recipe) => translateRecipeToJapanese(recipe)));
                }
              }
            }}
          >
            日本語
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>

        <form className={styles.recipeForm} onSubmit={onSubmit}>
          <label htmlFor="ingredients" className={styles.label}>
            {t.ingredientsLabel}
          </label>
          <textarea
            id="ingredients"
            rows={3}
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder={t.ingredientsPlaceholder}
            className={styles.textarea}
          />

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? "Loading..." : t.submitButton}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={onReset}>
              Reset
            </button>
          </div>
        </form>

        <section className={styles.results}>
          {suggestions.length === 0 ? (
            <p className={styles.empty}>{t.noResults}</p>
          ) : (
            <>
              <h2>{t.suggestionsHeader.replace("{count}", suggestions.length.toString())}</h2>
              <ul className={styles.recipeList}>
                {suggestions.map((recipe) => (
                  <li key={recipe.name} className={styles.recipeCard}>
                    <RecipeImage src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
                    <h3>{recipe.name}</h3>
                    <p>
                      <strong>{t.ingredientsField}</strong> {recipe.ingredients.join(", ")}
                    </p>
                    <p>
                      <strong>{t.instructionsField}</strong> {recipe.instructions}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
