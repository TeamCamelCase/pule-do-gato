import type { Partida } from "../types";

interface Props {
  partida: Partida;
}

const MatchCard = ({ partida }: Props) => {
  return (
    <div className="match">
      <div>
        <p>{partida.casa}</p>
        <p>{partida.fora}</p>
      </div>

      <h2>{partida.placar}</h2>

      <span className="status">{partida.tempo}</span>
    </div>
  );
};

export default MatchCard;
