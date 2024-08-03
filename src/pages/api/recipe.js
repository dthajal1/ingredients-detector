// pages/api/recipe.js
import OpenAI from 'openai';

require('dotenv').config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Invalid ingredients list' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: generatePrompt(ingredients) }],
        max_tokens: 800
      });

      let recipeText = completion.choices[0].message.content;

      // Remove the triple backticks from the response
      recipeText = recipeText.replace(/^```json\n/, '').replace(/```$/, '').trim();
      let recipe;

      try {
        recipe = JSON.parse(recipeText);
        if (recipe.recipeName.includes(`I don't think we can make a recipe with that ingredient`)) {
          return res.status(200).json({ msg: "I don't think we can make a recipe with that ingredient.", success: false });
        }
        return res.status(200).json({ result: recipe, success: true });
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        return res.status(500).json({ error: 'Failed to parse recipe JSON' });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      res.status(500).json({ error: 'Failed to generate recipe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
const generatePrompt = (ingredients) => `
You are an expert chef. Before creating a recipe, first check the ingredients list to ensure all items are suitable for cooking and commonly used. If any ingredient is unknown or inappropriate (e.g., human, cat, dog, or non-food items), respond with: "I don't think we can make a recipe with that ingredient."

Ingredients: ${ingredients.join(', ')}.

If all ingredients are suitable, create a detailed recipe strictly in the JSON format below. Do not include any additional text:

\`\`\`json
{
  "recipeName": "Name of the recipe",
  "servingSize": "Number of servings (e.g., 4-6)",
  "cookingTime": {
    "prepTime": "Preparation time in minutes",
    "cookTime": "Cooking time in minutes",
  },
  "requiredIngredients": [
    "List of ingredients with exact quantities"
  ],
  "instructions": [
    "Step-by-step cooking instructions with times and techniques"
  ],
  "nutritionalInformation": {
    "calories": "Calories per serving",
    "protein": "Protein in grams per serving",
    "carbohydrates": "Carbohydrates in grams per serving",
    "fat": "Fat in grams per serving"
  },
  "youtubeSearchLinks": [
    "2-5 YouTube search links for similar recipes (e.g., 'https://www.youtube.com/results?search_query={query}')"
  ]
}
\`\`\`

Ensure the JSON is well-formed and the recipe is easy to follow for home cooks.
`;