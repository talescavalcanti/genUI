"use client";

import { useState } from "react";
import { PromptInputBox } from "@/components/ui/prompt-input";

interface Props {
  tiposDisponiveis: string[];
  estilosPorTipo: Record<string, string[]>;
  onGerar: (html: string) => void;
}

export default function PromptForm({ tiposDisponiveis, estilosPorTipo, onGerar }: Props) {
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState("gemini-3.1-flash-lite-preview");
  
  // States for parameters
  const [tipoSelecionado, setTipoSelecionado] = useState(tiposDisponiveis[0] || "");
  const [estiloSelecionado, setEstiloSelecionado] = useState(
    (estilosPorTipo[tiposDisponiveis[0]] && estilosPorTipo[tiposDisponiveis[0]][0]) || "Geral"
  );

  // When type changes, update style if it's no longer available for the new type
  const handleTipoChange = (novoTipo: string) => {
    setTipoSelecionado(novoTipo);
    const estilosDoNovoTipo = estilosPorTipo[novoTipo] || [];
    if (!estilosDoNovoTipo.includes(estiloSelecionado)) {
      setEstiloSelecionado(estilosDoNovoTipo[0] || "Geral");
    }
  };

  async function handleSubmit() {
    if (!descricao.trim()) {
      setErro("Descreva o componente que você quer gerar.");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: tipoSelecionado, estilo: estiloSelecionado, descricao, modelo: modeloSelecionado }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Erro ao gerar.");

      onGerar(dados.html);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  if (tiposDisponiveis.length === 0) {
    return (
      <div className="p-6 border border-yellow-500/30 bg-yellow-500/10 text-yellow-700 rounded-2xl flex items-center justify-center">
        <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-3 animate-pulse"></span>
        Nenhuma pasta de exemplos encontrada em{" "}
        <code className="ml-1 bg-yellow-500/20 px-2 py-0.5 rounded text-xs">/examples</code>.
      </div>
    );
  }

  return (
    <div className="w-full">
      <PromptInputBox
        value={descricao}
        onChange={setDescricao}
        onSend={handleSubmit}
        isLoading={carregando}
        placeholder="Descreva o componente que você quer gerar..."
        selectedModel={modeloSelecionado}
        onModelChange={setModeloSelecionado}
        tiposDisponiveis={tiposDisponiveis}
        estilosDisponiveis={estilosPorTipo[tipoSelecionado] || []}
        selectedTipo={tipoSelecionado}
        onTipoChange={handleTipoChange}
        selectedEstilo={estiloSelecionado}
        onEstiloChange={setEstiloSelecionado}
      />

      {erro && (
        <div className="mt-4 p-4 bg-red-950/40 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-start space-x-3">
          <svg className="w-5 h-5 text-[#cd0000] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span className="leading-snug">{erro}</span>
        </div>
      )}
    </div>
  );
}

