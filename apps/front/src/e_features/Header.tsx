import React, {useState} from "react";
import {PersonIcon, ExitIcon, BackIcon} from "../g_shared/icons";
import {Link, useRoute, useLocation} from "wouter";
import {Paths} from "../g_shared/constants/routes";
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {signOut} from "../g_shared/methods/api";
import {getRuTranslate} from "../g_shared/constants/translates";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

type Link = {
  path: Paths | string,
  title: string,
  isActive: boolean,
  underlinePosition: string,
}

type Config = {
  title: string,
  submenu?: {
    left: Link,
    right: Link,
    underlineSize: string,
  },
  back: boolean
}

export type ConfigKeys = 'population' | 'profile' | 'contacts' | 'pedigree' | 'breedCreator' | 'documents' | 'calendar' | 'dogCreator' | 'litterCreator' | 'information'

type HeaderConfigs = Record<ConfigKeys, Config>

const Header = () => {
  const {removeAccessToken, setAccessToken} = useProfileDataStore();
  const {isSmall} = useResponsiveGrid();

  const [p] = useLocation()

  const [matchDogsPopulationRoute] = useRoute(Paths.dogs_short)
  const [matchLittersPopulationRoute] = useRoute(Paths.litters_short)
  const [matchDogRoutes] = useRoute('/app/dogs/*?')
  const [matchDogCreator] = useRoute('/app/dogs/create-dog')
  const [matchLittersRoutes] = useRoute('/app/litters/*?')
  const [matchEventsRoutes] = useRoute(Paths.events_short)
  const [matchHistoryRoutes] = useRoute(Paths.history_short)
  const [matchProfileRoutes] = useRoute(Paths.profile)
  const [matchContactsRoutes] = useRoute(Paths.contacts)
  const [matchDocumentsRoutes] = useRoute(Paths.documents)
  const [matchPedigreesRoutes] = useRoute(Paths.pedigrees)
  const [matchBreedCreatorRoute] = useRoute(Paths.breed_creator)

  const configs: HeaderConfigs = {
    population: {
      title: 'population',
      back: false,
      submenu: {
        left: {
          path: Paths.dogs_short,
          title: 'dogs',
          isActive: matchDogsPopulationRoute,
          underlinePosition: 'translate-x-[2.3rem]'
        },
        right: {
          path: Paths.litters_short,
          title: 'litters',
          isActive: matchLittersPopulationRoute,
          underlinePosition: 'translate-x-[14rem]'
        },
        underlineSize: 'w-28'
      }
    },
    dogCreator: {
      title: 'dogCreator',
      back: isSmall
    },
    information: {
      title: 'information',
      back: isSmall
    },
    litterCreator: {
      title: 'litterCreator',
      back: isSmall
    },
    profile: {
      title: 'profile',
      back: isSmall
    },
    contacts: {
      title: 'contacts',
      back: false
    },
    pedigree: {
      title: 'Родословные',
      back: false
    },
    breedCreator: {
      title: 'Добавление новой породы',
      back: true
    },
    documents: {
      title: 'Документы',
      back: false
    },
    calendar: {
      title: 'calendar',
      back: false,
      submenu: {
        left: {
          path: Paths.events_short,
          title: 'events',
          isActive: matchEventsRoutes,
          underlinePosition: 'translate-x-10'
        },
        right: {
          path: Paths.history_short,
          title: 'history',
          isActive: !matchEventsRoutes,
          underlinePosition: 'translate-x-[13.25rem]'
        },
        underlineSize: 'w-28'
      }
    }
  }

  const getConfig = (): Config => {
    if (matchDogsPopulationRoute || matchLittersPopulationRoute) return configs.population
    if (matchDogCreator) return configs.dogCreator
    if (matchDogRoutes) return configs.information
    if (matchLittersRoutes) return configs.litterCreator
    if (matchEventsRoutes || matchHistoryRoutes) return configs.calendar
    if (matchProfileRoutes) return configs.profile
    if (matchContactsRoutes) return configs.contacts
    if (matchDocumentsRoutes) return configs.documents
    if (matchPedigreesRoutes) return configs.pedigree
    if (matchBreedCreatorRoute) return configs.breedCreator
  }

  const handleSignOut = async () => {
    await signOut();
    setAccessToken('');
    removeAccessToken();
    // sessionStorage.removeItem('isSessionInitializationFinished')
  }

  const [isLeftTabActive, setIsLeftTabActive] = useState(getConfig()?.submenu?.left.isActive);

  return (
    <div className='w-full relative'>
      <div className="flex justify-between items-center w-full p-4 bg-white shadow-md">
        <div className="flex items-center w-10">
          {getConfig().back && (
            <button onClick={() => window.history.back()} className="p-2">
              <BackIcon color='#111827'/>
            </button>
          )}
          {!getConfig().back && isSmall && (
            <Link to={`~${Paths.profile}`}>
              <button className="p-2">
                <PersonIcon color='#111827' />
              </button>
            </Link>
          )}
        </div>

        <div className="flex-1 text-center text-lg font-semibold text-gray-900">
          {getRuTranslate(getConfig().title)}
        </div>

        <div className="flex items-center w-10">
          {matchProfileRoutes && (
            <button onClick={handleSignOut} className="p-2">
              <ExitIcon color='#111827'/>
            </button>
          )}
        </div>
      </div>

      {getConfig().submenu && (
        <div className="flex justify-around bg-gray-50 border-t border-gray-200">
          <Link to={getConfig().submenu.left.path}>
            <button
              onClick={() => setIsLeftTabActive(true)}
              className='py-2 px-8'
              style={{
                transition: 'color 0.5s ease',
                color: getConfig().submenu.left.isActive ? '#1F2937' : '#9CA3AF',  // text-gray-800 / text-gray-400
              }}
            >
              {getRuTranslate(getConfig().submenu.left.title)}
            </button>
          </Link>
          <Link to={getConfig().submenu.right.path}>
            <button
              onClick={() => setIsLeftTabActive(false)}
              className='py-2 px-8'
              style={{
                transition: 'color 0.5s ease',
                color: getConfig().submenu.right.isActive ? '#1F2937' : '#9CA3AF',  // text-gray-800 / text-gray-400
              }}
            >
              {getRuTranslate(getConfig().submenu.right.title)}
            </button>
          </Link>
        </div>
      )}
      {getConfig()?.submenu && (
        <div
          className={`absolute bottom-0 h-1 bg-blue-400 rounded-full transition-transform duration-500 ${getConfig().submenu.underlineSize} ${isLeftTabActive ? getConfig().submenu.left.underlinePosition :  getConfig().submenu.right.underlinePosition}`}
        />
      )}
    </div>

  )
}

export default Header
