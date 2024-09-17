import * as React from 'react'

type Props = {text: string, submitButtonText?: string, closePopup: () => void; submitAction?: () => void}

const SubmitActionPopup = ({closePopup, submitAction, text, submitButtonText}: Props) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closePopup}
      onKeyDown={(e) => e.key === 'Escape' && closePopup()}
      tabIndex={-1}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg mx-4"
        onClick={(e) => e.stopPropagation()} // Остановить закрытие при клике внутри
      >
        {/* Текстовое содержимое */}
        <div className="mb-4">
          {text}
        </div>

        {/* Кнопки */}
        <div className="flex justify-around">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
            onClick={closePopup}
          >
            Закрыть
          </button>
          {submitButtonText && (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-full"
              onClick={submitAction}
            >
              {submitButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubmitActionPopup
