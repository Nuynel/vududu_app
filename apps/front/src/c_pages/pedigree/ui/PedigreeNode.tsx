import * as React from "react";

type Props = {
  nodeId: string,
  fullName: string,
  position: string,
  setActiveDogId: (id: string) => void,
}

const imageSizes = {
  1: 'xsmall',
  2: 'xxsmall',
}

const roundSize = {
  1: 'small',
  2: 'small',
  3: 'xsmall',
  4: 'xxsmall',
}

const colors = {
  lightBlue: '#3B4EC1',
  darkBlue: '#4437BB',
  violet: '#5D27B8',
  purple: '#7A28C2',
  pink: '#9525C1',
}

const PedigreeNode = ({nodeId, fullName, position, setActiveDogId}: Props) => {
  return (
    <div
      id={nodeId}
      className={`bg-white border border-gray-400 rounded-${roundSize[position.length]} 
    ${position.length <= 3 ? 'm-4' : 'm-1'} cursor-pointer`}
      style={{ minWidth: '250px' }}
      onClick={() => setActiveDogId(nodeId)}
    >
      <div className="grid grid-cols-[auto_1fr] gap-2 items-center p-2 h-full">
        {position.length < 3 && (
          <div
            className="bg-gray-400"
            style={{ width: imageSizes[position.length], height: imageSizes[position.length] }}
          />
        )}
        <div>
          <p className="text-xs">
            {fullName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PedigreeNode
