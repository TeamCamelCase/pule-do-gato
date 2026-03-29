import os
import asyncio
from app.services.scouting_service import ScoutingService
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Importando os Schemas e Serviços
from app.schemas.bets import RespostaJogosAoVivo
from app.services.bets_api import BetsAPIService
from app.services.fbref_service import FBrefService
from app.services.ia_service import IAService
from app.services.statsbomb_service import StatsbombService 

# Carrega as variáveis do arquivo .env
load_dotenv()

# Inicializa o FastAPI
app = FastAPI(title="Pule do Gato AI - Backend")

# Libera o CORS para o Frontend (Vite na porta 5173) conseguir se conectar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pule-do-gato.vercel.app","https://pule-do-gato-kappa.vercel.app", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instanciando os serviços
bets_service = BetsAPIService()
fbref_service = FBrefService()         
ia_service = IAService()               
statsbomb_service = StatsbombService()
scouting_service = ScoutingService(fbref_service)

@app.get("/jogos-ao-vivo", response_model=RespostaJogosAoVivo)
async def listar_jogos():
    """Rota para a tela inicial: tenta buscar na BetsAPI, se travar, manda Mock de segurança"""
    try:
        # Tenta buscar os jogos com um limite de tempo de 5 segundos
        return await asyncio.wait_for(bets_service.get_live_events_cleaned(), timeout=5.0)
    except asyncio.TimeoutError:
        print("ALERTA: BetsAPI demorou muito para responder! Usando dados de contingência.")
        # Retorna jogos falsos para o frontend não travar no (pending)
        return {"jogos": [
            { "id": "11654723", "time_casa": "Arsenal (Simaponika)", "time_fora": "A.Madrid (tohi4)", "placar": "0-0", "tempo": "6", "ip_casa": 1.5, "ip_fora": 0.5, "alerta": "CRÍTICO" },
            { "id": "11654724", "time_casa": "Flamengo", "time_fora": "Vasco", "placar": "1-0", "tempo": "78", "ip_casa": 2.1, "ip_fora": 0.2, "alerta": "NORMAL" }
        ]}
    except Exception as e:
        print(f"Erro na BetsAPI: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no radar de jogos.")

@app.get("/jogos/{event_id}/analise-cruzada")
async def obter_analise_completa(event_id: str):
    """Rota de Raio-X: cruza BetsAPI, FBref, StatsBomb e IA para um jogo específico"""
    
    # 1. Busca como está o jogo AGORA e pega os nomes reais na BetsAPI
    dados_ao_vivo = await bets_service.get_event_stats_real(event_id)
    if not dados_ao_vivo["sucesso"]:
        raise HTTPException(status_code=404, detail="Jogo não encontrado na BetsAPI")

    # 2. Pega o nome REAL do time que a BetsAPI acabou de nos dar
    nome_time_casa = dados_ao_vivo.get("time_casa", "Casa")
    nome_time_fora = dados_ao_vivo.get("time_fora", "Fora")
    
    # 3. Busca o histórico no FBref
    historico_casa = fbref_service.buscar_destaques_time(nome_time_casa)
    historico_fora = fbref_service.buscar_destaques_time(nome_time_fora)

    # 4. Busca o DNA Tático no StatsBomb
    tatico_casa = statsbomb_service.analisar_zona_de_ataque(nome_time_casa)
    tatico_fora = statsbomb_service.analisar_zona_de_ataque(nome_time_fora)

    # 5. O Cálculo de Pressão Inicial (Motor Matemático)
    probabilidade_gol = "Média"
    if dados_ao_vivo.get("ip_casa", 0) > 1.0 and historico_casa.get("forca_ofensiva_xg", 0) > 10.0:
        probabilidade_gol = f"ALTÍSSIMA 🚨 (Pressão do {nome_time_casa})"
    elif dados_ao_vivo.get("ip_fora", 0) > 1.0 and historico_fora.get("forca_ofensiva_xg", 0) > 10.0:
        probabilidade_gol = f"ALTÍSSIMA 🚨 (Pressão do {nome_time_fora})"

    # 6. Monta o dicionário com toda a matemática e dados crus
    dados_basicos = {
        "ao_vivo": dados_ao_vivo,
        "historico_casa_fbref": historico_casa,
        "historico_fora_fbref": historico_fora,
        "tatico_casa_statsbomb": tatico_casa, 
        "tatico_fora_statsbomb": tatico_fora, 
        "insight_matematico": probabilidade_gol
    }

    # 7. A MÁGICA: Pede para a IA gerar o JSON dinâmico
    try:
        dashboard_ia = await ia_service.gerar_dashboard_dinamico(dados_basicos)
    except Exception as e:
        print(f"⚠️ Erro na IA: {e}")
        dashboard_ia = {}

    # 8. ESTRUTURA DE SEGURANÇA (Garante que o Front não quebre se a IA vier vazia)
    # Se dashboard_ia estiver vazio, preenchemos com o "Modo de Espera"
    if not dashboard_ia or "probabilidades" not in dashboard_ia:
        dashboard_ia = {
            "fatores_chave": ["Sincronizando telemetria tática...", "Mapeando zonas de calor", "Aguardando sinal estável"],
            "recomendacao_principal": "Analisando Momentum do Jogo...",
            "explicacao_detalhada": "O motor tático está processando os dados de pressão (IP) e xG para gerar um veredito.",
            "mercados_alternativos": [],
            "probabilidades": {
                "gol_10min": {"valor": 0, "texto": "Calculando..."},
                "escanteio_proximo": {"valor": 0, "texto": "Aguardando..."},
                "cartao_iminente": {"valor": 0, "texto": "Monitorando..."},
                "dominio_territorial": {"valor": 0, "texto": "Mapeando..."}
            },
            "feed": [{"id": "loading", "tipo": "alerta", "texto": "Conectando ao fluxo de dados ao vivo...", "tempo": "Agora"}],
            "projecao_10min": {
                "titulo": "PROCESSANDO...",
                "analise_correlacionada": "Aguardando volume de jogo suficiente.",
                "valor_estimado": "0%",
                "concorrencia_estatistica": "0x",
                "insights_micro": []
            }
        }

    # 9. Mescla e Retorna
    # Damos preferência aos dados da IA, mas mantemos o ao_vivo para o placar
    return {**dados_basicos, **dashboard_ia}

@app.get("/jogadores/{player_id}/perfil")
async def obter_perfil_jogador(player_id: str, nome: str = "Hulk"): 
    # Aqui chamamos o ScoutingService que criamos
    perfil = scouting_service.obter_perfil_jogador(player_id, nome)
    
    # Pedimos para a IA gerar o insight baseado no scouting
    insight = await ia_service.gerar_insight_jogador(perfil)
    
    return {**perfil, "insight_ia": insight}

@app.get("/jogos/zebras")
async def buscar_zebras_reais():
    # 1. Busca os jogos que estão rolando de verdade na API de apostas
    jogos_ao_vivo = await bets_service.get_live_matches() 
    
    zebras_detectadas = []
    
    for jogo in jogos_ao_vivo:
        # Lógica simples: se o time com IP menor está ganhando ou empatando
        if jogo['ip_zebra'] > jogo['ip_favorito']:
            # 2. Só aqui a IA entra para dar o "Pulo do Gato" tático
            analise = await ia_service.analisar_contexto_zebra(
                mandante=jogo['home_team'], 
                visitante=jogo['away_team'], 
                placar=jogo['score']
            )
            zebras_detectadas.append(analise)
            
    return zebras_detectadas