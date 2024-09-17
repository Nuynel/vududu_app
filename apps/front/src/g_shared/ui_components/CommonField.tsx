import * as React from "react";
import {getRuTranslate} from "../constants/translates";

const CommonField = ({fieldName, fieldValue}: {fieldName: string, fieldValue: string | boolean | string[] | null}) => (
  <div className="h-min" style={{ minHeight: 'unset' }}>
    <p className="text-sm font-bold mr-1">
      {getRuTranslate(fieldName)}:
    </p>
    <p className="text-sm truncate">
      {fieldValue}
    </p>
  </div>
)

export default CommonField;
