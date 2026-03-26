import asyncio
import json
import os
from dotenv import load_dotenv
from app.services.bets_api import BetsAPIService

load_dotenv()

async def coletar_dados_ativos():
    service = BetsAPIService()
    print("🚀 Olheiro AI: Iniciando coleta ativa de estatísticas reais...")
    
    try:
        lista_inicial = await service.get_live_events_cleaned()
        # Pegamos os primeiros 10 para o mock não demorar muito
        jogos = lista_inicial.jogos[:10] 
        
        resultados = []
        for jogo in jogos:
            print(f"  ⚽ Analisando pressão: {jogo.time_casa}...")
            stats = await service.get_event_stats_real(jogo.id)
            
            if stats["sucesso"]:
                jogo.ataques_perigosos_casa = stats["ap_casa"]
                jogo.ataques_perigosos_fora = stats["ap_fora"]
            
            resultados.append(jogo.model_dump())
            await asyncio.sleep(0.3) # Delay de segurança

        with open("mock_jogos.json", "w", encoding="utf-8") as f:
            json.dump({"sucesso": True, "total_jogos": len(resultados), "jogos": resultados}, 
                      f, indent=4, ensure_ascii=False)
            
        print("\n✅ Concluído! mock_jogos.json atualizado com IPs reais.")

    except Exception as e:
        print(f"❌ Erro crítico: {e}")

if __name__ == "__main__":
    asyncio.run(coletar_dados_ativos())