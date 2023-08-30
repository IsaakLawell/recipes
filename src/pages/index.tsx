import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0099ff] to-[#00548b]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Cooking Puppy 🐶
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/recipes"
            >
              <h3 className="text-center text-2xl font-bold">
                Demander une recette de saison
              </h3>
            </Link>
            <Link
              className="flex max-w-xs flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/recipes/add"
            >
              <h3 className="text-center text-2xl font-bold">
                Donner une recette
              </h3>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
