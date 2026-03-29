import pandas as pd
import os
import re
from typing import Dict, Any

class FBrefService:
    def __init__(self):
        # Caminho dinâmico para garantir que funcione em qualquer PC/Deploy
        self.caminho_csv = os.path.join(os.path.dirname(__file__), "../../data/players_data_light-2025_2026.csv")
        self.df = pd.DataFrame()
        
        print("⏳ Carregando Cérebro FBref (Temporada 2025/26)...")
        try:
            if os.path.exists(self.caminho_csv):
                # Carrega o CSV e limpa espaços invisíveis nos nomes das colunas
                self.df = pd.read_csv(self.caminho_csv)
                self.df.columns = self.df.columns.str.strip()
                print(f"✅ Cérebro FBref pronto! {len(self.df)} atletas mapeados.")
            else:
                print(f"⚠️ AVISO: CSV não encontrado em {self.caminho_csv}")
        except Exception as e:
            print(f"❌ ERRO no FBref: {e}")

    def buscar_destaques_time(self, nome_time: str) -> Dict[str, Any]:
        """
        Cruza os dados da rodada com o histórico da temporada 25/26.
        """
        if self.df.empty:
            return {"sucesso": False, "erro": "Base FBref offline."}

        try:
            # Busca flexível para o nome do time na coluna 'Squad'
            nome_time_seguro = re.escape(nome_time)
            jogadores_time = self.df[self.df['Squad'].str.contains(nome_time_seguro, case=False, na=False)]

            if jogadores_time.empty:
                return {"sucesso": False, "erro": f"Sem dados para '{nome_time}' no FBref."}

            # 1. Identifica os artilheiros e jogadores mais ativos em chutes (Sh)
            # Como o xG pode variar no 'light', usamos Gls (Gols) e Sh (Chutes)
            destaques = jogadores_time.sort_values(by=['Gls', 'Sh'], ascending=False).head(3)

            top_jogadores = []
            for _, row in destaques.iterrows():
                top_jogadores.append({
                    "nome": row['Player'],
                    "posicao": row['Pos'],
                    "gols": int(row['Gls']) if pd.notna(row['Gls']) else 0,
                    "chutes": int(row['Sh']) if pd.notna(row['Sh']) else 0,
                    "cartoes_y": int(row['CrdY']) if pd.notna(row['CrdY']) else 0
                })

            # 2. Resumo para a IA (Tradução dos dados em insight)
            total_gols_time = int(jogadores_time['Gls'].sum())
            media_idade = round(float(jogadores_time['Age'].mean()), 1)

            return {
                "sucesso": True,
                "time": nome_time,
                "gols_na_temporada": total_gols_time,
                "media_idade": media_idade,
                "principais_armas": top_jogadores,
                "contexto_ia": (
                    f"O elenco do {nome_time} tem média de {media_idade} anos e já marcou {total_gols_time} gols. "
                    f"Destaques individuais: {', '.join([f'{j['nome']} ({j['gols']} gols)' for j in top_jogadores])}."
                )
            }

        except Exception as e:
            print(f"⚠️ Erro ao processar time {nome_time}: {e}")
            return {"sucesso": False, "erro": str(e)}