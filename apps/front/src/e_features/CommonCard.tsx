import {Button, Card, CardBody, CardHeader, Heading} from "grommet";
import {FieldData} from "../g_shared/types";
import {PencilIcon} from "../g_shared/icons";
import {CommonField, LinkedField} from "../g_shared/ui_components"
import {useLocation} from "wouter";
import {getRuTranslate} from "../g_shared/constants/translates";

const CommonCard = ({blockName, blockFields, openBaseInfoEditor}: {blockName: string, blockFields: FieldData[], openBaseInfoEditor: () => void}) => {
  const [, setLocation] = useLocation();

  return (
    <Card margin='small' pad='medium' gap='medium' overflow='visible' style={{minHeight: 'unset'}} background='white'>
      <CardHeader>
        <Heading level={3} margin='small'>{getRuTranslate(blockName)}</Heading>
        <Button
          focusIndicator={false}
          icon={<PencilIcon color='black' />}
          fill={false}
          style={{width: '48px', borderRadius: '24px'}}
          secondary
          onClick={openBaseInfoEditor}
        />
      </CardHeader>
      <CardBody style={{minHeight: 'unset'}}>
        {blockFields.map((field, index) => {
          return field.link ? (
            <LinkedField key={index} fieldName={field.key} fieldValue={field.value} redirectFunc={() => setLocation(field.linkValue)}/>
          ) : (
            <CommonField key={index} fieldName={field.key} fieldValue={field.value}/>
          )
          }
        )}
      </CardBody>
    </Card>
  )
}

export default CommonCard
