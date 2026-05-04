"use client";

import { useState, useMemo } from "react";

interface Props {
  html: string;
}

export default function ResultadoView({ html }: Props) {
  const [aba, setAba] = useState<"preview" | "html" | "css" | "js" | "completo">("preview");
  const [copiado, setCopiado] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Parsing do conteudo recebido para separar as partes
  const parsed = useMemo(() => {
    // 1. Extrair CSS
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const css = styleMatch ? styleMatch[1].trim() : "/* Nenhum CSS inline encontrado */";

    // 2. Extrair JS (ignora scripts com src como CDNs)
    let js = "";
    const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      if (match[1].trim()) {
        js += match[1].trim() + "\n\n";
      }
    }
    js = js.trim() || "// Nenhum JavaScript inline encontrado";

    // 3. Extrair HTML Componente (Pega do <body> e remove scripts puros)
    let markup = "";
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      markup = bodyMatch[1].replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, "").trim();
    } else {
      // Fallback caso a IA não retorne <body>
      markup = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, "").trim();
    }

    // 4. Código Completo (O documento inteiro)
    const isCompleteDoc = html.includes("<!DOCTYPE html>") || html.includes("<html");
    const codigoCompleto = isCompleteDoc ? html : `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #ffffff; color: black; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

    return { css, js, markup, completo: codigoCompleto, isCompleteDoc };
  }, [html]);

  const getTextoAtual = () => {
    switch (aba) {
      case "html": return parsed.markup;
      case "css": return parsed.css;
      case "js": return parsed.js;
      case "completo": return parsed.completo;
      default: return "";
    }
  };

  async function copiar() {
    const texto = getTextoAtual();
    if (!texto) return;
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function baixar() {
    const blob = new Blob([parsed.completo], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "componente-antigravity.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const TabBtn = ({ id, label }: { id: typeof aba, label: string }) => (
    <button
      onClick={() => setAba(id)}
      className={`px-2 py-1.5 text-[11px] font-mono uppercase tracking-widest transition-colors duration-200 border-b-2 ${
        aba === id 
          ? "text-white border-[#cd0000]" 
          : "text-zinc-500 border-transparent hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setFullscreen(false)}
        />
      )}
      <div className={`border border-white/[0.08] bg-[#050505] flex flex-col shadow-2xl transition-all duration-300 ${
        fullscreen
          ? "fixed inset-4 z-50 rounded-xl"
          : "rounded-xl relative"
      } ${!fullscreen ? "min-h-[650px]" : ""}`}>
      {/* Editor Header */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-2.5 border-b border-white/[0.04] bg-[#0a0a0a] rounded-t-xl">
        
        {/* Minimal OS Controls */}
        <div className="flex space-x-1.5 mr-4 opacity-40 hover:opacity-100 transition-opacity duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
        </div>

        {/* Tabs Principais */}
        <div className="flex space-x-2 sm:space-x-4 flex-wrap">
          <TabBtn id="preview" label="Preview" />
          <TabBtn id="html" label="HTML" />
          <TabBtn id="css" label="CSS" />
          <TabBtn id="js" label="JS" />
          <TabBtn id="completo" label="Completo" />
        </div>

        {/* Actions Menu */}
        <div className="ml-auto flex items-center space-x-4">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition hidden sm:block"
            title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {fullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>

          {aba === "completo" && (
            <button
              onClick={baixar}
              className="flex items-center space-x-2 px-3 py-1.5 bg-transparent text-zinc-400 border border-white/10 text-[12px] font-medium rounded-md hover:bg-white/5 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span className="hidden sm:inline">Baixar .html</span>
            </button>
          )}

          {aba !== "preview" && (
            <button
              onClick={copiar}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 text-white text-[12px] font-medium rounded-md hover:bg-white/20 transition-colors"
            >
              {copiado ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="hidden sm:inline">Copiado!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  <span className="hidden sm:inline">Copiar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div
        className={`flex-1 bg-[#09090b] rounded-b-2xl overflow-hidden ${
          fullscreen ? "h-[calc(100%-52px)]" : "min-h-[590px]"
        }`}
        style={{ position: "relative" }}
      >
        {aba === "preview" ? (
          <iframe
            srcDoc={parsed.completo}
            sandbox="allow-scripts allow-same-origin"
            className="absolute inset-0 w-full h-full bg-white border-none"
            title="Preview"
          />
        ) : (
          <pre className="bg-[#0a0a0a] p-5 overflow-auto text-[13px] absolute inset-0 text-zinc-300 custom-scrollbar selection:bg-purple-500/30 font-mono leading-relaxed">
            <code>{getTextoAtual()}</code>
          </pre>
        )}
      </div>
    </div>
    </>
  );
}
