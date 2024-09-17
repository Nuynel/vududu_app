import * as React from "react";
import {Link} from "wouter";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {CustomSpinner} from "../../../g_shared/ui_components";


type Props = {
  email: string,
  isLoading:  null | boolean,
  setEmail: (newEmail: string) => void,
  handleSubmit: () => void,
}
const StartPassRecovery = ({email, isLoading, setEmail, handleSubmit}: Props) => {
  const {isSmall} = useResponsiveGrid();

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Восстановление пароля</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          <div className="mb-4">
            <label htmlFor="email-input-id" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email-input-id"
              placeholder="email@gmail.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {!email && <p className="mt-1 text-sm text-red-600">Введите адрес электронной почты</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            Восстановить пароль
            {isLoading && <CustomSpinner />}
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <Link to="/sign-in">
            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded-md">
              Вход
            </button>
          </Link>
        </div>
      </div>
    </div>

  )

}

export default StartPassRecovery
