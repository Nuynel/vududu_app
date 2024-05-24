import {Box, Grid, Text, FormField, Select} from "grommet";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {useEffect, useState} from "react";
import {DogData, FieldData, Pedigree} from "../../g_shared/types";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {getPedigreeByDogId} from "../../g_shared/methods/api";
import {dogShortDataFields, PEDIGREE_GRIDS} from "./configurations";
import {getCommonFieldsConfig} from "../../g_shared/methods/helpers/getCommonFieldsConfig";
import {CommonField, LinkedField} from "../../g_shared/ui_components";
import {useLocation} from "wouter";
import {getRuTranslate} from "../../g_shared/constants/translates";
import * as React from "react";
import ProbandSelect from "./ui/ProbandSelect";
import PedigreeNode from "./ui/PedigreeNode";

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
  const [probandId, changeProbandId] = useState<string | null>(null)
  const [nodes, changeNodes] = useState<PedigreeNodes>([])
  const {getDogById} = useProfileDataStore();
  const [, setLocation] = useLocation();

  const getCardsConfig = (): FieldData[] => {
    const dog = getDogById(probandId);
    return dogShortDataFields.map(fieldName => getCommonFieldsConfig(fieldName, dog))
  }

  useEffect(() => {
    if (probandId) {
      getPedigreeByDogId({id: probandId, type: 'COMMON'}).then((res) => {
        changeNodes(traverseTreeDFS(res.pedigree))
      })
    }
  }, [probandId])

  return (
    <Grid
      rows={['216px', 'auto']}
      columns={['1fr', '1fr', '2fr']}
      areas={[
        { name: 'mainFilter', start: [0, 0], end: [0, 0] },
        { name: 'secondaryFilter', start: [1, 0], end: [2, 0] },
        { name: 'content', start: [0, 1], end: [2, 1] },
      ]}
      height={'100%'}
    >
      <ProbandSelect probandId={probandId} changeProbandId={changeProbandId}/>

      <Box
        gridArea={'secondaryFilter'}
        direction={"row"}
        pad={"small"}
      >
        <Box height={"small"} width={"small"} background={'#777777'} margin={{right: 'small'}}/>
        <Box justify={"around"}>
          {probandId && getCardsConfig().map((field, index) => {
              return (
                <Grid
                  columns={['1fr', '1fr']}
                  key={index}
                  rows={['auto']}
                  areas={[
                    { name: 'title', start: [0, 0], end: [0, 0] },
                    { name: 'value', start: [1, 0], end: [1, 0] },
                  ]}
                >
                  <Box gridArea={'title'} align={"end"} pad={{right: 'small'}}>
                    <Text size='small' margin={{right:'xxsmall'}}>{getRuTranslate(field.key)}:</Text>
                  </Box>
                  <Box  gridArea={'value'}>
                    <Text truncate='tip' size='small' weight='bold'>{field.value}</Text>
                  </Box>
                </Grid>
              )
            }
          )}
        </Box>
      </Box>
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
              <PedigreeNode nodeId={id} fullName={fullName} position={position} key={index}/>
            ))}
          </Grid>
        )}
      </Box>
    </Grid>
  );
}

export default PedigreeScreen
