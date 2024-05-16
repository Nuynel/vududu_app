import {Accordion, AccordionPanel, Box, Button, Card, Grid, Text} from "grommet";
import {OpenIcon} from '../g_shared/icons';
import {FieldData} from "../g_shared/types";
import {getRuTranslate} from '../g_shared/constants/translates'
import * as React from "react";
import {useLocation} from "wouter";

const areasByDataType = {
  dateValue: [
    { name: 'date', start: [0,0], end: [0,0] },
    { name: 'text', start: [1,0], end: [1,0] },
    { name: 'button', start: [2,0], end: [2,0] },
  ],
  value: [
    { name: 'text', start: [0,0], end: [1,0] },
    { name: 'button', start: [2,0], end: [2,0] },
  ]
}

const AccordionCard = ({cardName, fields}: { cardName: string, fields: FieldData[]}) => {
  const [, setLocation] = useLocation();

  return (
    <Card margin='small' pad='medium' gap='medium' overflow='visible' style={{minHeight: 'unset'}} background='white'>
      <Accordion>
        <AccordionPanel label={getRuTranslate(cardName)}>
          {fields.map((field, i) => (
            <Grid
              rows={['auto']}
              columns={['80px', 'auto', '60px']}
              areas={areasByDataType[field.date ? 'dateValue' : 'value']}
              key={i}
              margin={"small"}
            >
              {field.date && (
                <Box gridArea={'date'} justify={'center'}>
                  <Text size={"small"}>
                    {field.date}
                  </Text>
                </Box>
              )}
              <Box gridArea={'text'} justify={'center'}>
                <Text truncate size={"small"}>
                  {field.value || '-'}
                </Text>
              </Box>
              <Box gridArea='button' justify={"center"} align={'center'}>
                <Button
                  focusIndicator={false}
                  icon={<OpenIcon color='black'/>}
                  fill={false}
                  style={{width: '48px', borderRadius: '24px'}}
                  secondary
                  onClick={() => setLocation(field.linkValue)}
                />
              </Box>
            </Grid>
          ))}
          {!fields.length && (
            <Box margin='small'>
              <Text size={"small"}>
                Пусто
              </Text>
            </Box>
          )}
        </AccordionPanel>
      </Accordion>
    </Card>
  )
}

export default AccordionCard
