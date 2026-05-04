export interface RequisicaoGeracao {
  tipo: string;
  estilo: string;
  descricao: string;
  modelo?: string;
}

export interface RespostaGeracao {
  html: string;
  erro?: string;
}
