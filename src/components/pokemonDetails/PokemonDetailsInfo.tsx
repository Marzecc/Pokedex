import React from "react";
import {
  PokemonDetails,
  PokemonImage,
  StatName,
  PokemonStats,
} from "../../Model";

/* pokemon detail display */
export function PokemonDetailsInfo(
  displayedPokemon: PokemonDetails,
  onCloseClicked: () => void
) {
  // 
  function imageForPokemon(pokemonImage: PokemonImage | undefined): string {
    return pokemonImage?.front_default === null ||
      pokemonImage?.front_default === undefined
      ? "pokeball.png"
      : pokemonImage.front_default;
  }

  function getStat(stat: StatName): number | undefined {
    return displayedPokemon?.stats.filter(
      (statObj: PokemonStats) => statObj.stat.name === stat
    )[0].base_stat;
  }

  return (
    <div className="info-display">
      <div className="info-image-holder">
        <h1> {displayedPokemon?.name} </h1>
        <img
          className="info-image"
          src={imageForPokemon(displayedPokemon?.sprites)}
          alt="displayed pokemon"
        ></img>
      </div>

      <div className="info-stats nes-container is-centered ">
        <p className="stat nes-text  is-success">HEALTH:</p>
        <h3 className="stat nes-text is-success">{getStat("hp")}</h3>
        <p className="stat nes-text is-error">ATTACK:</p>
        <h3 className="stat nes-text is-error">{getStat("attack")}</h3>

        <p className="stat nes-text is-primary">BASE EXPERIENCE:</p>
        <h3 className="stat nes-text is-primary">
          {displayedPokemon?.base_experience}
        </h3>
      </div>
      {/* closing display button  */}
      <button
        type="button"
        className="close-display nes-btn is-primary "
        onClick={() => onCloseClicked()}
      >
        CLOSE
      </button>
    </div>
  );
}
