import { NextRequest, NextResponse } from "next/server";
import { montarPrompt } from "@/lib/prompt";
import { gerarComponenteHTML } from "@/lib/gemini";
import type { RequisicaoGeracao, RespostaGeracao } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequisicaoGeracao;
    const { tipo, estilo, descricao, modelo } = body;

    if (!tipo || !estilo || !descricao?.trim()) {
      return NextResponse.json<RespostaGeracao>(
        { html: "", erro: "Campos obrigatórios: tipo, estilo, descricao." },
        { status: 400 }
      );
    }

    if (descricao.length > 1000) {
      return NextResponse.json<RespostaGeracao>(
        { html: "", erro: "Descrição muito longa (máx. 1000 caracteres)." },
        { status: 400 }
      );
    }

    const prompt = await montarPrompt(tipo, estilo, descricao);
    console.log(`[API Gerar] Tipo: ${tipo} | Estilo: ${estilo} | Modelo: ${modelo || "padrão"} | Tamanho do prompt: ${prompt.length} caracteres`);
    const html = await gerarComponenteHTML(prompt, modelo);

    return NextResponse.json<RespostaGeracao>({ html });
  } catch (erro) {
    console.error("[/api/gerar] Erro:", erro);
    const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido";
    return NextResponse.json<RespostaGeracao>(
      { html: "", erro: mensagem },
      { status: 500 }
    );
  }
}
