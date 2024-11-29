import {useEffect, useState} from "react";
import {Pedigree} from "../../g_shared/types";
import {getPedigreeByDogId} from "../../g_shared/methods/api";
import {PEDIGREE_GRIDS} from "./configurations";
import * as React from "react";
import ProbandSelect from "./ui/ProbandSelect";
import PedigreeNode from "./ui/PedigreeNode";
import DogCard from "./ui/DogCard";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";
import PageComponent from "../../d_widgets/PageComponent";

// на десктопе должна быть колонка слева, где отображается информация по собакам,
// предтсавленным в родословной (по дефолту пробанд)

// при клике на карточку в родословной в поле видимости слева выводится
// информация о собаке и появляется кнопка "Перейти в карточку собаки"

// на мобильном основная информация и кнопка выводятся снизу

type PedigreeNodes = {id: string, fullName: string, position: string}[]

function traverseTreeDFS(node: Pedigree, results: PedigreeNodes = []): PedigreeNodes {
  if (!node) return results;

  if (node.position) results.push({ id: node._id, fullName: node.fullName, position: node.position });

  if (node.father) traverseTreeDFS(node.father, results);

  if (node.mother) traverseTreeDFS(node.mother, results);

  return results;
}

const PedigreeScreen = () => {
  const [nodes, changeNodes] = useState<PedigreeNodes>([])

  const {probandId, setProbandId, activePedigreeDogId , setActivePedigreeDogId} = useUIStateStore();

  useEffect(() => {
    if (probandId) {
      getPedigreeByDogId({id: probandId, type: 'COMMON'}).then((res) => {
        changeNodes(traverseTreeDFS(res.pedigree))
      })
      setActivePedigreeDogId(probandId)
    }
  }, [probandId])

  return (
    <PageComponent>
      <div className="grid bg-gray-200 grid-rows-[80px_80px_auto] lg:grid-rows-[80px_264px_auto] grid-cols-1 h-full">
        <ProbandSelect probandId={probandId} changeProbandId={setProbandId}/>
        <DogCard dogId={activePedigreeDogId}/>
        <div className="grid-area-content p-2 gap-2 bg-gray-200 flex flex-row overflow-scroll">
        {!!nodes.length && (
            <div className="grid grid-rows-16 grid-cols-4 gap-2">
              {nodes.map(({ id, fullName, position }, index) => (
                <div
                  key={index}
                  className={`col-span-${PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].end[1] -
                  PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].start[1] + 1} 
          row-span-${PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].end[0] -
                  PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].start[0] + 1} bg-white border p-2`}
                  style={{
                    gridRow: `${PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].start[0] + 1} / ${PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].end[0] + 2}`,
                    gridColumn: `${PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].start[1] + 1} / ${PEDIGREE_GRIDS.COMMON_PEDIGREE.areas[index].end[1] + 2}`,
                  }}
                >
                  <PedigreeNode
                    nodeId={id}
                    fullName={fullName}
                    position={position}
                    setActiveDogId={setActivePedigreeDogId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageComponent>
  );
}

export default PedigreeScreen
