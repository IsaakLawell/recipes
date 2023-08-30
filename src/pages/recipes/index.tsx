import Link from "next/link";
import { type ChangeEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";

type Ingredient = {
  name: string;
  value: number;
  unit: string;
};

export default function Recipe() {
  const [recipeName, setRecipeName] = useState<string>("");
  const [season, setSeason] = useState<string>("Toutes");
  const [nbPerson, setNbPerson] = useState<number>(0);
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [recipeDesc, setRecipeDesc] = useState<string>("");

  const { data, isLoading, refetch } = api.recipe.getOne.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (data?.recipe) {
      setRecipeName(data.recipe.name);
      setSeason(data.recipe.season);
      setNbPerson(data.recipe.nbPerson);
      setIngredients(
        structuredClone(
          JSON.parse(data.recipe.ingredients)
        ) as Array<Ingredient>
      );
      setRecipeDesc(data.recipe.recipe);
    }
  }, [data]);

  const changeNbPerson = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!data?.recipe) return;

    const copyOfIngredients = [...ingredients];

    for (const ingredient of copyOfIngredients) {
      const baseIngredient = (
        JSON.parse(data.recipe.ingredients) as Array<Ingredient>
      ).find((el: Ingredient) => el.name === ingredient.name) as {
        name: string;
        value: number;
        unit: string;
      };

      ingredient.value =
        (parseInt(value) / data.recipe.nbPerson) * baseIngredient.value;
    }

    setNbPerson(parseInt(value));
    setIngredients([...copyOfIngredients]);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0099ff] to-[#00548b]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full max-w-xl">
            <div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
              <div className="mb-4">
                <h1 className="mb-2 block text-center text-2xl font-bold text-gray-700">
                  {isLoading ? "Chargement..." : recipeName}
                </h1>
              </div>
              <div className="mb-4">
                <h2 className="mb-2 block text-sm font-bold text-gray-700">
                  Saison du plat
                </h2>
                <p className="mb-2 block text-sm text-gray-700">
                  {isLoading ? "Chargement..." : season}
                </p>
              </div>
              <div className="mb-4">
                <h2 className="mb-2 block text-sm font-bold text-gray-700">
                  Nombre de personnes
                </h2>
                {isLoading ? (
                  <p className="mb-2 block text-sm text-gray-700">
                    Chargement...
                  </p>
                ) : (
                  <input
                    className="focus:shadow-outline appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none md:w-1/6"
                    type="number"
                    min={1}
                    value={nbPerson}
                    onChange={changeNbPerson}
                  />
                )}
              </div>
              <div className="mb-2 block text-sm font-bold text-gray-700">
                Ingrédients
              </div>
              {isLoading
                ? "Chargement..."
                : ingredients.map(({ name, value, unit }) => (
                    <div
                      key={name}
                      className="mb-2 block text-sm text-gray-700"
                    >
                      {name}: {value}
                      {unit}
                    </div>
                  ))}
              <div className="mb-4">
                <label
                  htmlFor="recipeDesc"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Recette
                </label>
                {recipeDesc.split("\n").map((desc, index) => (
                  <p key={index}>{desc}</p>
                ))}
              </div>
            </div>
            <div className="mx-auto mb-4 w-1/2">
              <button
                className="flex w-full justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                type="button"
                onClick={() => {
                  void refetch();
                }}
              >
                Trouver une autre recette
              </button>
            </div>
            <div className="mx-auto w-1/2">
              <Link
                href="/"
                className="flex justify-center rounded-xl bg-red-600/50 p-4 text-white hover:bg-red-600/60"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
