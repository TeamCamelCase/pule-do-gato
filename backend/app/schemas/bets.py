from pydantic import BaseModel
from typing import List, Optional

class JogoSimples(BaseModel):
    id: str
    time_casa: str
    time_fora: str
    # Optional evita que o Pydantic quebre se o campo vier null
    placar: Optional[str] = "0-0"
    tempo: Optional[str] = "0"
    ataques_perigosos_casa: int = 0
    ataques_perigosos_fora: int = 0

class RespostaJogosAoVivo(BaseModel):
    sucesso: bool
    total_jogos: int
    jogos: List[JogoSimples]