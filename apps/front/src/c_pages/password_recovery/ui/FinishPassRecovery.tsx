import * as React from "react";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {CustomSpinner} from "../../../g_shared/ui_components";
import LanguageSelect from "../../../e_features/LanguageSelect";
import {useForm} from "react-hook-form";
import {FORM_FIELDS, FormValues} from "../../../g_shared/types/form";
import {useTranslation} from "../../../f_entities/contexts/i18n";

type Props = {
  isLoading:  null | boolean,
  updatePassword: (data: FormValues) => void,
}

const FinishPassRecovery = ({isLoading, updatePassword}: Props) => {
  const {isSmall} = useResponsiveGrid();
  const { translate } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>();

  const passwordValue = watch(FORM_FIELDS.PASSWORD);

  const formFieldOptions = {
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
      <LanguageSelect small/>

      <div className={`bg-white p-6 rounded-lg shadow-lg ${isSmall ? 'w-11/12' : 'w-96'} m-6`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">{translate('passwordRecovery')}</h2>
        </div>
        <form onSubmit={handleSubmit(updatePassword)} className="flex flex-col justify-center space-y-4">
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
            {translate('saveNewPassword')}
            {isLoading && <CustomSpinner />}
          </button>
        </form>
      </div>
    </div>
  )

}

export default FinishPassRecovery
