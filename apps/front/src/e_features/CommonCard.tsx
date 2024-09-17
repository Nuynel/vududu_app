import {FieldData} from "../g_shared/types";
import {PencilIcon} from "../g_shared/icons";
import {CommonField, LinkedField} from "../g_shared/ui_components"
import {useLocation} from "wouter";
import {getRuTranslate} from "../g_shared/constants/translates";

const CommonCard = ({blockName, blockFields, openBaseInfoEditor}: {blockName: string, blockFields: FieldData[], openBaseInfoEditor: () => void}) => {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white p-4 m-2 rounded-md shadow-md overflow-visible" style={{ minHeight: 'unset' }}>
      {/* Заголовок карточки */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold m-2">
          {getRuTranslate(blockName)}
        </h3>
        <button
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center focus:outline-none"
          onClick={openBaseInfoEditor}
        >
          <PencilIcon color='black'/>
        </button>
      </div>

      {/* Тело карточки */}
      <div className="flex flex-col gap-4" style={{ minHeight: 'unset' }}>
        {blockFields.map((field, index) => {
          return field.link ? (
            <LinkedField key={index} fieldName={field.key} fieldValue={field.value} redirectFunc={() => setLocation(field.linkValue)} />
          ) : (
            <CommonField key={index} fieldName={field.key} fieldValue={field.value} />
          );
        })}
      </div>
    </div>
  )
}

export default CommonCard
