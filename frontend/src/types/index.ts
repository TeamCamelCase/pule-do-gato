export interface Liga {
  nome: string;
  descricao: string;
  destaque?: boolean;
}

export interface Partida {
  casa: string;
  fora: string;
  placar: string;
  tempo: string;
}

export interface Tendencia {
  nome: string;
  status: string;
}
