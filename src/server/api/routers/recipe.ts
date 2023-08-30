import { readFileSync } from "fs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import axios from "axios";
import https from "https";

type MarmitonRecipe = {
  title: string;
  totalTime: number;
  steps: Array<{ text: string }>;
  servings: { count: number };
  ingredientGroups: [
    {
      items: Array<{
        ingredientQuantity: number;
        name: string;
        unitName: string;
      }>;
    }
  ];
};

export const recipeRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        season: z.string(),
        nbPerson: z.number(),
        ingredients: z.array(
          z.object({ name: z.string(), value: z.number(), unit: z.string() })
        ),
        recipe: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.recipe.create({
        data: { ...input, ingredients: JSON.stringify(input.ingredients) },
      });
    }),
  getOne: publicProcedure.query(async ({ ctx }) => {
    const currentMonth = Math.floor(new Date().getMonth() / 3);
    const seasons = ["Hiver", "Printemps", "Été", "Automne"];

    const currentSeason = seasons[currentMonth];

    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        OR: [
          {
            season: currentSeason,
          },
          {
            season: "Toutes",
          },
        ],
      },
    });

    const randNumber = Math.round(Math.random() * ((recipes.length || 0) - 1));

    return { recipe: recipes[randNumber] };
  }),
  createRecipes: publicProcedure.query(async ({ ctx }) => {
    axios.defaults.timeout = 30000;
    axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });
    const recipes = [];
    const baseUrl = "https://api-uno.marmiton.org/recipe/";

    const recipeNumbers: Array<string> = readFileSync(
      "C:/Users/Raine/Downloads/cook/cook/recipeNumbers.txt"
    )
      .toString()
      .split("\n");

    const recipesData = recipeNumbers.map(async (number) => {
      const { data }: { data: MarmitonRecipe } = await axios.get(
        baseUrl + number
      );
      return data;
    });

    const data = await Promise.all(recipesData);

    for (const {
      title,
      totalTime,
      steps,
      servings: { count: nbPers },
      ingredientGroups: [{ items: ingredientsList }],
    } of data) {
      const name = title;
      const season = "Toutes";
      const nbPerson = nbPers;
      const ingredients = [];
      const recipe = [];

      for (const { ingredientQuantity, name, unitName } of ingredientsList) {
        ingredients.push({
          name: name[0]!.toUpperCase() + name.slice(1),
          value: ingredientQuantity,
          unit: unitName,
        });
      }

      const time = totalTime / 60;
      recipe.push(`${Math.floor(time / 60)}h ${time % 60}min`);

      for (const { text } of steps) {
        recipe.push(text);
      }

      recipes.push({
        name,
        season,
        nbPerson,
        ingredients: JSON.stringify(ingredients),
        recipe: recipe.join("\n"),
      });
    }

    for (const recipe of recipes) {
      await ctx.prisma.recipe.create({ data: recipe });
    }

    return { message: "Ok" };
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany();
  }),
});
