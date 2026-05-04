import { obterEstruturaOpcoes } from "@/lib/exemplos";
import HomeClient from "./HomeClient";

export default async function Page() {
  const { tipos, estilosPorTipo } = await obterEstruturaOpcoes();

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto flex flex-col w-full">
      <HomeClient tiposDisponiveis={tipos} estilosPorTipo={estilosPorTipo} />
    </main>
  );
}
