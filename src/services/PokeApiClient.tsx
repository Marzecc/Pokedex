import {
  PokemonPage,
  TypePage,
  FilteredPokemons,
  PokemonDetails,
} from "../Model";
import axios, { AxiosResponse } from "axios";

function getFromUrl<T>(url: string): Promise<T> {
  return axios.get<T>(url).then((response: AxiosResponse<T>) => {
    return response.data;
  });
}

export function getAllPokemon(url: string): Promise<PokemonPage> {
  return getFromUrl<PokemonPage>(url);
}

export function getPokemonType(url: string): Promise<TypePage> {
  return getFromUrl<TypePage>(url);
}

export function getFilteredPokemons(url: string): Promise<FilteredPokemons> {
  return getFromUrl<FilteredPokemons>(url);
}

export function getDisplayedPokemon(url: string): Promise<PokemonDetails> {
  return getFromUrl<PokemonDetails>(url);
}