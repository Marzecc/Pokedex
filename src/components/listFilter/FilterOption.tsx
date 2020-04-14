import React from "react";
import { TypeShortInfo } from "../../Model";

export function FilterOption(pokeType: TypeShortInfo): JSX.Element {
  return <option 
  key={pokeType.name}
  value={pokeType.name}>{pokeType.name}</option>;
}
export default FilterOption;
