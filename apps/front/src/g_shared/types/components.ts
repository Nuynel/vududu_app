export enum BLOCK_TYPES {
  COMMON = 'COMMON',
  ARRAY = 'ARRAY'
}

export type FieldData = {
  date?: string,
  key: string,
  value: string | boolean | string[] | null,
  link: boolean,
  linkValue?: string,
}

export type BlocksConfig = {
  title: string,
  commonData: {
    blockName: string,
    blockType: BLOCK_TYPES,
    blockFields: FieldData[]
  },
  additionalData: {
    blockName: string,
    blockType: BLOCK_TYPES,
    blockFields: FieldData[]
  }[]
}
