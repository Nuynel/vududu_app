import {IncomingDogData} from "./dog";

export type Pedigree = (IncomingDogData & {
  father: Pedigree | null,
  mother: Pedigree | null,
  position: string,
}) | null
