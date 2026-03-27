from statsbombpy import sb
import pandas as pd
import os
from typing import Dict, Any

class ScoutingService:
    def __init__(self, fbref_service):
        self.fbref_service = fbref_service
        print("🕵️ Motor de Scouting Individual Online.")

    def obter_perfil_jogador(self, player_id: str, nome_jogador: str):
        try:
            # Busca na Base FBref 2025/26 através do serviço que já carrega o CSV
            # O player_id aqui vindo da URL (ex: 'Brenden Aaronson') é usado na busca
            resultado_fbref = self.fbref_service.buscar_destaques_time(nome_jogador)

            # Se a busca geral do time falhou ou o jogador não foi filtrado, 
            # vamos fazer uma busca direta pelo nome no DataFrame do fbref_service
            df = self.fbref_service.df
            
            # Busca flexível pelo nome do jogador
            player_row = df[df['Player'].str.contains(nome_jogador, case=False, na=False)]

            if player_row.empty:
                return {
                    "sucesso": False, 
                    "erro": f"Jogador '{nome_jogador}' não encontrado na base 2025/26."
                }

            # Pega a primeira linha encontrada
            p = player_row.iloc[0]

            # Mapeamento exato das colunas do seu CSV
            return {
                "sucesso": True,
                "scouting": {
                    "nome": p['Player'],
                    "time": p['Squad'],
                    "posicao": p['Pos'],
                    "idade": int(p['Age']) if pd.notna(p['Age']) else 0,
                    "gols_na_temporada": int(p['Gls']) if pd.notna(p['Gls']) else 0,
                    "assistencias": int(p['Ast']) if pd.notna(p['Ast']) else 0,
                    "cartoes_amarelos": int(p['CrdY']) if pd.notna(p['CrdY']) else 0,
                    "chutes_no_gol_media": round(float(p['SoT/90']), 2) if pd.notna(p['SoT/90']) else 0,
                    "xg_total": round(float(p['G-PK']), 2) if 'G-PK' in p else 0 # Usando G-PK como proxy se xG não existir
                }
            }

        except Exception as e:
            print(f"Erro no Scouting: {e}")
            return {"sucesso": False, "erro": str(e)}