import * as React from "react";
import {Link} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {Paths} from "../../g_shared/constants/routes";

const ConfirmEmailScreen = () => {
  const {isSmall} = useResponsiveGrid()
  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-4">
          <p className="text-base text-gray-700">
            На вашу почту выслана ссылка-подтверждение. Пожалуйста, перейдите по ней для подтверждения аккаунта.
          </p>
        </div>
        <div className="mb-4">
          <p className="text-base text-gray-700">
            Возможно, потребуется проверить папку "Спам"
          </p>
        </div>
        <div className="flex justify-center">
          <Link to={Paths.sign_in}>
            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded-md">
              На главную
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConfirmEmailScreen
