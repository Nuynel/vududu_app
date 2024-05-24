import {DogData} from "./dog";

export type Pedigree = (DogData & {
  father: Pedigree | null,
  mother: Pedigree | null,
  position: string,
}) | null
