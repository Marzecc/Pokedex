import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  getAllPokemon,
  getPokemonType,
  getFilteredPokemons,
  getDisplayedPokemon,
  getFromUrl,
} from "./services/PokeApiClient";

import {
  PokemonPage,
  PokemonShortInfo,
  TypePage,
  FilteredPokemons,
  PokemonDetails,

} from "./Model";

import ListItem from "./components/listItem/ListItem";
import FilterOption from "./components/listFilter/FilterOption";
import { PokemonDetailsInfo } from "./components/pokemonDetails/PokemonDetailsInfo";
const INITIAL_URL: string = "https://pokeapi.co/api/v2/pokemon";
const TYPE_URL: string = "https://pokeapi.co/api/v2/type";
const LIMIT = 20;

function App() {
  const [allPokemon, setAllPokemon] = useState<PokemonPage | null>(null);
  const [visiblePokemon, setVisiblePokemon] = useState<Array<PokemonShortInfo>>(
    []
  );
  const [availableTypes, setAvailableTypes] = useState<TypePage | null>(null);
  const [chosenTypeFilter, setChosenTypeFilter] = useState<string>("");
  const [filteredPokemons, setFilteredPokemons] = useState<
    Array<PokemonShortInfo>
  >([]);
  const [
    displayedPokemon,
    setDisplayedPokemon,
  ] = useState<PokemonDetails | null>(null);
  const [offset, setOffset] = useState<number>(0);
  

  // fetching visible pokemons 
  async function fetchData(url?: string) {
    if (!url) {
      return;
    }
    let response: PokemonPage = await getAllPokemon(url);
    setAllPokemon(response);
    setVisiblePokemon(response.results);
  }
  // fetching filter options
  async function fetchPokemonType(typeURL: string) {
    if (!typeURL) {
      return;
    }
    let responseData: TypePage = await getPokemonType(typeURL);
    setAvailableTypes(responseData);
  }

  // fail fetching function
  function alertFetchFail(reason: any): void {
    alert("Cannot fetch data, reason: " + reason);
  }
  // featching data while rendering
  useEffect(() => {
    fetchPokemonType(TYPE_URL);
    fetchData(getPokemonPaginateLink(0, LIMIT));
  }, []);

  // chcecking if filter is active
  function isFilterActive(): boolean {
    return chosenTypeFilter !== "";
  }

  // fetching pokemons depending on active filter
  function fetchPokemons() {
    if (isFilterActive()) {
      fetchPokemonsByFilter();
    } else {
      fetchAllPokemons();
    }
  }

  // fetching pokemons if filter is not active
  function fetchAllPokemons() {
    setOffset(0);
    getAllPokemon(getPokemonPaginateLink(0, LIMIT))
      .then((allPokemon: PokemonPage) => {
        let allPokemons: Array<PokemonShortInfo> = allPokemon.results;
        setVisiblePokemon(allPokemons);
      })
      .catch((reason) => alertFetchFail(reason));
  }

  // returning new array of filtered pokemons
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

  // function that return link with current offset i limit (for unfiltered Pokemons)
  function getPokemonPaginateLink(offset: number, LIMIT: number): string {
    return "https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=" + LIMIT ;
  }

  function pokemonButtonClicked(pokemonShortInfo: PokemonShortInfo) {
    getFromUrl<PokemonDetails>(INITIAL_URL + "/" + pokemonShortInfo.name).then(
      (displayedPokes: PokemonDetails) => {
        setDisplayedPokemon(displayedPokes);
      }
    );
  }

  // pagination previous depending on active filter
  function previousPage() {
    if (isFilterActive()) {
      filteredPreviousPage();
    } else {
      allPokemonPreviousPage();
    }
  }

  // previous page on filtered pokemons
  function filteredPreviousPage() {
    if (offset === 0) {
      return;
    }
    let newOffset = (offset - LIMIT);
    setOffset(newOffset);
    const sliceVisiblePokemons = filteredPokemons.slice(offset, offset + LIMIT);
    setVisiblePokemon(sliceVisiblePokemons);
  }

  // previous page on unfiltered pokemons
  function allPokemonPreviousPage() {
    if (offset === 0) {
      return;
    }
    let newOffset = (offset - LIMIT);
    setOffset(newOffset);
    getAllPokemon(getPokemonPaginateLink(newOffset, LIMIT))
      .then((allPokemon: PokemonPage) => {
        setVisiblePokemon(allPokemon.results);
      })
      .catch((reason: any) => alertFetchFail(reason));
  }

  // pagination next depending on active filter
  function nextPage() {
    if (isFilterActive()) {
      filteredNextPage();
    } else {
      allPokemonNextPage();
    }
  }

  // next page on filtered pokemons
  function filteredNextPage() {
    if (filteredPokemons.length <= offset + LIMIT) {
      return;
    }
    let newOffset = (offset + LIMIT);
    setOffset(newOffset);
    const sliceVisiblePokemons = filteredPokemons.slice(offset, offset + LIMIT);
    setVisiblePokemon(sliceVisiblePokemons);
  }

  // next page on unfiltered pokemons
  function allPokemonNextPage() {
    if (allPokemon == null || allPokemon.count <= offset + LIMIT) {
      return;
    }
    let newOffset = (offset + LIMIT);
    setOffset(newOffset);
    getAllPokemon(getPokemonPaginateLink(newOffset, LIMIT))
      .then((allPokemon: PokemonPage) => {
        let allPokemons: Array<PokemonShortInfo> = allPokemon.results;
        setVisiblePokemon(allPokemons);
      })
      .catch((reason) => alertFetchFail(reason));
  }

  // asigning action to pokemon button
  const listItems: Array<JSX.Element> = visiblePokemon.map((pokemon) =>
    ListItem(pokemon, pokemonButtonClicked)
  );

  // pokemon detail display
  function pokemonDetailsInfo() { 
    if (displayedPokemon == null) {
      return     
     }
     return PokemonDetailsInfo( displayedPokemon, () => setDisplayedPokemon(null) ) 
 }

  return (
    <div className="App">
      {/* App container */}
      <div className="contaner-components nes-container  ">
        {/* Pokemon Filters */}
        <div className="filters nes-container with-title  is-rounded">
          <p className="title"> FILTER POKEMONS </p>
          <label htmlFor="default_select" className="select-type">
            Filter by type
          </label>
          <div className="nes-select">
            <select
              required
              id="default_select"
              defaultValue=""
              onChange={(e) => {
                setChosenTypeFilter(e.target.value);
              }}
            >
              <option value="">No filter</option>
              {availableTypes?.results.map(FilterOption)}
            </select>
          </div>
          {/* Filter activating button */}
          <div>
            <button
              type="button"
              className="btn-filter nes-btn is-primary "
              onClick={() => fetchPokemons()}
            >
              SEE YOUR POKEMONS!
            </button>
          </div>
        </div>
        {/* App icon */}
        <div className="spacer">
          <i className="nes-octocat animate"></i>
        </div>
        {/* container of pokemon list */}
        <div className="container-list nes-container with-title  is-rounded">
          <p className="title"> SEE MORE INFO </p>
          {/* list item */}
          <div className=" list nes-container is-rounded ">{listItems}</div>
          {/* list pagintaion holder */}
          <div className="pagination-holder">
            <button
              type="button"
              onClick={() => previousPage()}
              className="btn-pagination nes-btn is-primary "
            >
              PREVIOUS
            </button>
            <button
              type="button"
              onClick={() => nextPage()}
              className="btn-pagination nes-btn is-primary "
            >
              NEXT
            </button>
          </div>
        </div>
              {pokemonDetailsInfo()}
      </div>
    </div>
  );
}

export default App;
