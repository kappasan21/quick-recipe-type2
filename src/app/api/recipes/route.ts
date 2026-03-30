import { searchRecipes } from "@/lib/db";
import { translateJapaneseToEnglish, containsJapanese } from "@/lib/translations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients } = body as { ingredients: string[] };

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ recipes: [] });
    }

    // Check if input contains Japanese and translate to English for search
    let searchIngredients = ingredients;
    const hasJapanese = ingredients.some(ing => containsJapanese(ing));

    if (hasJapanese) {
      searchIngredients = translateJapaneseToEnglish(ingredients);
    }

    const recipes = await searchRecipes(searchIngredients);
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to search recipes" },
      { status: 500 }
    );
  }
}
