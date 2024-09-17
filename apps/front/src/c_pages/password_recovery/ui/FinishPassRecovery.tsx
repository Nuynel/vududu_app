import * as React from "react";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {CustomSpinner} from "../../../g_shared/ui_components";

type Props = {
  password: string,
  controlPassword: string,
  isRecoveryInitialized: null | boolean,
  isLoading:  null | boolean,
  setPassword: (newPass: string) => void,
  setControlPassword: (newPass: string) => void,
  updatePassword: () => void,
}

const FinishPassRecovery = (
  {
    password,
    controlPassword,
    isLoading,
    setPassword,
    setControlPassword,
    updatePassword
  }: Props
) => {
  const {isSmall} = useResponsiveGrid();

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Восстановление пароля</h2>
        </div>
        <form onSubmit={updatePassword} className="flex flex-col justify-center">
          <div className="mb-4">
            <label htmlFor="password-input-id" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password-input-id"
              placeholder="********"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {password.length < 6 && <p className="mt-1 text-sm text-red-600">Слишком короткий пароль</p>}
            <p className="mt-1 text-sm text-gray-500">Минимум 6 символов</p>
          </div>
          <div className="mb-4">
            <label htmlFor="repeat-password-input-id" className="block text-sm font-medium text-gray-700">
              Подтверждение пароля
            </label>
            <input
              id="repeat-password-input-id"
              placeholder="********"
              type="password"
              value={controlPassword}
              onChange={event => setControlPassword(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {password !== controlPassword && <p className="mt-1 text-sm text-red-600">Пароли не совпадают</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            Сохранить новый пароль
            {isLoading && <CustomSpinner />}
          </button>
        </form>
      </div>
    </div>
  )

}

export default FinishPassRecovery
