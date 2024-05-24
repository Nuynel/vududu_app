import {Box, Grid} from "grommet";
import {useEffect, useState} from "react";
import {Pedigree} from "../../g_shared/types";
import {getPedigreeByDogId} from "../../g_shared/methods/api";
import {PEDIGREE_GRIDS} from "./configurations";
import {useLocation} from "wouter";
import * as React from "react";
import ProbandSelect from "./ui/ProbandSelect";
import PedigreeNode from "./ui/PedigreeNode";
import DogCard from "./ui/DogCard";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";

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
  const [, setLocation] = useLocation();

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
    <Grid
      rows={['80px', '216px', 'auto']}
      columns={['auto']}
      areas={[
        { name: 'mainFilter', start: [0, 0], end: [0, 0] },
        { name: 'secondaryFilter', start: [0, 1], end: [0, 1] },
        { name: 'content', start: [0, 2], end: [0, 2] },
      ]}
      // height={'100%'}
      fill={"vertical"}
    >
      <ProbandSelect probandId={probandId} changeProbandId={setProbandId}/>
      <DogCard probandId={activePedigreeDogId}/>
      <Box
        gridArea={'content'}
        pad={"small"}
        gap={"small"}
        background={'lightBackground'}
        direction={"row"}
        overflow={"scroll"}
      >
        {!!nodes.length && (
          <Grid
            rows={PEDIGREE_GRIDS.COMMON_PEDIGREE.rows}
            columns={PEDIGREE_GRIDS.COMMON_PEDIGREE.columns}
            areas={PEDIGREE_GRIDS.COMMON_PEDIGREE.areas}
          >
            {nodes.map(({id, fullName, position}, index) => (
              <PedigreeNode
                nodeId={id}
                fullName={fullName}
                position={position}
                setActiveDogId={setActivePedigreeDogId}
                key={index}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Grid>
  );
}

export default PedigreeScreen
