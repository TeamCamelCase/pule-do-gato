from statsbombpy import sb
import pandas as pd
import os
from typing import Dict, Any

class ScoutingService:
    def __init__(self, fbref_service):
        self.fbref_service = fbref_service # Recebe o serviço do FBref
        print("🕵️ Motor de Scouting Individual Online.")

    def obter_perfil_jogador(self, player_id: str, nome_jogador: str):
        """
        Cruza o histórico da StatsBomb com a temporada 25/26 (FBref) para a IA.
        """
        try:
            # 1. Busca histórica longa (Últimas Copas/Ligas) via API
            # Para Hackathon, vamos buscar em uma competição aberta forte
            # events = sb.events(player_id=player_id) # Se tivermos o ID do Statsbomb

            # Como é Hackathon e não temos o ID do Statsbomb de todos, 
            # focamos o scouting nos dados da TEMPORADA ATUAL (FBref).
            
            # 2. Busca na Base FBref 2025/26 (Seu CSV)
            dados_temporada = self.fbref_service.buscar_jogador_por_nome(nome_jogador)

            if not dados_temporada["sucesso"]:
                return {"sucesso": False, "erro": "Dados do jogador não mapeados na base atual."}

            player_data = dados_temporada["dados"]

            # 3. Lógica de Scouting Individual (Dados crus para a IA)
            scouting_bruto = {
                "nome": player_data['Player'],
                "time": player_data['Squad'],
                "gols_na_temporada": int(player_data['Gls']),
                "assistencias": int(player_data['Ast']),
                "chutes_no_gol_media": round(float(player_data['Sh'] or 0) / float(player_data['MP'] or 1), 2),
                "cartoes_amarelos": int(player_data['CrdY']),
                "estilo": "Finalizador Ativo" if player_data['Sh'] > 20 else "Construtor"
            }

            return {
                "sucesso": True,
                "player_id": player_id,
                "scouting": scouting_bruto
            }

        except Exception as e:
            return {"sucesso": False, "erro": str(e)}