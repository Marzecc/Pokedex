import {
  PokemonPage,
  PokemonShortInfo,
  TypePage,
  FilteredPokemons,
  PokemonDetails,
} from "../Model";
import axios, { AxiosResponse } from "axios";

// nie wiem jak możnby to dodać do reduxa (chyba, że jako oddzielna funkcja)

// axios.get("https://jsonplaceholder.typicode.com/todos/1")
//   .then(response => console.log("response", response.data))

const url: string = "";
// dając przy gecie interface mówimy, żeby napisał domyślny typ pobieranych info
export function getAllPokemon(url: string): Promise<PokemonPage> {
  return getFromUrl<PokemonPage>(url);
}

function getFromUrl<T>(url: string): Promise<T> {
  return axios.get<T>(url).then((response: AxiosResponse<T>) => {
    return response.data;
  });
}

export function FetchAPIData<T>(x: T): Promise<T> {
  return getFromUrl<T>("");
}

// Pobieranie info z poziomu niżej -> url w konkretnym pokemonie
export function getPokemonInfo(
  data: PokemonShortInfo
): Promise<PokemonShortInfo> {
  return getFromUrl<PokemonShortInfo>(url);
}

export function getPokemonType(url: string): Promise<TypePage> {
  return getFromUrl<TypePage>(url);
}

export function getFilteredPokemons(url: string): Promise<FilteredPokemons> {
  return getFromUrl<FilteredPokemons>(url);
}

export function getAllToPaginate(url: string): Promise<PokemonShortInfo> {
  return getFromUrl<PokemonShortInfo>(url);
}

export function getDisplayedPokemon(url: string): Promise<PokemonDetails> {
  return getFromUrl<PokemonDetails>(url);
}
export function getPokemonImage(url: string): Promise<JSX.Element> {
  return getFromUrl<JSX.Element>(url);
}

// Tą funkcję możemy dodawać na wszystkich poziomach pobierania info

// Promise = wartość, którą Ci dostarczę

// TODO: do przeczytania: Type Parameter, generics
// Zapisujemy typ, który potem możemy dowolnie nadpisywać (jak parametr
// function print<T>(x: T): T {
//     console.log(x);
//     return x;
// }
// print<string>("asd");

// funkcja ktora przyjmuje url i typ jaki ma zwracać
// Prozą -> Parametr ma typ <T> i zwraca <T> - możemy go nadpisać jak chcemy

// export async function getAllPokemon(url:string) {
//     return new Promise((resolve, rejects) => {
//         fetch(url)
//         .then(res => res.json())
//         .then(data => {
//             resolve(data)
//         })
//     })
// }
