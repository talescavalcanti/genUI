"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PromptForm from "@/components/PromptForm";
import ResultadoView from "@/components/ResultadoView";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const DarkVeil = dynamic(() => import("@/components/ui/DarkVeil/DarkVeil"), { ssr: false });

interface Props {
  tiposDisponiveis: string[];
  estilosPorTipo: Record<string, string[]>;
}

export default function HomeClient({ tiposDisponiveis, estilosPorTipo }: Props) {
  const [htmlGerado, setHtmlGerado] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[80vh] py-12">
      {/* DarkVeil background sempre visível */}
      <div className="fixed inset-0 z-0">
        <DarkVeil
          hueShift={245}
          speed={0.4}
          warpAmount={1}
          noiseIntensity={0.02}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-8 px-4">
        <div className="text-center space-y-2 flex flex-col items-center">
          <h1 className="font-serif text-6xl md:text-8xl font-normal tracking-tight text-white leading-[0.95]">
            O que vamos{" "}
            <span className="italic text-[#cd0000] inline-block px-1">criar</span>{" "}
            hoje?
          </h1>
          <p className="text-zinc-300 text-base md:text-lg font-normal tracking-tight mx-auto whitespace-nowrap">
            Descreva sua visão e a IA{" "}
            <span className="text-[#cd0000] font-medium">gera o componente</span>{" "}
            em tempo real.
          </p>
        </div>

        <div
          className={cn(
            "w-full transition-all duration-500 ease-in-out relative z-50",
            htmlGerado ? "max-w-5xl" : "max-w-3xl"
          )}
        >
          <PromptForm
            tiposDisponiveis={tiposDisponiveis}
            estilosPorTipo={estilosPorTipo}
            onGerar={setHtmlGerado}
          />
        </div>

        <AnimatePresence>
          {htmlGerado && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full flex flex-col gap-4 mt-8 relative z-10"
            >
              <div className="flex justify-between items-center px-1">
                <h2 className="text-zinc-400 text-sm font-medium">Visualização Gerada</h2>
                <button
                  onClick={() => setHtmlGerado(null)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all border border-white/5"
                >
                  <X className="w-3.5 h-3.5" />
                  Descartar e Voltar
                </button>
              </div>
              <section className="w-full h-full min-h-[600px] flex flex-col">
                <ResultadoView html={htmlGerado} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
