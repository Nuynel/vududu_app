import React, {useState} from "react";
import {Link, useLocation} from "wouter";
import {toast} from "react-toastify";
import { useForm } from "react-hook-form";
import LanguageSelect from "../../e_features/LanguageSelect";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import { useTranslation } from "../../f_entities/contexts/i18n";
import { CustomSpinner } from "../../g_shared/ui_components";
import { Paths } from "../../g_shared/constants/routes";
import { FORM_FIELDS, FormValues } from "../../g_shared/types/form";
import {signUp} from "../../g_shared/methods/api";

const SignUpScreen = () => {
  const [, setLocation] = useLocation();
  const { isSmall } = useResponsiveGrid();
  const [isLoading, setIsLoading] = useState<null | Boolean>(null)
  const {translate} = useTranslation();

  const onSubmit = ({email, password}: {email: string, password: string}) => {
    setIsLoading(true)
    signUp({
      email: email.toLowerCase(),
      password,
    }).then(() => {
      setIsLoading(false)
      setLocation(Paths.confirmEmail);
    }).catch((e) => {
      setIsLoading(false)
      toast.error(translate(e.message))
    })
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>();

  const passwordValue = watch(FORM_FIELDS.PASSWORD);

  const formFieldOptions = {
    [FORM_FIELDS.EMAIL]: {
      required: translate('requiredEmail'),
      pattern: {
        value: /^\S+@\S+$/i,
        message: translate('invalidEmail'),
      },
    },
    [FORM_FIELDS.PASSWORD]: {
      required: translate('requiredPassword'),
      minLength: {
        value: 6,
        message: translate('passwordMinLength'),
      },
    },
    [FORM_FIELDS.CONFIRM_PASSWORD]: {
      required: translate('confirmPassword'),
      validate: value => value === passwordValue || translate('passwordsDoNotMatch')
    },
  };

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
              {...register(FORM_FIELDS.CONFIRM_PASSWORD, formFieldOptions[FORM_FIELDS.CONFIRM_PASSWORD])}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.confirmPassword && isDirty && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex justify-center items-center"
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
