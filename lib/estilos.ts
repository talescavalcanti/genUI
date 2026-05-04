export function getDescricaoEstilo(estilo: string): string {
  const mapeamento: Record<string, string> = {
    "Glassmorphism": `Estética de vidro fosco translúcido. Use:
- background: rgba com transparência baixa (0.1 a 0.25)
- backdrop-filter: blur(10px) a blur(20px)
- border: 1px solid rgba(255,255,255,0.18)
- border-radius generoso: 16px a 24px
- box-shadow suave e difusa
- fundos com gradientes coloridos para realçar a transparência
- tipografia limpa sans-serif (Inter, SF Pro Display, system-ui)
- cores: paleta pastel ou neutra sobre gradientes vibrantes`,
    "Neobrutalism": `Estética crua, geométrica, alto contraste. Use:
- cores saturadas e vibrantes (amarelo #FFE500, rosa #FF6B9D, verde #4ADE80)
- bordas pretas grossas: 3px a 4px solid black
- sombras hard sem blur: box-shadow: 6px 6px 0 #000
- cantos retos ou levemente arredondados (max 8px)
- zero gradientes, zero transparência
- tipografia bold/black, geométrica (Space Grotesk, Archivo Black, IBM Plex Mono)
- layout com grid evidente e elementos chunky`,
    "Magnético": `Componentes com microinterações sofisticadas. Use:
- transforms suaves no hover (scale, translate)
- transitions com cubic-bezier para sensação de peso
- efeitos de profundidade e camadas
- cursor que parece atrair o elemento
- tipografia moderna e clean`,
    "3D-Flip": `Efeitos tridimensionais avançados. Use:
- transform-style: preserve-3d; e perspective
- animações de giros de cartão
- profundidade de camadas e sombras dinâmicas`,
    "Neon-Glow": `Efeito brilhante estilo Cyberpunk/Neon. Use:
- cores neon vibrantes em fundos escuros
- sombras brilhantes (box-shadow neon com várias camadas de blur)
- bordas iluminadas`,
    "Premium-GSAP": `Animações ultra fluídas e visual sofisticado. Use:
- elementos com delays encadeados, easing perfeito
- sensação de produto de luxo`,
    "Geral": `Siga um design moderno, limpo e atraente. 
Adapte o visual para o mais alto nível de sofisticação.`
  };

  return mapeamento[estilo] || `Estilo "${estilo}": Utilize boas práticas de design UI moderno, cores equilibradas e um layout elegante, mantendo o nível de qualidade dos exemplos.`;
}
