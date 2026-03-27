from statsbombpy import sb
import pandas as pd
from typing import Dict, Any

class StatsbombService:
    def __init__(self):
        print("🧭 Radar StatsBomb Online Ativado (Usando API Aberta)")
        # Não precisamos carregar nada na inicialização, tudo será buscado sob demanda.

    def analisar_zona_de_ataque(self, nome_time: str) -> Dict[str, Any]:
        """
        Busca dinamicamente na API aberta do Statsbomb se o time tem histórico.
        """
        try:
            # Para não travar a API tentando ler todas as competições do mundo em 1 segundo,
            # no hackathon nós buscamos em um campeonato aberto forte (ex: Copa do Mundo 2022 ou La Liga)
            # A documentação do Statsbomb diz que comp_id 43 (Copa do Mundo) season_id 106 (2022) é liberado.
            
            # ATENÇÃO: Se for um time de clube, o ideal é buscar na La Liga (comp_id=11)
            # Aqui vou fazer um exemplo buscando na Copa do Mundo Feminina e Masculina mais recentes abertas.
            
            partidas = sb.matches(competition_id=43, season_id=106) # Copa 2022 como exemplo de base
            
            # Tenta achar se o nosso time jogou alguma partida nessa base
            jogos_do_time = partidas[(partidas['home_team'] == nome_time) | (partidas['away_team'] == nome_time)]
            
            if jogos_do_time.empty:
                return {
                    "sucesso": False, 
                    "dna_tatico": f"Radar sem dados históricos abertos para '{nome_time}'."
                }

            # Se achou o time, pega o ID da primeira partida dele e baixa os eventos DE AGORA
            match_id = jogos_do_time.iloc[0]['match_id']
            eventos = sb.events(match_id=match_id)
            
            # Filtra os chutes do nosso time
            chutes = eventos[(eventos['type'] == 'Shot') & (eventos['team'] == nome_time)]
            
            total_chutes = len(chutes)
            
            if total_chutes > 10:
                dna = "DNA Ofensivo Agressivo (Histórico de alto volume de finalizações)"
            elif total_chutes > 0:
                dna = "DNA Posicional (Foco em construção, poucas finalizações mapeadas)"
            else:
                dna = "Distribuição equilibrada."

            return {
                "sucesso": True,
                "dna_tatico": dna,
                "chutes_encontrados_historico": total_chutes
            }

        except Exception as e:
            # Se a internet cair, a API do Statsbomb der erro, ou não achar nada:
            return {
                "sucesso": False, 
                "dna_tatico": "Radar tático offline ou sem dados.",
                "erro": str(e)
            }