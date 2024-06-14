import * as TRANSLATES from './translates.json'

export const getRuTranslate = (fieldName: string) => fieldName in TRANSLATES ? TRANSLATES[fieldName].ru : fieldName
