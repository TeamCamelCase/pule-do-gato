import pandas as pd
import os
import re
from typing import Dict, Any, List

class FBrefService:
    def __init__(self):
        # Caminho para o arquivo CSV (ajuste o nome do arquivo se necessário)
        caminho_csv = os.path.join(os.path.dirname(__file__), "../../data/players_data_light-2025_2026.csv")
        
        print("⏳ Carregando Cérebro FBref para a memória...")
        try:
            # Carrega o CSV usando Pandas
            self.df = pd.read_csv(caminho_csv)
            # Limpa espaços em branco nos nomes das colunas
            self.df.columns = self.df.columns.str.strip()
            print(f"✅ Cérebro FBref carregado com sucesso! {len(self.df)} jogadores catalogados.")
        except FileNotFoundError:
            print(f"❌ ERRO: Arquivo CSV não encontrado em {caminho_csv}. Crie a pasta 'data' e coloque o arquivo lá.")
            self.df = pd.DataFrame() # Cria um dataframe vazio para não quebrar o app

    def buscar_destaques_time(self, nome_time: str) -> Dict[str, Any]:
        """
        Busca os jogadores mais perigosos de um time específico com base no xG (Expected Goals)
        """
        if self.df.empty:
            return {"sucesso": False, "erro": "Banco de dados FBref não carregado."}

        # Filtra os jogadores que pertencem ao time solicitado
        # O 'str.contains' com 'case=False' ajuda a encontrar mesmo se a BetsAPI mandar o nome ligeiramente diferente
        nome_time_seguro = re.escape(nome_time)       
        jogadores_time = self.df[self.df['Squad'].str.contains(nome_time_seguro, case=False, na=False)]

        if jogadores_time.empty:
            return {"sucesso": False, "erro": f"Time '{nome_time}' não encontrado no FBref."}

        # Ordena pelos jogadores com maior xG (Gols Esperados)
        destaques = jogadores_time.sort_values(by='xG', ascending=False).head(3)

        # Prepara a lista de retorno
        top_jogadores = []
        for _, row in destaques.iterrows():
            top_jogadores.append({
                "nome": row['Player'],
                "posicao": row['Pos'],
                "xg_total": round(float(row['xG']), 2), # Expected Goals
                "gols_marcados": int(row['Gls']) if pd.notna(row['Gls']) else 0
            })

        # Calcula o xG total acumulado dos 3 melhores atacantes (para cruzar com o momento do jogo)
        xg_forca_ataque = sum(j['xg_total'] for j in top_jogadores)

        return {
            "sucesso": True,
            "time": nome_time,
            "forca_ofensiva_xg": round(xg_forca_ataque, 2),
            "top_jogadores": top_jogadores
        }