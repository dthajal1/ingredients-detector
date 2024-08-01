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
        return res.status(200).json({ recipe });
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
You are an expert chef. Create a detailed recipe with the following sections in JSON format:

{
  "recipeName": "A creative name for the recipe",
  "requiredIngredients": [
    "List of ingredients with exact quantities"
  ],
  "instructions": [
    "Step-by-step cooking instructions, including times and techniques"
  ],
  "servingSuggestions": "Tips for serving or pairing",
  "tipsAndVariations": [
    "Optional tips for variations"
  ]
}

Make sure the JSON is well-formed.

If any ingredient is unknown or unusual, respond with: "I don't think we can make a recipe with that ingredient."

Ingredients: ${ingredients.join(', ')}.

Ensure the recipe is easy to follow and suitable for home cooks.
`;
