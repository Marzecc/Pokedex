export interface PokemonShortInfo {
  name: string;
  url: string;
}

export interface PokemonPage {
  count: number;
  next: string;
  previous: string;
  results: PokemonShortInfo[];
}

export interface TypePage {
  count: number;
  next: string;
  previous: string;
  results: TypeShortInfo[];
}

export interface TypeShortInfo {
  name: string;
  ul: string;
}

export interface TypeShortInfo {
  name: string;
  ul: string;
}

export interface PokemonShortInfoWrapper {
  pokemon: PokemonShortInfo;
}
export interface FilteredPokemons {
  pokemon: Array<PokemonShortInfoWrapper>;
}

export interface PokemonStats {
  base_stat: number;
  stat: PokemonShortInfo;
}

export interface DetailsShortInfo {
  name: string;
  ul: string;
}

export interface TypesPokemonDetails {
  type: DetailsShortInfo;
}

export interface PokemonImage {
  front_default: string | null;
}

export interface PokemonDetails {
  stats: PokemonStats[];
  types: TypesPokemonDetails[];
  sprites: PokemonImage;
  base_experience: number;
  name: string;
}

export type StatName = "hp" | "attack";