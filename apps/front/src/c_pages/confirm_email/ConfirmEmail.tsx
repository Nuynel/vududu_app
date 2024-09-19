import * as React from "react";
import {Link} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {Paths} from "../../g_shared/constants/routes";
import {useTranslation} from "../../f_entities/contexts/i18n";
import LanguageSelect from "../../e_features/LanguageSelect";

const ConfirmEmailScreen = () => {
  const {isSmall} = useResponsiveGrid()
  const { translate } = useTranslation();

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <LanguageSelect small />

      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-4">
          <p className="text-base text-gray-700">
            {translate('passwordRecoveryLinkSent')}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-base text-gray-700">
            {translate('checkSpamFolder')}
          </p>
        </div>
        <div className="flex justify-center">
          <Link to={Paths.sign_in}>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex justify-center items-center"
            >
              {translate('backToHome')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConfirmEmailScreen
