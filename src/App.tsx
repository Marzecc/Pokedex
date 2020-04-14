import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  getAllPokemon,
  getPokemonType,
  getFilteredPokemons,
  getDisplayedPokemon,
} from "./services/PokeApiClient";
import {
  PokemonPage,
  PokemonShortInfo,
  TypePage,
  FilteredPokemons,
  PokemonDetails,
  PokemonImage,
  PokemonStats,
  StatName,
} from "./Model";
import { ListItem } from "./components/listItem/ListItem";
import FilterOption from "./components/listFilter/FilterOption";

function App() {
  const [pokemonPage, setPokemonPage] = useState<PokemonPage | null>(null);
  const [visiblePokemon, setVisiblePokemon] = useState<Array<PokemonShortInfo>>(
    []
  );
  const [availableTypes, setAvailableTypes] = useState<TypePage | null>(null);
  const [chosenTypeFilter, setChosenTypeFilter] = useState<string>("");
  const [filteredPokemons, setFilteredPokemons] = useState<
    Array<PokemonShortInfo>
  >([]);

  const [displayVisible, setDisplayVisible] = useState<
    "pokemon_info_not_holder" | "pokemon_info_holder"
  >("pokemon_info_not_holder");

  const [
    displayedPokemon,
    setDisplayedPokemon,
  ] = useState<PokemonDetails | null>(null);

  const INITIAL_URL: string = "https://pokeapi.co/api/v2/pokemon";
  const TYPE_URL: string = "https://pokeapi.co/api/v2/type";
  let [offset, setOffset] = useState<number>(0);
  const LIMIT = 20;

  // 1. Kliknięcie w listItem zmienia styl kontenera z info
  // 2. Kliknięcie w listItem bierze info (nadpisuje stan ) z INITIAL_URL + "/" + pokemon.name
  // 3. Z pobranych info wyciąga : name, basestat hp [5], base stat attack [4],

  // FETCHOWANIE POKEMON PAGE
  async function fetchData(url?: string) {
    if (!url) {
      return;
    }
    let response: PokemonPage = await getAllPokemon(url);
    setPokemonPage(response);
    setVisiblePokemon(response.results);
  }
  // FETCHOWANIE POKEMON TYPE
  async function fetchPokemonType(typeURL: string) {
    if (!typeURL) {
      return;
    }
    let responseData: TypePage = await getPokemonType(typeURL);
    setAvailableTypes(responseData);
  }
  // ŁADOWANIE KOMPONENTÓW
  useEffect(() => {
    fetchPokemonType(TYPE_URL);
    fetchData(INITIAL_URL);
  }, []);

  function alertFetchFail(reason: any): void {
    alert("Cannot fetch data, reason: " + reason);
  }

  // WYWOŁYWANIE DETALI POKEMONÓW
  function pokemonButtonClicked(pokemonShortInfo: PokemonShortInfo) {
    // fetchował potrzebne info pokemona z URL
    // przypisywał je do displayedPokemon
    // Zmieniał z index kontenera
    getDisplayedPokemon(INITIAL_URL + "/" + pokemonShortInfo.name).then(
      (displayedPokes: PokemonDetails) => {
        setDisplayedPokemon(displayedPokes);
        setDisplayVisible("pokemon_info_holder");
      }
    );
  }
  // ZAMYKANIE DISPALY
  function closeModal() {
    setDisplayVisible("pokemon_info_not_holder");
    setDisplayedPokemon(null);
  }

  // PRZYPISYWANIE AKCJI DO LISTY POKEMONÓW
  const listItem: Array<JSX.Element> = visiblePokemon.map((pokemon) =>
    ListItem(pokemon, pokemonButtonClicked)
  );

  // PRZYPISYWANIE TABLICY TYPÓW DO OPCJI SELECT
  const filterOption = availableTypes?.results.map(FilterOption);

  // PEŁNA LISTA POKEMONOW Z PAGINACJI
  function getPokemonPaginateLink(offset: number, LIMIT: number): string {
    return (
      "https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=" + LIMIT
    );
  }
  // const allPokemonsPaginateLink: string =
  //   "https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=" + LIMIT;

  // SPRAWDZANIE CZY FILTRY SĄ AKTYWNE
  function isFilterActive(): boolean {
    return chosenTypeFilter !== "";
  }

  // DOSTOSOWYWANIE LISTY POKEMONÓW PO WYBRANYM FILTRZE
  function fetchPokemonsByFilter() {
    getFilteredPokemons(TYPE_URL + "/" + chosenTypeFilter)
      .then((filteredPokemon: FilteredPokemons) => {
        let pokemonInfos: Array<PokemonShortInfo> = filteredPokemon.pokemon.map(
          (wrapper) => wrapper.pokemon
        );
        setFilteredPokemons(pokemonInfos);
        setOffset(0);
        setVisiblePokemon(pokemonInfos.slice(0, LIMIT));
      })
      .catch((reason) => alertFetchFail(reason));
  }

  // POBIERANIE 20 POKEMTÓW BEZ FILTRA - A STRUKTURY API
  function fetchAllPokemons() {
    getAllPokemon(INITIAL_URL)
      .then((allPokemon: PokemonPage) => {
        let allPokemons: Array<PokemonShortInfo> = allPokemon.results;
        setVisiblePokemon(allPokemons);
      })
      .catch((reason) => alertFetchFail(reason));
  }

  // FETCHOWANIE POKEMONÓW ZALEŻNIE OD AKTYWNEGO FILTRA
  function fetchPokemons() {
    if (isFilterActive()) {
      fetchPokemonsByFilter();
    } else {
      fetchAllPokemons();
    }
  }

  // FUNKCJA WYWOŁUJĄCA ZMIANĘ STRONY NA POPRZEDNIĄ
  function previousPage() {
    // czy bierzemy nastepny pokemonPage, czy liste pokemonow po typie
    if (isFilterActive()) {
      filteredPreviousPage();
    } else {
      allPokemonPreviousPage();
    }
  }

  // POPRZEDNIA STRONA LISTY POKEMONÓW PO FILTRZE
  function filteredPreviousPage() {
    if (offset === 0) {
      return;
    }
    let newOffset = (offset -= LIMIT);
    setOffset(newOffset);
    const sliceVisiblePokemons = filteredPokemons.slice(offset, offset + LIMIT);
    setVisiblePokemon(sliceVisiblePokemons);
  }

  // POPRZEDNA STRONA LIŚCIE BEZ FILTRÓW
  function allPokemonPreviousPage() {
    if (offset === 0) {
      return;
    }

    let newOffset = (offset -= LIMIT);
    setOffset(newOffset);

    getAllPokemon(getPokemonPaginateLink(newOffset, LIMIT))
      .then((allPokemon: PokemonPage) => {
        // let allPokemons : Array<PokemonShortInfo> = ;
        setVisiblePokemon(allPokemon.results);
      })
      .catch((reason: any) => alertFetchFail(reason));
  }

  // FUNKCJA WYWOŁUJĄCA ZMIANĘ STRONY NA KOLEJNĄ

  function nextPage() {
    if (isFilterActive()) {
      filteredNextPage();
    } else {
      allPokemonNextPage();
    }
  }

  // KOLEJNA STRONA LISTY POKEMONÓW PO FILTRZE
  function filteredNextPage() {
    if (filteredPokemons.length <= offset + LIMIT) {
      return;
    }
    let newOffset = (offset += LIMIT);
    setOffset(newOffset);
    const sliceVisiblePokemons = filteredPokemons.slice(offset, offset + LIMIT);
    setVisiblePokemon(sliceVisiblePokemons);
  }

  // KOLEJNA STRONA LISTY POKEMONÓW BEZ FILTRA
  function allPokemonNextPage() {
    if (pokemonPage == null || pokemonPage.count <= offset + LIMIT) {
      return;
    }
    let newOffset = (offset += LIMIT);
    setOffset(newOffset);

    getAllPokemon(getPokemonPaginateLink(newOffset, LIMIT)).then(
      (allPokemon: PokemonPage) => {
        let allPokemons: Array<PokemonShortInfo> = allPokemon.results;
        setVisiblePokemon(allPokemons);
      }
    );
  }

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
    <div className="App">
      {/* KONTENER NA CAŁOŚĆ */}
      <div className="contaner_components nes-container  ">
        {/* FILTRY PO POKEMONACH */}
        <div className="filters nes-container with-title  is-rounded">
          <p className="title"> FILTER POKEMONS </p>

          <label htmlFor="default_select" className="select_type">
            Filter by type
          </label>
          <div className="nes-select">
            {/* FILTER ONE */}
            <select
              required
              id="default_select"
              defaultValue=""
              onChange={(e) => {
                setChosenTypeFilter(e.target.value);
              }}
            >
              <option value="">No filter</option>
              {filterOption}
            </select>
          </div>
          <div className="show-pokemon">
            <button
              type="button"
              className="nes-btn is-primary btn--filt"
              onClick={() => fetchPokemons()}
            >
              SEE YOUR POKEMONS!
            </button>
          </div>
        </div>

        {/* POKEBALL */}
        <div className="spacer">
          <i className="nes-logo"></i>
        </div>

        {/* KONTENER WYŚWIETLAJĄCY LISTĘ POKEMONÓW */}
        <div className="container_display-pokemon-list nes-container with-title  is-rounded">
          <p className="title"> SEE MORE INFO </p>

          {/* LIST OF ITEMS */}
          <div className="pokemon-list nes-container is-rounded">
            {listItem}
          </div>

          {/* LIST PAGINATION */}
          <div className="pagination_holder">
            <button
              type="button"
              onClick={() => previousPage()}
              className="nes-btn is-primary btn-previous-page"
            >
              PREVIOUS
            </button>
            <button
              type="button"
              onClick={() => nextPage()}
              className="nes-btn is-primary btn-next-page"
            >
              NEXT
            </button>
          </div>
        </div>

        {/* BLANK SPACE COVERING DISPLAY */}
        <div className="blank_cover"></div>

        {/* POKEMON DETAIL DISPLAY */}
        <div className={displayVisible}>
          <div className="img_holder">
            <h1> {displayedPokemon?.name} </h1>
            <img
              className="pokemon-image"
              src={imageForPokemon(displayedPokemon?.sprites)}
              alt="displayed pokemon"
            ></img>
          </div>

          <div className="info-holder nes-container is-centered">
            <p className="nes-text is-success">HEALTH:</p>
            <h3 className="nes-text is-success">{getStat("hp")}</h3>
            <p className="nes-text is-error">ATTACK:</p>
            <h3 className="nes-text is-error">{getStat("attack")}</h3>

            <p className="nes-text is-primary">BASE EXPERIENCE:</p>
            <h3 className="nes-text is-primary">
              {displayedPokemon?.base_experience}
            </h3>

            {/* <p className="nes-text is-error">Error</p>
            <p className="nes-text is-disabled">Disabled</p> */}
          </div>
          {/* CLOSING DISPLAY BUTTON   */}
          <button
            type="button"
            className="nes-btn is-primary close-display"
            onClick={() => closeModal()}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
