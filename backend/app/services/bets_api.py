import os
import httpx
import time
from typing import Dict, Any
from app.schemas.bets import JogoSimples, RespostaJogosAoVivo

class BetsAPIService:
    def __init__(self):
        self.base_url = "https://api.b365api.com/v1"
        self.token = os.getenv("BETS_API_TOKEN")
        
        self._cache_jogos = None
        self._ultima_atualizacao = 0
        self.TEMPO_CACHE_SEGUNDOS = 20 # Só bate na API real a cada 20s

        # IDs das Ligas Principais na BetsAPI (Ex: Premier League, La Liga, Serie A)
        self.LIGAS_PERMITIDAS = ["39", "140", "135", "78", "61"] 

    async def get_live_events_cleaned(self, sport_id: int = 1) -> RespostaJogosAoVivo:
        agora = time.time()
        
        # Retorna o cache se ainda for válido
        if self._cache_jogos and (agora - self._ultima_atualizacao < self.TEMPO_CACHE_SEGUNDOS):
            print("⚡ Retornando jogos do Cache em memória...")
            return self._cache_jogos

        url = f"{self.base_url}/events/inplay"
        params = {"token": self.token, "sport_id": sport_id}
        
        print("🌐 Buscando jogos REAIS na BetsAPI...")
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                raw_data = response.json()
                
                lista_limpa = []
                for item in raw_data.get("results", []):
                    # FILTRO DE LIGA: Só aceita se estiver na nossa lista VIP
                    liga_id = str(item.get("league", {}).get("id", ""))
                    
                    # if liga_id not in self.LIGAS_PERMITIDAS:
                    #     continue # Pula jogos irrelevantes
                    
                    placar_seguro = item.get("ss") or "0-0"
                    tempo_seguro = str(item.get("timer", {}).get("tm", "0"))
                    
                    lista_limpa.append(JogoSimples(
                        id=str(item.get("id", "0")),
                        time_casa=item.get("home", {}).get("name", "Desconhecido"),
                        time_fora=item.get("away", {}).get("name", "Desconhecido"),
                        placar=str(placar_seguro),
                        tempo=tempo_seguro
                    ))
                
                # Salva no cache
                resposta = RespostaJogosAoVivo(sucesso=True, total_jogos=len(lista_limpa), jogos=lista_limpa)
                self._cache_jogos = resposta
                self._ultima_atualizacao = agora
                
                return resposta

            except Exception as e:
                print(f"❌ Erro na BetsAPI: {e}")
                # Se der erro e tiver cache antigo, devolve o cache para não quebrar a tela
                if self._cache_jogos:
                    return self._cache_jogos
                return RespostaJogosAoVivo(sucesso=False, total_jogos=0, jogos=[])

    async def get_event_stats_real(self, event_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/event/view"
        params = {"token": self.token, "event_id": event_id}
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(url, params=params)
                data = response.json()
                if data.get("success") == 1:
                    res = data.get("results", [{}])[0]
                    st = res.get("stats", {})
                    tm = res.get("timer", {})
                    
                    # CAPTURANDO OS NOMES REAIS DOS TIMES AQUI 👇
                    time_casa_real = res.get("home", {}).get("name", "Desconhecido")
                    time_fora_real = res.get("away", {}).get("name", "Desconhecido")
                    
                    tempo = int(tm.get("tm", 1))
                    if tempo == 0: tempo = 1
                    
                    def parse_ap(index):
                        try: return int(st.get("dangerous_attacks")[index])
                        except: return 0

                    ap_c = parse_ap(0)
                    ap_f = parse_ap(1)
                    
                    ip_c = round(ap_c / tempo, 2)
                    ip_f = round(ap_f / tempo, 2)

                    return {
                        "sucesso": True,
                        "event_id": event_id,
                        "time_casa": time_casa_real, # Adicionado!
                        "time_fora": time_fora_real, # Adicionado!
                        "tempo": tempo,
                        "ap_casa": ap_c,
                        "ap_fora": ap_f,
                        "ip_casa": ip_c,
                        "ip_fora": ip_f,
                        "alerta": "CRÍTICO" if (ip_c > 1.1 or ip_f > 1.1) else "NORMAL"
                    }
                return {"sucesso": False, "erro": "Sem dados"}
            except Exception as e:
                return {"sucesso": False, "erro": str(e)}