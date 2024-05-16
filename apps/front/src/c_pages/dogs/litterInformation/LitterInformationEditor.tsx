import {useEffect, useState} from "react";
import {useParams} from "wouter";
import {LitterData} from "../../../g_shared/types";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import {updateBaseLitterInfo} from "../../../g_shared/methods/api";

const LitterInformationEditor = () => {
  const [litter, changeLitter] = useState<LitterData | null>(null);

  const params: {id: string} = useParams();

  const {getLitterById, setLittersData, littersData} = useProfileDataStore();

  const handleInputChange = (key, value) => {
    changeLitter((prevState): LitterData => (
      {...prevState, [key]: value}
    ))
  }

  useEffect(() => {
    const litterData = getLitterById(params.id);
    if (litterData) {
      const litterCopy = JSON.parse(JSON.stringify(litterData));
      changeLitter(litterCopy);
    } else {
      changeLitter(null);
    }
  }, [params])

  const handleSubmit = () => {
    const newBaseLitterInfo: {comments: string} = {
      comments: litter.comments
    }
    updateBaseLitterInfo(newBaseLitterInfo, litter._id).then(
      () => {
        setLittersData(littersData.map((litterData => litterData._id === litter._id ? litter : litterData)))
        window.history.back()
      })
  }

  if (!litter) return null;

  return (
    <BaseInfoEditor
      title={litter.litterTitle}
      entityType={'litter'}
      entity={litter}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  )
}

export default LitterInformationEditor
