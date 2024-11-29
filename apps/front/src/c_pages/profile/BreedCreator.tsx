import * as React from "react";
import {useState} from "react";
import {createBreed} from "../../g_shared/methods/api";
import {toast} from "react-toastify";
import {Accordion} from '../../g_shared/ui_components'
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import PageComponent from "../../d_widgets/PageComponent";

const BreedCreator = () => {
  const [newBreedRuName, changeNewBreedRuName] = useState<string>('')
  const [newBreedEnName, changeNewBreedEnName] = useState<string>('')
  const [newBreedDescription, changeNewBreedDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<null | boolean>(null)
  const {email} = useProfileDataStore()

  const handleSubmit = () => {
    if (email) {
      setIsLoading(true)
      createBreed({
        name: {
          rus: newBreedRuName,
          eng: newBreedEnName
        },
        breedDescription: newBreedDescription,
      }).then(() => {
        toast.info('Порода отправлена на модерацию')
      })
        .catch((e) => {
          console.error(e)
          toast.error('Ошибка при добавлении породы')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  return (
    <PageComponent>
      <div className="p-2 bg-gray-200">
        <div className="overflow-auto">
          <div className="bg-white p-4 m-2 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
              <div className="form-field w-full">
                <label htmlFor="breed-input-ru" className="block text-sm font-medium text-gray-700">
                  Название породы на русском
                </label>
                <input
                  type="text"
                  id="breed-input-ru"
                  placeholder="Название породы"
                  value={newBreedRuName}
                  onChange={event => changeNewBreedRuName(event.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {newBreedRuName === '' && <p className="text-red-500 text-sm">Введите название породы на русском языке</p>}
              </div>

              <div className="form-field w-full">
                <label htmlFor="breed-input-en" className="block text-sm font-medium text-gray-700">
                  Название породы на английском
                </label>
                <input
                  type="text"
                  id="breed-input-en"
                  placeholder="Название породы"
                  value={newBreedEnName}
                  onChange={event => changeNewBreedEnName(event.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {newBreedEnName === '' && <p className="text-red-500 text-sm">Введите название породы на английском языке</p>}
              </div>

              <div className="form-field w-full">
                <label htmlFor="breed-description-input" className="block text-sm font-medium text-gray-700">
                  Ссылка на стандарт породы
                </label>
                <input
                  type="text"
                  id="breed-description-input"
                  placeholder="Ссылка на стандарт породы в сети интернет"
                  value={newBreedDescription}
                  onChange={event => changeNewBreedDescription(event.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {newBreedDescription === '' && <p className="text-red-500 text-sm">Введите ссылку на стандарт породы</p>}
              </div>

              {/* Кнопка "Сохранить" */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center"
              >
                Сохранить новую породу
                {isLoading && <div className="ml-2 spinner-border text-white" role="status"></div>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageComponent>
  )
}

export default BreedCreator
