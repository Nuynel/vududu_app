import * as React from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { CustomSpinner } from "../../g_shared/ui_components";
import { Paths } from "../../g_shared/constants/routes";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import LanguageSelect from "../../e_features/LanguageSelect";
import { useTranslation } from "../../f_entities/contexts/i18n";
import { FORM_FIELDS, FormValues } from "../../g_shared/types/form";
import useSignUp from "./useSignUp";

const formFieldOptions = {
  [FORM_FIELDS.EMAIL]: {
    required: "Введите адрес электронной почты",
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Невалидный e-mail",
    },
  },
  [FORM_FIELDS.PASSWORD]: {
    required: "Введите пароль",
    minLength: {
      value: 6,
      message: "Пароль должен содержать не менее 6 символов",
    },
  },
  [FORM_FIELDS.CONFIRM_PASSWORD]: {
    required: "Подтвердите пароль",
    validate: (value: string, { password }: FormValues) => value === password || "Пароли не совпадают",
  },
};

const SignUpScreen = () => {
  const { isLoading, onSubmit } = useSignUp();
  const { isSmall } = useResponsiveGrid();
  const { translate } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>();

  const passwordValue = watch(FORM_FIELDS.PASSWORD);

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <LanguageSelect small />

      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">{translate('signUp')}</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center space-y-4">
          <div>
            <label htmlFor="email-input-id" className="block text-sm font-medium text-gray-700">
              {translate('email')}
            </label>
            <input
              id="email-input-id"
              placeholder="email@email.com"
              {...register(FORM_FIELDS.EMAIL, formFieldOptions[FORM_FIELDS.EMAIL])}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.email && isDirty && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password-input-id" className="block text-sm font-medium text-gray-700">
              {translate('password')}
            </label>
            <input
              id="password-input-id"
              type="password"
              placeholder="********"
              {...register(FORM_FIELDS.PASSWORD, formFieldOptions[FORM_FIELDS.PASSWORD])}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.password && isDirty && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{translate('minLengthInfo')}</p>
          </div>
          <div>
            <label htmlFor="repeat-password-input-id" className="block text-sm font-medium text-gray-700">
              {translate('confirmPassword')}
            </label>
            <input
              id="repeat-password-input-id"
              type="password"
              placeholder="********"
              {...register(FORM_FIELDS.CONFIRM_PASSWORD, { ...formFieldOptions[FORM_FIELDS.CONFIRM_PASSWORD], validate: value => value === passwordValue || translate('passwordsDoNotMatch') })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.confirmPassword && isDirty && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            {translate('register')}
            {isLoading && <CustomSpinner />}
          </button>
        </form>
        <div className="flex justify-center mt-4 text-blue-600 hover:text-blue-800">
          <Link to={Paths.sign_in}>{translate('signIn')}</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
