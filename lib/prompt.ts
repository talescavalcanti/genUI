import { getDescricaoEstilo } from "./estilos";
import { selecionarExemplos } from "./exemplos";

export async function montarPrompt(
  tipo: string,
  estilo: string,
  descricaoUsuario: string
): Promise<string> {
  const descricaoEstilo = getDescricaoEstilo(estilo);
  const exemplos = await selecionarExemplos(tipo, estilo, 3);

  const blocoExemplos = exemplos
    .map((html, i) => `--- EXEMPLO ${i + 1} ---\n${html}`)
    .join("\n\n");

  return `Você é um especialista em design de UI/UX e front-end.
Sua única função é gerar UM componente de interface em HTML PURO + CSS / JS inline (usando Tailwind se for o padrão).
A saída deve ser RIGOROSAMENTE renderizável diretamente no navegador em um iframe simples.

REGRAS DE SAÍDA (MUITO IMPORTANTES):
1. OBRIGATÓRIO: Retorne um DOCUMENTO HTML COMPLETO. Inicie com <!DOCTYPE html> e inclua as tags <html>, <head> e <body>.
2. NO <head>, OBRIGATÓRIO incluir o CDN do TailwindCSS (<script src="https://cdn.tailwindcss.com"></script>).
3. Se o seu componente usa animações, no <head>, OBRIGATÓRIO incluir também os CDNs do GSAP (<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>).
4. Todo o CSS (além das classes do Tailwind) DEVE estar dentro de UMA ÚNICA tag <style> no <head>.
5. Toda a lógica JavaScript (ex: chamadas GSAP ou interações Vanilla) DEVE estar dentro de UMA ÚNICA tag <script> no final do <body>. Não inclua imports React ou JSX.
6. A resposta FINAL deve ser APENAS o código. Sem formatação markdown (sem blocos de código), sem explicações. Apenas o HTML puro pronto para rodar.

TIPO DE COMPONENTE: ${tipo}
ESTILO VISUAL: ${estilo}

DESCRIÇÃO DO ESTILO:
${descricaoEstilo}

EXEMPLOS DE REFERÊNCIA (use a lógica de estilo/animação deles, mas converta para Vanilla HTML/JS/Tailwind):

${blocoExemplos}

INSTRUÇÃO CRÍTICA (NÃO SEJA GENÉRICO): 
NÃO gere um componente "padrão" ou "simples". Você DEVE aplicar o mesmo nível de complexidade visual, tipografia e refinamento técnico visto nos exemplos. 
Se os exemplos utilizam animações complexas, gradientes, pseudo-elementos (::before/::after), sombras múltiplas, clip-paths ou GSAP, você DEVE incorporar esses mesmos níveis de técnicas avançadas no seu novo componente.
NÃO COPIE de forma idêntica os exemplos, crie um novo.

DESCRIÇÃO DO USUÁRIO:
${descricaoUsuario}

Gere agora o componente NOVO e de ALTO PADRÃO em HTML puro:`;
}
