import type { Liga } from "../types/index";

interface Props {
  liga: Liga;
}

const CardLiga = ({ liga }: Props) => {
  return (
    <div className={`card ${liga.destaque ? "highlight" : ""}`}>
      <h3>{liga.nome}</h3>
      <p>{liga.descricao}</p>

      <div className="actions">
        <button className="green">Ver Odds</button>
        <button>Análise Pro</button>
      </div>
    </div>
  );
};

export default CardLiga;
