import {useState} from "react";
import {Breed} from "../../g_shared/types";
import {getBreeds} from "../../g_shared/methods/api";
import {CROSSBREED} from "../../g_shared/types/breed";

export const useBreeds = () => {
  const [breeds, changeBreeds] = useState<Breed[]>([]);

  const getAllBreeds = () => {
    getBreeds().then(({breeds: newBreeds}) => changeBreeds([...newBreeds, CROSSBREED]))
  }

  const searchBreeds = (searchString: string) => {
    getBreeds(searchString).then(({breeds: newBreeds}) => changeBreeds([...newBreeds, CROSSBREED]))
  }

  return {
    breeds,
    getAllBreeds,
    searchBreeds,
  }
}
