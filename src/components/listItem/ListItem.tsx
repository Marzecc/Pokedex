import React from "react";
import { PokemonShortInfo } from "../../Model";

// chciałbym aby kliknięcie w pokemona

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
      // "_" = argument przyjmujemy, ale nie jest wykorzystany (pomocnicze)
      onClick={(_) => onButtonClick(pokeInfo)}
    >
      {pokeInfo.name}
    </button>
  );
}
export default ListItem;
