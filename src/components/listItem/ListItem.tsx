import React from "react";
import { PokemonShortInfo } from "../../Model";


export function ListItem(
  pokeInfo: PokemonShortInfo,
  onButtonClick: (x: PokemonShortInfo) => void
): JSX.Element {
  return (
    <button
      key={pokeInfo.name}
      type="button"
      value={pokeInfo.name}
      className="nes-btn is-primary list-item"
      onClick={(_) => onButtonClick(pokeInfo)}
    >
      {pokeInfo.name}
    </button>
  );
}
export default ListItem;
