import * as translates from './translates.json'

const TRANSLATES = translates

export const getRuTranslate = (fieldName: string) => fieldName in TRANSLATES ? TRANSLATES[fieldName].ru : fieldName
