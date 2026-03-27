import os
import json
import re
import google.generativeai as genai
from groq import AsyncGroq
from typing import Dict, Any
import uuid
import time

class IAService:
    def __init__(self):
        # Cache interno para evitar estourar cota (Rate Limit) de APIs gratuitas
        self.cache_analises = {}
        self.cache_duration = 60  # Segundos de validade do cache

        # 1. SETUP GEMINI (Primário)
        # Ajustado para usar nomes de modelos universais e evitar erro 404
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = None
        
        if gemini_api_key:
            genai.configure(api_key=gemini_api_key)
            try:
                # 'gemini-1.5-flash' é o mais rápido e estável para JSON
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')
                print("🧠 Cérebro Gemini (Primário) Online.")
            except Exception:
                try:
                    # Fallback para o Pro caso o Flash não esteja disponível na região
                    self.gemini_model = genai.GenerativeModel('gemini-pro')
                    print("🧠 Gemini Pro (Fallback) Online.")
                except Exception as e:
                    print(f"⚠️ Erro crítico no setup do Gemini: {e}")

        # 2. SETUP GROQ (Redundância / Failover)
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.groq_client = None
        if groq_api_key:
            # .strip() limpa espaços invisíveis que quebram a chave no Windows
            self.groq_client = AsyncGroq(api_key=groq_api_key.strip())
            print("🚀 Cérebro Groq (Llama 3.3) Online para redundância.")

    def _extrair_json(self, texto: str) -> dict:
        """Limpa a resposta da IA e garante a extração do objeto JSON puro"""
        try:
            # Remove marcações de Markdown (```json ... ```)
            texto_limpo = re.sub(r'```json\s*|```', '', texto).strip()
            
            # Localiza o primeiro { e o último } para isolar o objeto
            inicio = texto_limpo.find('{')
            fim = texto_limpo.rfind('}') + 1
            
            if inicio != -1 and fim != 0:
                json_str = texto_limpo[inicio:fim]
                return json.loads(json_str)
            return {}
        except Exception as e:
            print(f"❌ Erro na decodificação do JSON da IA: {e}")
            return {}

    async def gerar_dashboard_dinamico(self, dados_jogo: Dict[str, Any]) -> Dict[str, Any]:
        # 1. CAPTURA DE ID REAL (Evita o erro de 'ID temp' que quebra o cache)
        jogo_id = "temp"
        if isinstance(dados_jogo, dict):
            ao_vivo = dados_jogo.get('ao_vivo', {})
            # Tenta pegar das chaves geradas no main.py ou da BetsAPI
            jogo_id = str(ao_vivo.get('id') or ao_vivo.get('event_id') or dados_jogo.get('id') or 'temp')
        
        print(f"🔍 Analisando Jogo ID: {jogo_id}")

        # 2. VERIFICAÇÃO DE CACHE (Escalabilidade para o Pitch)
        if jogo_id != 'temp' and jogo_id in self.cache_analises:
            cache_data = self.cache_analises[jogo_id]
            if time.time() - cache_data['timestamp'] < self.cache_duration:
                print(f"♻️  Usando Cache para o jogo {jogo_id}")
                return cache_data['dados']

        # 3. CONSTRUÇÃO DO PROMPT ESTRUTURADO (Garante que a IA não invente chaves)
        random_uid = str(uuid.uuid4())[:8]
        prompt = f"""
        Analise os dados desta partida de futebol ao vivo: {dados_jogo}
        
        Como um Trader Esportivo Profissional, retorne ESTRITAMENTE um JSON com esta estrutura:
        {{
            "fatores_chave": ["Análise 1", "Análise 2", "Análise 3"],
            "recomendacao_principal": "Sugestão clara (ex: Over 0.5 HT)",
            "explicacao_detalhada": "Raciocínio tático simplificado",
            "mercados_alternativos": [ {{"mercado": "Gols", "tip": "Dica", "porque": "Motivo"}} ],
            "probabilidades": {{
                "gol_10min": {{"valor": 80, "texto": "Ex: Pressão alta"}},
                "escanteio_proximo": {{"valor": 60, "texto": "Ex: Bolas alçadas"}},
                "cartao_iminente": {{"valor": 30, "texto": "Ex: Jogo limpo"}},
                "dominio_territorial": {{"valor": 70, "texto": "Ex: Posse no ataque"}}
            }},
            "feed": [ {{"id": "{random_uid}", "tipo": "ataque", "texto": "Insight", "tempo": "Agora"}} ],
            "projecao_10min": {{
                "titulo": "Crie uma manchete curta e impactante baseada no jogo (Ex: PRESSÃO TOTAL DO CITY ou GOL IMINENTE)",
                "analise_correlacionada": "Explique o porquê da manchete usando os dados de chutes e DNA tático.",
                "valor_estimado": "85%",
                "concorrencia_estatistica": "2.5x",
                "insights_micro": [ 
                    {{"icon": "zap", "label": "Pressão", "desc": "Texto curto"}},
                    {{"icon": "target", "label": "Chutes", "desc": "Texto curto"}}
                ]
            }}
        }}
        Responda APENAS o objeto JSON.
        """

        resultado_final = None

        # 4. EXECUÇÃO COM FAILOVER (Resiliência contra queda de API)
        # TENTATIVA 1: GEMINI
        if self.gemini_model:
            try:
                print("🤖 Chamando Google Gemini...")
                response = await self.gemini_model.generate_content_async(prompt)
                resultado_final = self._extrair_json(response.text)
                if resultado_final: print("✅ Sucesso via Gemini!")
            except Exception as e:
                print(f"⚠️ Gemini falhou (tentando Groq): {e}")

        # TENTATIVA 2: GROQ (Se Gemini falhou ou não existe)
        if not resultado_final and self.groq_client:
            try:
                print("🚀 Chamando Groq (Llama 3.3)...")
                chat = await self.groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.2
                )
                resultado_final = self._extrair_json(chat.choices[0].message.content)
                if resultado_final: print("✅ Sucesso via Groq!")
            except Exception as e:
                print(f"❌ Groq também falhou: {e}")

        # 5. FALLBACK DE CONTINGÊNCIA (Garante que o app nunca trave no Pitch)
        if not resultado_final:
            print("🚨 MODO CONTINGÊNCIA ATIVADO (Não salvando no Cache)")
            return {
                "fatores_chave": ["Sincronizando telemetria...", "Mapeando pressão", "Aguardando sinal"],
                "recomendacao_principal": "Aguardando Veredito da IA...",
                "explicacao_detalhada": "O motor tático está recalibrando os índices de pressão para este confronto.",
                "mercados_alternativos": [],
                "probabilidades": {"gol_10min": {"valor": 0, "texto": "Calculando..."}},
                "feed": [{"id": random_uid, "tipo": "alerta", "texto": "Conectando ao fluxo de dados...", "tempo": "Agora"}],
                "projecao_10min": {"titulo": "PROCESSANDO...", "analise_correlacionada": "Aguardando dados...", "valor_estimado": "0%", "concorrencia_estatistica": "0x", "insights_micro": []}
            }

        # 6. SÓ SALVA NO CACHE SE TIVER SUCESSO REAL
        self.cache_analises[jogo_id] = {
            'timestamp': time.time(),
            'dados': resultado_final
        }

        return resultado_final
    # No seu backend/app/services/ia_service.py

    async def gerar_insight_jogador(self, perfil_jogador: dict) -> str:
        """Gera uma dica de aposta baseada nos números REAIS do scouting."""
        scouting = perfil_jogador.get('scouting', {})
        
        prompt = f"""
        Analise os dados deste jogador para o jogo de hoje:
        Nome: {scouting.get('nome')}
        Gols na Temporada: {scouting.get('gols_na_temporada')}
        Cartões Amarelos: {scouting.get('cartoes_amarelos')}
        Média de Chutes ao Gol/90min: {scouting.get('chutes_no_gol_media')}

        Como um Trader Profissional, dê uma dica de aposta CURTA (1 linha) para este jogador.
        Ex: 'Sugestão: Entrada em +0.5 chutes ao gol devido à média de {scouting.get('chutes_no_gol_media')}.'
        Seja agressivo e use os números fornecidos.
        """
        
        if self.gemini_model:
            try:
                response = await self.gemini_model.generate_content_async(prompt)
                return response.text.strip()
            except:
                return "Análise tática indisponível."
        return "💡 Dica: Over 0.5 Finalizações para este perfil."
    