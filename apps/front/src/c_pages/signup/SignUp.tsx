import * as React from "react";
import {Link} from "wouter";
import useSignUp from "./useSignUp";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {CustomSpinner} from "../../g_shared/ui_components"

const SignUpScreen = () => {
  const {
    email,
    password,
    controlPassword,
    isLoading,
    setEmail,
    setPassword,
    setControlPassword,
    handleSubmit,
  } = useSignUp();

  const {isSmall} = useResponsiveGrid()

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-center">Регистрация</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-4">
          <div>
            <label htmlFor="email-input-id" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email-input-id"
              placeholder="email@email.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {(!email.includes('@') || email.includes(' ') || !email.includes('.')) && (
              <p className="mt-1 text-sm text-red-600">Невалидный e-mail</p>
            )}
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
            {password.length < 6 && (
              <p className="mt-1 text-sm text-red-600">Слишком короткий пароль</p>
            )}
            <p className="mt-1 text-sm text-gray-500">Минимум 6 символов</p>
          </div>
          <div>
            <label htmlFor="repeat-password-input-id" className="block text-sm font-medium text-gray-700">
              Подтверждение пароля
            </label>
            <input
              id="repeat-password-input-id"
              type="password"
              placeholder="********"
              value={controlPassword}
              onChange={event => setControlPassword(event.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {password !== controlPassword && (
              <p className="mt-1 text-sm text-red-600">Пароли не совпадают</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            Зарегистрироваться
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
  );
}

export default SignUpScreen


