import * as React from "react";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {IncomingDogData} from "../../../g_shared/types";
import {useEffect, useState} from "react";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";

type Props = {
  probandId: string,
  changeProbandId: (id: string) => void,
}

const ProbandSelect = ({probandId, changeProbandId}: Props) => {
  const {isSmall} = useResponsiveGrid(true);
  const [dogsList, changeDogsList] = useState<IncomingDogData[]>([])
  const {dogsData} = useProfileDataStore();

  const getDogs = (searchString: string) => {
    return dogsData.filter(dogData => dogData.fullName.toLowerCase().includes(searchString.toLowerCase()) || dogData.name.toLowerCase().includes(searchString.toLowerCase()))
  }
  const handleSearch = (searchString: string) => changeDogsList(getDogs(searchString))

  useEffect(() => {
    changeDogsList(dogsData)
  }, [dogsData])

  return (
    <div className="flex justify-around items-center p-2 flex-row">
      <div>
        <p className="text-sm mr-8 mt-2 mb-1">
          Пробанд
        </p>
      </div>
      <div className="mt-2">
        <select
          id="filter-input-id"
          name="Фильтр"
          value={probandId}
          onChange={(e) => changeProbandId(e.target.value)}
          className="block w-full p-2 border border-gray-400 rounded-md text-sm"
        >
          <option value="" disabled>Фильтр</option>
          {dogsList.map((dogData) => (
            <option key={dogData._id} value={dogData._id}>
              {dogData.fullName}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ProbandSelect
