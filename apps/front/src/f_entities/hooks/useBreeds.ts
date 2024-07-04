import {useEffect, useState} from "react";
import {Breed} from "../../g_shared/types";
import {getBreeds} from "../../g_shared/methods/api";
import {CROSSBREED} from "../../g_shared/types/breed";
import useDebounce from "./useDebounce";

export const useBreeds = () => {
  const [breeds, changeBreeds] = useState<Breed[]>([]);
  const [breedSearchString, setBreedSearchString] = useState<string>('');
  const debouncedBreedSearchString = useDebounce(breedSearchString, 100)

  const getAllBreeds = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    getBreeds('', signal)
      .then(({breeds: newBreeds}) => changeBreeds([...newBreeds, CROSSBREED]))
      .catch((e) => console.error(e))
  }

  const searchBreeds = (searchString: string, signal: AbortSignal) => {
    getBreeds(searchString, signal)
      .then(({breeds: newBreeds}) => changeBreeds([...newBreeds, CROSSBREED]))
      .catch((e) => {
        if (e.name !== 'AbortError') console.error(e)
      })
  }

  useEffect(() => {
    if (debouncedBreedSearchString) {
      const controller = new AbortController();
      const signal = controller.signal;
      searchBreeds(debouncedBreedSearchString, signal)
      return () => {
        controller.abort('Outdated request');
      };
    }
  }, [debouncedBreedSearchString])

  return {
    breeds,
    getAllBreeds,
    searchBreeds,
    setBreedSearchString,
  }
}
