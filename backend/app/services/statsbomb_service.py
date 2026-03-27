from statsbombpy import sb
import pandas as pd
from typing import Dict, Any

class StatsbombService:
    def __init__(self):
        print("🧭 Radar StatsBomb Online Ativado (Conexão via API)")
        # IDs de Competições Gratuitas (Open Data) para busca rápida
        # 43: Copa do Mundo Masculina, 11: La Liga (Espanha), 72: Women's World Cup
        self.competicoes_foco = [
            {"id": 43, "season": 106}, # Copa 2022
            {"id": 11, "season": 90},  # La Liga 2020/21 (Última do Messi)
            {"id": 11, "season": 42},  # La Liga 2019/20
            {"id": 55, "season": 43},  # Champions League 2003/04
            {"id": 2, "season": 44}     # Premier League 2003/04
        ]

    def analisar_zona_de_ataque(self, nome_time: str) -> Dict[str, Any]:
        """
        Busca dinamicamente na API aberta do Statsbomb se o time tem histórico 
        em diversas competições gratuitas.
        """
        try:
            match_id = None
            total_chutes = 0
            dna = "Distribuição equilibrada."

            # Tenta buscar o time em cada competição da nossa lista de foco
            for comp in self.competicoes_foco:
                try:
                    partidas = sb.matches(competition_id=comp["id"], season_id=comp["season"])
                    
                    # Filtra se o time jogou (Case insensitive para evitar erros de digitação)
                    jogos_do_time = partidas[
                        (partidas['home_team'].str.contains(nome_time, case=False, na=False)) | 
                        (partidas['away_team'].str.contains(nome_time, case=False, na=False))
                    ]

                    if not jogos_do_time.empty:
                        # Achamos o time! Pegamos a última partida registrada dele nesta base
                        match_id = jogos_do_time.iloc[0]['match_id']
                        # Armazenamos o nome exato que a StatsBomb usa para esse time
                        nome_exato_statsbomb = (
                            jogos_do_time.iloc[0]['home_team'] 
                            if nome_time.lower() in jogos_do_time.iloc[0]['home_team'].lower() 
                            else jogos_do_time.iloc[0]['away_team']
                        )
                        break # Para a busca assim que encontrar
                except:
                    continue

            # Se após percorrer as competições não acharmos nada
            if not match_id:
                return {
                    "sucesso": False, 
                    "dna_tatico": f"DNA tático indisponível para '{nome_time}' no Open Data."
                }

            # Baixa os eventos da partida encontrada
            eventos = sb.events(match_id=match_id)
            
            # Filtra chutes (Shot) do time encontrado
            if 'type' in eventos.columns and 'team' in eventos.columns:
                chutes = eventos[(eventos['type'] == 'Shot') & (eventos['team'] == nome_exato_statsbomb)]
                total_chutes = len(chutes)
            
            # Lógica de Classificação do DNA
            if total_chutes > 12:
                dna = f"DNA Ofensivo Agressivo (Baseado em {total_chutes} finalizações registradas)"
            elif total_chutes > 5:
                dna = f"DNA Posicional (Construção estruturada, {total_chutes} chutes registrados)"
            else:
                dna = "DNA Reativo (Foco em transições rápidas e poucas finalizações)"

            return {
                "sucesso": True,
                "dna_tatico": dna,
                "chutes_encontrados_historico": total_chutes,
                "fonte": "StatsBomb Open Data"
            }

        except Exception as e:
            print(f"⚠️ Erro no Radar StatsBomb: {e}")
            return {
                "sucesso": False, 
                "dna_tatico": "Radar tático operando em modo reduzido.",
                "erro": str(e)
            }