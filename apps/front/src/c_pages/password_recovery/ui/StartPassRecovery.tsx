import * as React from "react";
import {Link} from "wouter";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import { useForm } from "react-hook-form";
import {CustomSpinner} from "../../../g_shared/ui_components";
import {Paths} from "../../../g_shared/constants/routes";
import LanguageSelect from "../../../e_features/LanguageSelect";
import {useTranslation} from "../../../f_entities/contexts/i18n";
import {FORM_FIELDS, FormValues} from "../../../g_shared/types/form";

type Props = {
  isLoading: null | boolean,
  onSubmit: (data: FormValues) => void;
}

const StartPassRecovery = ({isLoading, onSubmit}: Props) => {
  const {isSmall} = useResponsiveGrid();
  const { translate } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>();

  const formFieldOptions = {
    [FORM_FIELDS.EMAIL]: {
      required: translate("requiredEmail"),
      pattern: {
        value: /^\S+@\S+$/i,
        message: translate("invalidEmail"),
      },
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-800 w-full h-full">
      <LanguageSelect small/>

      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">{translate('passwordRecovery')}</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center">
          <div className="mb-4">
            <label htmlFor="email-input-id" className="block text-sm font-medium text-gray-700">
              {translate('email')}
            </label>
            <input
              id="email-input-id"
              placeholder="email@gmail.com"
              {...register(FORM_FIELDS.EMAIL, formFieldOptions[FORM_FIELDS.EMAIL])}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && isDirty && <p className="mt-1 text-sm text-red-600">{translate('enterEmail')}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex justify-center items-center"
          >
            {translate('recoverPassword')}
            {isLoading && <CustomSpinner />}
          </button>
        </form>
        <div className="flex justify-center mt-4 text-blue-600 hover:text-blue-800">
          <Link to={Paths.sign_in}>
            {translate('signIn')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StartPassRecovery
