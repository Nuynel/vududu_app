import * as React from "react";
import {Link, useSearch} from "wouter"
import useSignIn from "./useSignIn";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {Paths} from "../../g_shared/constants/routes";
import {CustomSpinner} from "../../g_shared/ui_components"

const SignInScreen = () => {
  const {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignIn();

  const {isSmall} = useResponsiveGrid()
  const search = useSearch();

  useEffect(() => {
    if (search === 'activated') toast.info('Профиль активирован!')
    if (search === 'passwordUpdated') toast.info('Пароль обновлен!')
    if (search === 'expired') toast.error('Срок действия ссылки истёк!')
  }, [search])

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-center">Вход</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-4">
          <div>
            <label htmlFor="email-input-id" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email-input-id"
              placeholder="email@gmail.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {!email && <p className="mt-1 text-sm text-red-600">Введите адрес электронной почты</p>}
          </div>
          <div>
            <label htmlFor="password-input-id" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password-input-id"
              type="password"
              placeholder="********"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            Вход
            {isLoading && <CustomSpinner />}
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <Link to={Paths.sign_up}>
            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded-md">
              Регистрация
            </button>
          </Link>
        </div>
        <div className="flex justify-center mt-2">
          <Link to={Paths.passwordRecovery}>
            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded-md">
              Забыли пароль?
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignInScreen
