import {OpenIcon} from '../g_shared/icons';
import {FieldData} from "../g_shared/types";
import {getRuTranslate} from '../g_shared/constants/translates'
import * as React from "react";
import {useLocation} from "wouter";
import {Accordion} from '../g_shared/ui_components'

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
    <Accordion title={getRuTranslate(cardName)}>
      {fields.map((field, i) => (
        <div className="grid grid-cols-[80px_auto_60px] gap-4 p-2 m-2">
          {field.date && (
            <div className="flex items-center justify-center">
              <p className="text-sm">
                {field.date}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center">
            <p className="truncate text-sm">
              {field.value || '-'}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center focus:outline-none"
              onClick={() => setLocation(field.linkValue)}
            >
              <OpenIcon color='black'/>
            </button>
          </div>
        </div>
      ))}
      {!fields.length && (
        <div className="m-2">
          <p className="text-sm">
            {getRuTranslate('empty')}
          </p>
        </div>
      )}
    </Accordion>
  )
}

export default AccordionCard
