import os
import json
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from app.services.bets_api import BetsAPIService
from app.schemas.bets import RespostaJogosAoVivo

load_dotenv()

app = FastAPI(title="Olheiro AI - O Pulo do Gato")
bets_service = BetsAPIService()

@app.get("/jogos-ao-vivo", response_model=RespostaJogosAoVivo)
async def listar_jogos():
    return await bets_service.get_live_events_cleaned()

@app.get("/jogos-mock", response_model=RespostaJogosAoVivo)
async def listar_jogos_mock():
    try:
        with open("mock_jogos.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Gere o mock: python gerar_mock.py")

@app.get("/jogos/{event_id}/estatisticas")
async def obter_estatisticas(event_id: str):
    dados = await bets_service.get_event_stats_real(event_id)
    if not dados["sucesso"]:
        raise HTTPException(status_code=404, detail=dados.get("erro"))
    return dados