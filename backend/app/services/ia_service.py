import os
import json
import re
import google.generativeai as genai
from groq import AsyncGroq
from typing import Dict, Any

class IAService:
    def __init__(self):
        # 1. Setup do Gemini (Primário)
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = None
        
        if gemini_api_key:
            genai.configure(api_key=gemini_api_key)
            try:
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                print("🧠 Cérebro Gemini (Primário) Online com 1.5-Flash.")
            except Exception:
                try:
                    self.gemini_model = genai.GenerativeModel('gemini-pro')
                    print("🧠 Gemini Pro configurado como fallback.")
                except Exception as e:
                    print(f"⚠️ Erro crítico ao configurar Gemini: {e}")

        # 2. Setup do Groq (Redundância de Alta Performance)
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.groq_client = None
        if groq_api_key:
            self.groq_client = AsyncGroq(api_key=groq_api_key)
            print("🚀 Cérebro Groq (Llama 3.3) pronto para Failover.")

    def _extrair_json(self, texto: str) -> dict:
        """Limpa a resposta da IA e extrai apenas o dicionário JSON puro"""
        texto_limpo = re.sub(r'```json\s*|```', '', texto)
        match = re.search(r'\{.*\}', texto_limpo, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError as e:
                print(f"❌ Erro de decodificação JSON: {e}")
                return {}
        return {}

    async def gerar_insight_pule_do_gato(self, dados_cruzados: Dict[str, Any]) -> str:
        prompt = f"""
        Você é o 'Pule do Gato', analista tático de elite. 
        Gere um insight curto focado em MOMENTUM tático e pressão.
        Jogo: {dados_cruzados['ao_vivo'].get('time_casa')} x {dados_cruzados['ao_vivo'].get('time_fora')}
        IP Casa: {dados_cruzados['ao_vivo'].get('ip_casa')} | IP Fora: {dados_cruzados['ao_vivo'].get('ip_fora')}
        Veredito: {dados_cruzados['insight_matematico']}
        """
        if self.gemini_model:
            try:
                response = await self.gemini_model.generate_content_async(prompt)
                return response.text.strip()
            except: pass
        if self.groq_client:
            try:
                chat_completion = await self.groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                )
                return chat_completion.choices[0].message.content.strip()
            except: pass
        return "Processando fluxo tático em tempo real..."

    async def gerar_dashboard_dinamico(self, dados_jogo: Dict[str, Any]) -> Dict[str, Any]:
        # Criamos um ID aleatório no Python para passar para o prompt de forma limpa
        random_id = os.urandom(4).hex()
        
        prompt = f"""
        Você é o 'Pule do Gato', a IA que traduz tática em dinheiro. 
        Analise estes dados: {dados_jogo}

        INSTRUÇÕES DE LINGUAGEM (PROIBIDO SER GENÉRICO):
        1. INTELIGÊNCIA DE CAMPO: Explique o que o padrão significa para o BOLSO.
           - Ruim: 'Bloco Baixo Detectado'.
           - Bom: 'Muralha Detectada: O time visitante está todo recuado. Excelente momento para apostar em ESCANTEIOS, já que eles só vão rebater a bola.'
           - Bom: 'Zaga Exposta: O time da casa está num abafa total. O gol deve sair a qualquer momento. FOCO NO PRÓXIMO GOL.'
        
        2. RECOMENDAÇÃO MASTER: Se usar termos técnicos como HT (Primeiro Tempo) ou FT (Jogo Todo), EXPLIQUE entre parênteses.
           - Ex: 'Mais de 0.5 Gols HT (Aposta que sai pelo menos 1 gol ainda no 1º tempo)'.
        
        3. FOCO: Seja o mentor do apostador. Diga o que fazer.

        RETORNE ESTRITAMENTE O JSON:
        {{
            "fatores_chave": [
                "Diagnóstico tático + O que o apostador deve fazer (Ex: Entre em Cantos)",
                "Ponto de ruptura + O que isso sinaliza (Ex: Gol iminente)",
                "Tendência + Sugestão de mercado"
            ],
            "recomendacao_principal": "Texto claro (Ex: Mais de 0.5 Gols no 1º Tempo)",
            "explicacao_detalhada": "Raciocínio completo sem termos difíceis.",
            "mercados_alternativos": [
                {{"mercado": "Gols", "tip": "Dica clara", "porque": "Explicacao simples"}},
                {{"mercado": "Escanteios", "tip": "Dica clara", "porque": "Explicacao simples"}},
                {{"mercado": "Cartões", "tip": "Dica clara", "porque": "Explicacao simples"}}
            ],
            "probabilidades": {{
                "gol_10min": {{"valor": 80, "texto": "Chance de rede balançar"}},
                "escanteio_proximo": {{"valor": 65, "texto": "Chance de bola na linha de fundo"}},
                "cartao_iminente": {{"valor": 45, "texto": "Chance de falta pesada"}},
                "dominio_territorial": {{"valor": 70, "texto": "Quem manda no campo agora"}}
            }},
            "feed": [
                {{"id": "{random_id}", "tipo": "ataque", "texto": "Insight matador", "tempo": "Agora"}}
            ],
            "projecao_10min": {{
            "titulo": "Chamada agressiva",
            "analise_correlacionada": "Explicação técnica",
            "valor_estimado": "85%",
            "concorrencia_estatistica": "x superior",
            "insights_micro": [
                {{"icon": "zap", "label": "Pressão", "desc": "Ex: 3 chutes nos últimos 2 min"}},
                {{"icon": "target", "label": "Chutes", "desc": "Ex: Time A forçando defesas"}},
                {{"icon": "corner", "label": "Cantos", "desc": "Ex: Tendência de 2 escanteios agora"}}
            ]

        }}
        """

        if self.gemini_model:
            try:
                print("🤖 Processando via Google Gemini...")
                response = await self.gemini_model.generate_content_async(prompt)
                dados_json = self._extrair_json(response.text)
                if dados_json:
                    print("✅ Dashboard gerado pelo Gemini!")
                    return dados_json
            except Exception as e:
                print(f"⚠️ Gemini falhou: {e}")

        if self.groq_client:
            try:
                print("🚀 Redirecionando para Groq (Llama 3.3)...")
                chat_completion = await self.groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "Você é uma API. Responda apenas o objeto JSON puro."},
                        {"role": "user", "content": prompt}
                    ],
                    model="llama-3.3-70b-versatile",
                    temperature=0.2,
                )
                dados_json = self._extrair_json(chat_completion.choices[0].message.content)
                if dados_json:
                    print("✅ Dashboard recuperado pelo Groq Llama-3.3!")
                    return dados_json
            except Exception as e:
                print(f"❌ Groq também falhou: {e}")

        return {{}}