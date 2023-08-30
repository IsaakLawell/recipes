import Link from "next/link";
import { type ChangeEvent, useState } from "react";
import { api } from "~/utils/api";

export default function AddRecipe() {
  const [recipeName, setRecipeName] = useState<string>("");
  const [season, setSeason] = useState<string>("Toutes");
  const [nbPerson, setNbPerson] = useState<number>(1);
  const [ingredients, setIngredients] = useState<
    Array<{ name: string; value: number; unit: string }>
  >([{ name: "", value: 0, unit: "" }]);
  const [recipeDesc, setRecipeDesc] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { mutate, isLoading } = api.recipe.add.useMutation({
    onSuccess: () => {
      setRecipeName("");
      setSeason("Toutes");
      setNbPerson(1);
      setIngredients([{ name: "", value: 0, unit: "" }]);
      setRecipeDesc("");
      setErrorMsg("");
    },
    onError: () => {
      setErrorMsg("Erreur lors de l'ajout de la recette");
    },
  });

  const addIngredient = () => {
    const copyOfIngredients = [...ingredients];

    copyOfIngredients.push({ name: "", value: 0, unit: "" });
    setIngredients(copyOfIngredients);
  };

  const removeIngredient = () => {
    if (ingredients.length === 1) return;

    const copyOfIngredients = [...ingredients];

    copyOfIngredients.pop();
    setIngredients(copyOfIngredients);
  };

  const handleIngredientChange = ({
    target: {
      name,
      type,
      value,
      dataset: { index },
    },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!index) return;

    const property = name.split(index).shift();

    if (!property) return;

    const copyOfIngredients = [...ingredients];
    const oldIngredient = copyOfIngredients[parseInt(index)] as {
      name: string;
      value: number;
      unit: string;
    };
    const newIngredient = {
      ...oldIngredient,
      [property]: type === "text" ? value : parseInt(value),
    };

    copyOfIngredients.splice(parseInt(index), 1, newIngredient);

    setIngredients(copyOfIngredients);
  };

  const uploadRecipe = () => {
    mutate({
      name: recipeName,
      season,
      nbPerson,
      ingredients,
      recipe: recipeDesc,
    });
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0099ff] to-[#00548b]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full max-w-xl">
            <form className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="recipeName"
                >
                  Nom du plat
                </label>
                <input
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  id="recipeName"
                  name="recipeName"
                  type="text"
                  placeholder="Nom du plat"
                  value={recipeName}
                  onChange={({ target: { value } }) => setRecipeName(value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="season"
                >
                  Saison du plat
                </label>
                <select
                  id="season"
                  name="season"
                  className="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  value={season}
                  onChange={({ target: { value } }) => setSeason(value)}
                >
                  <option value="Toutes">Toutes</option>
                  <option value="Printemps">Printemps</option>
                  <option value="Été">Été</option>
                  <option value="Automne">Automne</option>
                  <option value="Hiver">Hiver</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="mb-2 block text-sm font-bold text-gray-700"
                  htmlFor="nbPerson"
                >
                  Nombre de personnes
                </label>
                <input
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  id="nbPerson"
                  name="nbPerson"
                  type="number"
                  min="1"
                  value={nbPerson}
                  onChange={({ target: { value } }) =>
                    setNbPerson(parseInt(value))
                  }
                />
              </div>
              <div className="mb-2 block text-sm font-bold text-gray-700">
                Ingrédients
              </div>
              {ingredients.map(({ name, value, unit }, index) => (
                <div className="mb-4 flex gap-x-2" key={index}>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none md:w-2/3"
                    id={"name" + index}
                    name={"name" + index}
                    type="text"
                    placeholder="Nom de l'ingrédient"
                    data-index={index}
                    value={name}
                    onChange={handleIngredientChange}
                  />
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none md:w-1/6"
                    id={"value" + index}
                    name={"value" + index}
                    type="number"
                    min={1}
                    placeholder="Valeur"
                    data-index={index}
                    value={value}
                    onChange={handleIngredientChange}
                  />
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none md:w-1/6"
                    id={"unit" + index}
                    name={"unit" + index}
                    type="text"
                    placeholder="Unité"
                    data-index={index}
                    value={unit}
                    onChange={handleIngredientChange}
                  />
                </div>
              ))}
              <div className="mb-4 flex justify-around text-center">
                <button
                  className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                  type="button"
                  onClick={addIngredient}
                >
                  Ajouter un ingrédient
                </button>
                <button
                  className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
                  type="button"
                  onClick={removeIngredient}
                >
                  Enlever un ingrédient
                </button>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="recipeDesc"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Recette
                </label>
                <textarea
                  id="recipeDesc"
                  name="recipeDesc"
                  rows={4}
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Description de la recette"
                  value={recipeDesc}
                  onChange={({ target: { value } }) => {
                    console.log(JSON.stringify(value));
                    setRecipeDesc(value);
                  }}
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-900"
                  type="button"
                  onClick={uploadRecipe}
                  disabled={isLoading}
                >
                  Envoyer la recette
                </button>
              </div>
              {errorMsg && (
                <div className="mb-2 block text-sm font-bold text-blue-500">
                  {errorMsg}
                </div>
              )}
            </form>
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
