import * as React from "react";
import {PersonIcon, ExitIcon} from "../g_shared/icons";
import {Link, useRoute} from "wouter";
import {Paths} from "../g_shared/constants/routes";
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {signOut} from "../g_shared/methods/api";
import {getRuTranslate} from "../g_shared/constants/translates";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

type Link = {
  path: Paths,
  title: string,
  isActive: boolean
}

type Props = {
  title: string,
  submenu?: {
    left: Link,
    right: Link,
  },
  back: boolean
}

const Header = ({title, submenu, back}: Props) => {
  const {removeAccessToken, setAccessToken} = useProfileDataStore();
  const {isSmall} = useResponsiveGrid();

  const [matchProfileRoutes] = useRoute(Paths.profile)


  const handleSignOut = async () => {
    await signOut();
    setAccessToken('');
    removeAccessToken();
    // sessionStorage.removeItem('isSessionInitializationFinished')
  }

  return (
    <div className="w-full">
      {/* Верхний блок с иконками и заголовком */}
      <div className="flex justify-between items-center w-full p-4 bg-gray-100">
        {/* Левая часть: кнопка профиля или "назад" */}
        <div className="flex items-center">
          {back && (
            <button onClick={() => window.history.back()} className="p-2">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {!back && isSmall && (
            <Link to={Paths.profile}>
              <button className="p-2">
                <PersonIcon color='#4c4c4c' />
              </button>
            </Link>
          )}
        </div>

        {/* Центральная часть: заголовок */}
        <div className="flex-1 text-center text-lg font-semibold">
          {getRuTranslate(title)}
        </div>

        {/* Правая часть: иконка выхода (если передана логика) */}
        {matchProfileRoutes && (
          <div className="flex items-center">
            <button onClick={handleSignOut} className="p-2">
              <ExitIcon color='black'/>
            </button>
          </div>
        )}
      </div>

      {/* Подменю */}
      {submenu && (
        <div className="flex justify-between bg-gray-50 p-2 border-t border-gray-200">
          <Link to={submenu.left.path}>
            <button className={`p-2 ${submenu.left.isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}>
              {getRuTranslate(submenu.left.title)}
            </button>
          </Link>
          <Link to={submenu.right.path}>
            <button className={`p-2 ${submenu.right.isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}>
              {getRuTranslate(submenu.right.title)}
            </button>
          </Link>
        </div>
      )}
    </div>

  )
}

export default Header
