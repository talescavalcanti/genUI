import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const PASTA_EXEMPLOS = path.join(process.cwd(), "examples");

/**
 * Lê a estrutura da pasta de exemplos para gerar as opções do formulário.
 */
export async function obterEstruturaOpcoes() {
  const tipos: string[] = [];
  const estilosPorTipo: Record<string, string[]> = {};

  try {
    const tiposDirs = await fs.readdir(PASTA_EXEMPLOS, { withFileTypes: true });
    
    for (const dir of tiposDirs) {
      if (dir.isDirectory()) {
        const tipo = dir.name;
        tipos.push(tipo);
        estilosPorTipo[tipo] = [];
        
        const estilosDirs = await fs.readdir(path.join(PASTA_EXEMPLOS, tipo), { withFileTypes: true });
        
        for (const subdir of estilosDirs) {
          if (subdir.isDirectory()) {
            estilosPorTipo[tipo].push(subdir.name);
          }
        }
        
        if (estilosPorTipo[tipo].length === 0) {
          estilosPorTipo[tipo].push("Geral");
        }
      }
    }
  } catch (erro) {
    console.warn("Aviso: Falha ao ler a pasta de exemplos.", erro);
  }

  return { tipos, estilosPorTipo };
}

/**
 * Lista os arquivos disponíveis para uma combinação tipo+estilo.
 */
async function listarArquivos(tipo: string, estilo: string): Promise<string[]> {
  let pasta = path.join(PASTA_EXEMPLOS, tipo, estilo);
  
  if (estilo === "Geral") {
    pasta = path.join(PASTA_EXEMPLOS, tipo);
  }

  try {
    const arquivos = await fs.readdir(pasta, { withFileTypes: true });
    return arquivos
      .filter((dirent) => dirent.isFile() && (dirent.name.endsWith(".html") || dirent.name.endsWith(".md") || dirent.name.endsWith(".tsx")))
      .map((dirent) => dirent.name);
  } catch (erro) {
    console.warn(`Pasta não encontrada ou vazia: ${pasta}`);
    return [];
  }
}

function embaralhar<T>(array: T[]): T[] {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export async function selecionarExemplos(
  tipo: string,
  estilo: string,
  quantidade = 3
): Promise<string[]> {
  const arquivos = await listarArquivos(tipo, estilo);
  if (arquivos.length === 0) return [];

  const selecionados = embaralhar(arquivos).slice(0, Math.min(quantidade, arquivos.length));

  const conteudos = await Promise.all(
    selecionados.map(async (nome) => {
      const pasta = estilo === "Geral" 
        ? path.join(PASTA_EXEMPLOS, tipo)
        : path.join(PASTA_EXEMPLOS, tipo, estilo);
        
      const caminho = path.join(pasta, nome);
      return await fs.readFile(caminho, "utf-8");
    })
  );

  return conteudos;
}
